import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/ui/site-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

interface DashboardOrderItem {
  quantity: number;
  unit_price: number;
  products: {
    id: string;
    title: string;
    slug: string;
    file_url: string | null;
  } | null;
}

interface DashboardOrder {
  id: string;
  created_at: string;
  total_price: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "cod" | "bkash" | null;
  order_items: DashboardOrderItem[];
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, role")
    .eq("id", user.id)
    .single();

  const { data: ordersData } = await supabase
    .from("orders")
    .select(
      "id, created_at, total_price, payment_status, payment_method, order_items(quantity, unit_price, products(id, title, slug, file_url))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (ordersData ?? []) as DashboardOrder[];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <DashboardShell
          profile={{
            full_name: profile?.full_name ?? null,
            email: profile?.email ?? null,
            phone: profile?.phone ?? null,
            role: profile?.role ?? null,
          }}
          userEmail={user.email ?? null}
          orders={orders}
        />
      </main>
    </>
  );
}
