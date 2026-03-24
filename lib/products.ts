import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const productColumns =
  "id, title, slug, description, price, image_url, file_url, is_active, stock_quantity";

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data ?? []) as Product[];
}

export async function getActiveProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return (data as Product | null) ?? null;
}
