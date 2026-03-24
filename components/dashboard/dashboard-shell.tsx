"use client";

import { useMemo, useState } from "react";
import { signOutAction } from "@/app/login/actions";
import { DownloadAccessForm } from "@/components/dashboard/download-access-form";

type DashboardTab = "dashboard" | "purchases" | "downloads" | "profile";

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

interface DashboardShellProps {
  profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
  };
  userEmail: string | null;
  orders: DashboardOrder[];
}

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function paymentBadgeClass(status: DashboardOrder["payment_status"]) {
  if (status === "paid") return "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";
  if (status === "pending") return "border-orange-300/30 bg-orange-400/10 text-orange-200";
  return "border-rose-300/30 bg-rose-400/10 text-rose-200";
}

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "purchases", label: "My Purchases" },
  { id: "downloads", label: "Downloads" },
  { id: "profile", label: "Profile" },
];

function MenuIcon({ tab }: { tab: DashboardTab | "logout" }) {
  if (tab === "dashboard") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
  if (tab === "purchases") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>;
  if (tab === "downloads") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>;
  if (tab === "profile") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>;
}

export function DashboardShell({ profile, userEmail, orders }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");

  const paidDownloads = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    for (const order of orders) {
      if (order.payment_status !== "paid") continue;
      for (const item of order.order_items ?? []) {
        if (item.products?.id && item.products.file_url) {
          map.set(item.products.id, { id: item.products.id, title: item.products.title });
        }
      }
    }
    return Array.from(map.values());
  }, [orders]);

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="market-card sticky top-24 h-fit rounded-2xl p-4">
        <p className="text-sm font-bold text-white">My Workspace</p>
        <nav className="mt-4 space-y-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#ff7a18]/25 to-[#ffb347]/20 text-white"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <MenuIcon tab={tab.id} />
              {tab.label}
            </button>
          ))}
          <form action={signOutAction}>
            <button type="submit" className="mt-2 flex w-full items-center gap-2 rounded-lg border border-red-400/70 bg-red-500/25 px-3 py-2 text-left text-red-200">
              <MenuIcon tab="logout" />
              Logout
            </button>
          </form>
        </nav>
      </aside>

      <section className="space-y-5">
        {activeTab === "dashboard" ? (
          <section className="market-card rounded-2xl p-6">
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
            <p className="mt-2 text-slate-300">Track purchases, payment status, and secure downloads.</p>
          </section>
        ) : null}

        {activeTab === "profile" ? (
          <section className="market-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">Profile</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div><dt className="text-slate-400">Name</dt><dd className="text-slate-100">{profile.full_name ?? "-"}</dd></div>
              <div><dt className="text-slate-400">Email</dt><dd className="text-slate-100">{profile.email ?? userEmail ?? "-"}</dd></div>
              <div><dt className="text-slate-400">Phone</dt><dd className="text-slate-100">{profile.phone ?? "-"}</dd></div>
              <div><dt className="text-slate-400">Role</dt><dd className="uppercase text-slate-100">{profile.role ?? "user"}</dd></div>
            </dl>
          </section>
        ) : null}

        {activeTab === "purchases" ? (
          <section className="market-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">My Purchases</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">No orders yet. Buy a product to see it here.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-400">{formatOrderDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-orange-300">${Number(order.total_price).toFixed(2)}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${paymentBadgeClass(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-200">
                      {(order.order_items ?? []).map((item, index) => (
                        <p key={`${order.id}-${index}`}>
                          {item.products?.title ?? "Product"} x{item.quantity} - ${Number(item.unit_price).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === "downloads" ? (
          <section className="market-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">Downloads</h2>
            <p className="mt-2 text-sm text-slate-300">Download links unlock after payment status becomes paid.</p>
            {paidDownloads.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">No paid downloadable products yet.</p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {paidDownloads.map((product) => (
                  <DownloadAccessForm key={product.id} productId={product.id} title={product.title} />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </section>
    </div>
  );
}
