"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { sendAccountCredentialsEmail } from "@/lib/email/send-account-credentials";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = {
  status: "idle" | "error" | "success";
  message: string;
  accountMessage?: string;
  orderId?: string;
};

function generatePassword() {
  return randomBytes(10).toString("base64url");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createOrderAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const productId = String(formData.get("productId") ?? "").trim();
  const productSlug = String(formData.get("productSlug") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const paymentMethodRaw = String(formData.get("paymentMethod") ?? "bkash").trim();

  if (!productId || !fullName || !email) {
    return {
      status: "error",
      message: "অর্ডার করার আগে পূর্ণ নাম এবং ইমেইল দিন।",
    };
  }

  const paymentMethod = paymentMethodRaw === "sslcommerz" ? "sslcommerz" : "bkash";

  try {
    const admin = createAdminClient();
    const supabase = await createClient();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, title, slug, price, is_active")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return {
        status: "error",
        message: "এই প্রোডাক্টটি বর্তমানে উপলভ্য নয়।",
      };
    }

    let linkedUserId: string | null = null;
    let accountMessage = "";

    if (currentUser?.email?.toLowerCase() === email) {
      linkedUserId = currentUser.id;
      accountMessage =
        "এই ইমেইল দিয়ে একটি অ্যাকাউন্ট পাওয়া গেছে। আপনার অর্ডার সেই অ্যাকাউন্টের সঙ্গে যুক্ত হবে।";
    } else {
      const { data: existingProfile, error: profileError } = await admin
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        return {
          status: "error",
          message: `গ্রাহক অ্যাকাউন্ট যাচাই করা যায়নি: ${profileError.message}`,
        };
      }

      if (existingProfile) {
        linkedUserId = existingProfile.id;
        accountMessage =
          "এই ইমেইল দিয়ে একটি অ্যাকাউন্ট পাওয়া গেছে। আপনার অর্ডার সেই অ্যাকাউন্টের সঙ্গে যুক্ত হবে।";
      } else {
        const generatedPassword = generatePassword();
        const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
          email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone,
          },
        });

        if (createUserError || !createdUser.user) {
          return {
            status: "error",
            message: createUserError?.message ?? "নতুন গ্রাহক অ্যাকাউন্ট তৈরি করা যায়নি।",
          };
        }

        linkedUserId = createdUser.user.id;
        accountMessage =
          "আপনার জন্য একটি অ্যাকাউন্ট তৈরি করা হয়েছে। লগইন তথ্যের জন্য ইমেইল দেখুন।";

        try {
          await sendAccountCredentialsEmail({
            email,
            fullName,
            password: generatedPassword,
          });
        } catch (emailError) {
          console.error("Failed to send credentials email", emailError);
        }
      }
    }

    const totalPrice = Number(product.price);

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: linkedUserId,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone || null,
        customer_address: address || null,
        total_price: totalPrice,
        payment_status: "pending",
        payment_method: paymentMethod,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return {
        status: "error",
        message: orderError?.message ?? "অর্ডার তৈরি করা যায়নি।",
      };
    }

    const { error: itemError } = await admin.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      unit_price: totalPrice,
    });

    if (itemError) {
      return {
        status: "error",
        message: itemError.message,
      };
    }

    if (linkedUserId) {
      await admin
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          email,
        })
        .eq("id", linkedUserId);
    }

    if (productSlug) {
      revalidatePath(`/product/${productSlug}`);
    }
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: `অর্ডার সফলভাবে তৈরি হয়েছে। অর্ডার আইডি: ${order.id}`,
      accountMessage,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Checkout error", error);
    return {
      status: "error",
      message: "অর্ডার করার সময় একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    };
  }
}
