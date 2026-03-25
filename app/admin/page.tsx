import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createProductAction,
  deleteProductAction,
  updateOrderPaymentStatusAction,
  updateProductAction,
} from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { SiteHeader } from "@/components/ui/site-header";
import { signOutAction } from "@/app/login/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

interface AdminPageProps {
  searchParams: Promise<{
    message?: string;
    error?: string;
    tab?: string;
    edit?: string;
  }>;
}

interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  file_url: string | null;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
}

interface AdminOrderItem {
  quantity: number;
  unit_price: number;
  products: {
    title: string;
    slug: string;
  } | null;
}

interface AdminOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_price: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "bkash" | "sslcommerz" | null;
  user_id: string | null;
  order_items: AdminOrderItem[];
}

interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: "user" | "admin";
  created_at: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const tabs = [
  { id: "products", label: "প্রোডাক্ট" },
  { id: "orders", label: "অর্ডার" },
  { id: "users", label: "ইউজার" },
] as const;

function AdminMenuIcon({ tab }: { tab: "products" | "orders" | "users" | "logout" }) {
  if (tab === "products") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 7l9 5 9-5-9-5Z"/><path d="m3 17 9 5 9-5"/><path d="m3 12 9 5 9-5"/></svg>;
  if (tab === "orders") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3h8l4 4v14H4V3h4Z"/><path d="M8 3v4h8V3"/><path d="M8 13h8M8 17h6"/></svg>;
  if (tab === "users") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M15 20a4 4 0 0 1 6 0"/></svg>;
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const activeTab = params.tab === "orders" || params.tab === "users" ? params.tab : "products";

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
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const [{ data: productsData }, { data: ordersData }, { data: usersData }] = await Promise.all([
    admin.from("products").select("*").order("created_at", { ascending: false }),
    admin
      .from("orders")
      .select(
        "id, created_at, customer_name, customer_email, customer_phone, total_price, payment_status, payment_method, user_id, order_items(quantity, unit_price, products(title, slug))",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    admin
      .from("profiles")
      .select("id, email, full_name, phone, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const products = (productsData ?? []) as AdminProduct[];
  const orders = (ordersData ?? []) as unknown as AdminOrder[];
  const users = (usersData ?? []) as AdminUser[];

  const selectedProduct = products.find((p) => p.id === params.edit);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
          <aside className="market-card sticky top-24 h-fit rounded-2xl p-4">
            <p className="text-sm font-bold text-white">অ্যাডমিন কনসোল</p>
            <nav className="mt-4 space-y-2 text-sm">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/admin?tab=${tab.id}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#ff7a18]/25 to-[#ffb347]/20 text-white"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <AdminMenuIcon tab={tab.id} />
                  {tab.label}
                </Link>
              ))}
              <form action={signOutAction} className="mt-6">
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg border border-red-400/70 bg-red-500/25 px-3 py-2 text-left text-red-200">
                  <AdminMenuIcon tab="logout" />
                  লগআউট
                </button>
              </form>
            </nav>
          </aside>

          <section className="space-y-5">
            <section className="market-card rounded-2xl p-6">
              <h1 className="text-3xl font-black text-white">অ্যাডমিন প্যানেল</h1>
              <p className="mt-1 text-sm text-slate-300">প্রোডাক্ট, অর্ডার, ইউজার এবং অন্যান্য কনটেন্ট ম্যানেজ করুন।</p>
            </section>

            {params.message ? (
              <p className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {params.message}
              </p>
            ) : null}
            {params.error ? (
              <p className="rounded-xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{params.error}</p>
            ) : null}

            {activeTab === "products" ? (
              <>
                <section className="market-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white">নতুন প্রোডাক্ট তৈরি করুন</h2>
                  <div className="mt-4">
                    <ProductForm title="নতুন প্রোডাক্ট" submitLabel="প্রোডাক্ট তৈরি করুন" action={createProductAction} />
                  </div>
                </section>

                <section className="market-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white">বিদ্যমান প্রোডাক্ট</h2>
                  {products.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-300">এখনও কোনো প্রোডাক্ট তৈরি হয়নি।</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {products.map((product) => (
                        <article key={product.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{product.title}</p>
                              <p className="text-xs text-slate-400">{product.slug} - ${Number(product.price).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin?tab=products&edit=${product.id}`}
                                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-100"
                              >
                                সম্পাদনা
                              </Link>
                              <form action={deleteProductAction}>
                                <input type="hidden" name="productId" value={product.id} />
                                <button type="submit" className="rounded-full border border-rose-300/40 px-3 py-1 text-xs font-semibold text-rose-200">
                                  মুছুন
                                </button>
                              </form>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {selectedProduct ? (
                  <section className="market-card rounded-2xl p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h2 className="text-xl font-bold text-white">প্রোডাক্ট সম্পাদনা: {selectedProduct.title}</h2>
                      <Link href="/admin?tab=products" className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                        বন্ধ করুন
                      </Link>
                    </div>
                    <ProductForm title="প্রোডাক্ট সম্পাদনা" submitLabel="প্রোডাক্ট আপডেট করুন" action={updateProductAction} values={selectedProduct} />
                  </section>
                ) : null}
              </>
            ) : null}

            {activeTab === "orders" ? (
              <section className="market-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white">অর্ডারসমূহ</h2>
                {orders.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-300">এখনও কোনো অর্ডার নেই।</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                          <th className="py-2 pr-4">অর্ডার</th>
                          <th className="py-2 pr-4">গ্রাহক</th>
                          <th className="py-2 pr-4">আইটেম</th>
                          <th className="py-2 pr-4">মোট</th>
                          <th className="py-2 pr-4">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/10 align-top">
                            <td className="py-3 pr-4 text-slate-100">
                              <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                              <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                            </td>
                            <td className="py-3 pr-4 text-slate-200">
                              <p>{order.customer_name}</p>
                              <p className="text-xs text-slate-400">{order.customer_email}</p>
                            </td>
                            <td className="py-3 pr-4">
                              {(order.order_items ?? []).map((item, idx) => (
                                <p key={`${order.id}-${idx}`} className="text-xs text-slate-300">
                                  {item.products?.title ?? "প্রোডাক্ট"} x{item.quantity}
                                </p>
                              ))}
                            </td>
                            <td className="py-3 pr-4 text-slate-100">${Number(order.total_price).toFixed(2)}</td>
                            <td className="py-3 pr-4">
                              <OrderStatusForm orderId={order.id} currentStatus={order.payment_status} action={updateOrderPaymentStatusAction} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : null}

            {activeTab === "users" ? (
              <section className="market-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white">ইউজারসমূহ</h2>
                {users.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-300">কোনো ইউজার পাওয়া যায়নি।</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                          <th className="py-2 pr-4">নাম</th>
                          <th className="py-2 pr-4">ইমেইল</th>
                          <th className="py-2 pr-4">ফোন</th>
                          <th className="py-2 pr-4">ভূমিকা</th>
                          <th className="py-2 pr-4">যোগদানের তারিখ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((entry) => (
                          <tr key={entry.id} className="border-b border-white/10">
                            <td className="py-3 pr-4 text-slate-100">{entry.full_name ?? "-"}</td>
                            <td className="py-3 pr-4 text-slate-300">{entry.email ?? "-"}</td>
                            <td className="py-3 pr-4 text-slate-300">{entry.phone ?? "-"}</td>
                            <td className="py-3 pr-4 uppercase text-slate-100">{entry.role}</td>
                            <td className="py-3 pr-4 text-xs text-slate-400">{formatDate(entry.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}

