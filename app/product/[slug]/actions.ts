"use server";

import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAccountCredentialsEmail } from "@/lib/email/send-account-credentials";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = {
  status: "idle" | "error" | "success";
  message: string;
  accountMessage?: string;
};

function generatePassword() {
  return randomBytes(8).toString("base64url");
}

export async function createOrderAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const productId = String(formData.get("productId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const paymentMethodRaw = String(formData.get("paymentMethod") ?? "bkash").trim().toLowerCase();

  if (!productId || !fullName || !email) {
    return {
      status: "error",
      message: "Missing required checkout fields.",
    };
  }

  if (!email.includes("@")) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const admin = createAdminClient();

  const { data: product, error: productError } = await admin
    .from("products")
    .select("id, title, price, is_active")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product || !product.is_active) {
    return {
      status: "error",
      message: "This product is not available right now.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let linkedUserId: string | null = null;
  let accountMessage = "";

  if (user?.id && user.email?.toLowerCase() === email) {
    linkedUserId = user.id;
    accountMessage = "Your order is linked to your logged-in account.";
  } else {
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile?.id) {
      linkedUserId = existingProfile.id;
      accountMessage = "We found an account with this email. Your order has been linked to it.";
    } else {
      const generatedPassword = generatePassword();
      const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (createUserError || !createdUser.user) {
        return {
          status: "error",
          message: createUserError?.message ?? "Could not create account for checkout.",
        };
      }

      linkedUserId = createdUser.user.id;

      await admin
        .from("profiles")
        .upsert(
          {
            id: linkedUserId,
            email,
            full_name: fullName,
            phone: phone || null,
          },
          { onConflict: "id" },
        );

      try {
        await sendAccountCredentialsEmail({
          email,
          fullName,
          password: generatedPassword,
        });
      } catch (error) {
        console.error("[checkout] failed to send credentials", error);
      }

      accountMessage = "We created an account for you. Check your email for login credentials.";
    }
  }

  const paymentMethod = paymentMethodRaw === "bkash" ? "bkash" : "cod";

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: linkedUserId,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone || null,
      customer_address: address || null,
      total_price: product.price,
      payment_status: "pending",
      payment_method: paymentMethod,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return {
      status: "error",
      message: orderError?.message ?? "Could not create order.",
    };
  }

  const { error: itemError } = await admin.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    quantity: 1,
    unit_price: product.price,
  });

  if (itemError) {
    return {
      status: "error",
      message: itemError.message,
    };
  }

  return {
    status: "success",
    message: "Order created successfully. Payment status is pending.",
    accountMessage,
  };
}
