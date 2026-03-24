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
  const paymentMethodRaw = String(formData.get("paymentMethod") ?? "cod").trim();

  if (!productId || !fullName || !email) {
    return {
      status: "error",
      message: "Please provide full name and email before placing the order.",
    };
  }

  const paymentMethod = paymentMethodRaw === "bkash" ? "bkash" : "cod";

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
        message: "This product is currently unavailable.",
      };
    }

    let linkedUserId: string | null = null;
    let accountMessage = "";

    if (currentUser?.email?.toLowerCase() === email) {
      linkedUserId = currentUser.id;
      accountMessage =
        "We found an account with this email. Your order will be linked to it.";
    } else {
      const { data: existingProfile, error: profileError } = await admin
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        return {
          status: "error",
          message: `Unable to validate customer account: ${profileError.message}`,
        };
      }

      if (existingProfile) {
        linkedUserId = existingProfile.id;
        accountMessage =
          "We found an account with this email. Your order will be linked to it.";
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
            message: createUserError?.message ?? "Failed to create a new customer account.",
          };
        }

        linkedUserId = createdUser.user.id;
        accountMessage =
          "We created an account for you. Check your email for login credentials.";

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
        message: orderError?.message ?? "Failed to create order.",
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
      message: `Order created successfully. Order ID: ${order.id}`,
      accountMessage,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Checkout error", error);
    return {
      status: "error",
      message: "Something went wrong while placing your order. Please try again.",
    };
  }
}
