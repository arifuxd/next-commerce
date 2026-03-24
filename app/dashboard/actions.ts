"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type DownloadState = {
  status: "idle" | "error" | "success";
  message: string;
  url?: string;
};

function parseStorageReference(fileUrl: string): { bucket: string; path: string } | null {
  const raw = fileUrl.trim();
  if (!raw) {
    return null;
  }

  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    const parts = raw.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { bucket: parts[0], path: parts.slice(1).join("/") };
    }
    return null;
  }

  try {
    const url = new URL(raw);
    const path = url.pathname;

    const match = path.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/([^/]+)\/(.+)$/);
    if (!match) {
      return null;
    }

    return {
      bucket: decodeURIComponent(match[1]),
      path: decodeURIComponent(match[2]),
    };
  } catch {
    return null;
  }
}

export async function requestProductDownloadAction(
  _prevState: DownloadState,
  formData: FormData,
): Promise<DownloadState> {
  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    return {
      status: "error",
      message: "Invalid product download request.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please log in to download purchased files.",
    };
  }

  const admin = createAdminClient();

  const { data: paidOrders, error: ordersError } = await admin
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("payment_status", "paid")
    .limit(500);

  if (ordersError) {
    return {
      status: "error",
      message: `Failed to verify paid orders: ${ordersError.message}`,
    };
  }

  const paidOrderIds = (paidOrders ?? []).map((order) => order.id);

  if (paidOrderIds.length === 0) {
    return {
      status: "error",
      message: "Download becomes available after payment is confirmed.",
    };
  }

  const { data: matchingItem, error: itemError } = await admin
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .in("order_id", paidOrderIds)
    .limit(1)
    .maybeSingle();

  if (itemError) {
    return {
      status: "error",
      message: `Failed to verify purchase ownership: ${itemError.message}`,
    };
  }

  if (!matchingItem) {
    return {
      status: "error",
      message: "You have not purchased this file yet.",
    };
  }

  const { data: product, error: productError } = await admin
    .from("products")
    .select("title, file_url")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product || !product.file_url) {
    return {
      status: "error",
      message: "Download file is not available for this product.",
    };
  }

  const reference = parseStorageReference(product.file_url);
  if (!reference) {
    return {
      status: "error",
      message: "Invalid storage path configured for this product file.",
    };
  }

  const { data: signedData, error: signedError } = await admin.storage
    .from(reference.bucket)
    .createSignedUrl(reference.path, 60 * 15);

  if (signedError || !signedData?.signedUrl) {
    return {
      status: "error",
      message: signedError?.message ?? "Failed to generate secure download link.",
    };
  }

  return {
    status: "success",
    message: "Secure link ready. It expires in 15 minutes.",
    url: signedData.signedUrl,
  };
}
