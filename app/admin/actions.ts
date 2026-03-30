"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function buildAdminRedirect(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `/admin?${searchParams.toString()}`;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getFileExt(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() : "bin";
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin&tab=login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return { user };
}

async function uploadToBucket(file: File, bucket: string, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const admin = createAdminClient();
  const ext = getFileExt(file.name || "asset.bin");
  const path = `${folder}/${randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage.from(bucket).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed for ${bucket}: ${error.message}`);
  }

  return `${bucket}/${path}`;
}

function validateProductInput(title: string, description: string, price: number, stockQuantity: number) {
  if (!title || !description) {
    return "Title and description are required.";
  }

  if (Number.isNaN(price) || price < 0) {
    return "Price must be a valid number zero or greater.";
  }

  if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
    return "Stock quantity must be a valid number zero or greater.";
  }

  return null;
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminClient();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const stockQuantity = Number(formData.get("stockQuantity") ?? 0);
  const isActive = formData.get("isActive") === "on";
  const imageFile = formData.get("imageFile");
  const downloadFile = formData.get("downloadFile");

  const validationError = validateProductInput(title, description, price, stockQuantity);
  if (validationError) {
    redirect(buildAdminRedirect({ error: validationError }));
  }

  const slug = toSlug(slugInput || title);

  try {
    const imagePath = imageFile instanceof File ? await uploadToBucket(imageFile, "product-images", "products") : null;
    const filePath = downloadFile instanceof File ? await uploadToBucket(downloadFile, "product-files", "products") : null;

    const { error } = await admin.from("products").insert({
      title,
      slug,
      description,
      price,
      stock_quantity: stockQuantity,
      image_url: imagePath,
      file_url: filePath,
      is_active: isActive,
    });

    if (error) {
      redirect(buildAdminRedirect({ error: error.message }));
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect(buildAdminRedirect({ message: "Product created successfully." }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product could not be created.";
    redirect(buildAdminRedirect({ error: message }));
  }
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminClient();
  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    redirect(buildAdminRedirect({ error: "Product ID was not found for update." }));
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const stockQuantity = Number(formData.get("stockQuantity") ?? 0);
  const isActive = formData.get("isActive") === "on";
  const imageFile = formData.get("imageFile");
  const downloadFile = formData.get("downloadFile");

  const validationError = validateProductInput(title, description, price, stockQuantity);
  if (validationError) {
    redirect(buildAdminRedirect({ error: validationError }));
  }

  const slug = toSlug(slugInput || title);

  try {
    const updates: Record<string, string | number | boolean | null> = {
      title,
      slug,
      description,
      price,
      stock_quantity: stockQuantity,
      is_active: isActive,
    };

    if (imageFile instanceof File && imageFile.size > 0) {
      updates.image_url = await uploadToBucket(imageFile, "product-images", "products");
    }

    if (downloadFile instanceof File && downloadFile.size > 0) {
      updates.file_url = await uploadToBucket(downloadFile, "product-files", "products");
    }

    const { error } = await admin.from("products").update(updates).eq("id", productId);

    if (error) {
      redirect(buildAdminRedirect({ error: error.message }));
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect(buildAdminRedirect({ message: "Product updated successfully." }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product could not be updated.";
    redirect(buildAdminRedirect({ error: message }));
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminClient();
  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    redirect(buildAdminRedirect({ error: "Product ID was not found for deletion." }));
  }

  const { error } = await admin.from("products").delete().eq("id", productId);

  if (error) {
    redirect(buildAdminRedirect({ error: error.message }));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(buildAdminRedirect({ message: "Product deleted successfully." }));
}

export async function updateOrderPaymentStatusAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminClient();
  const orderId = String(formData.get("orderId") ?? "").trim();
  const paymentStatus = String(formData.get("paymentStatus") ?? "pending").trim();

  if (!orderId) {
    redirect(buildAdminRedirect({ error: "Order ID was not found." }));
  }

  const allowed = ["pending", "paid", "failed", "refunded"];
  if (!allowed.includes(paymentStatus)) {
    redirect(buildAdminRedirect({ error: "Invalid payment status." }));
  }

  const { error } = await admin
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId);

  if (error) {
    redirect(buildAdminRedirect({ error: error.message }));
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect(buildAdminRedirect({ message: "Order payment status updated." }));
}
