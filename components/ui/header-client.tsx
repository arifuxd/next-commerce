"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderClientProps {
  isLoggedIn: boolean;
}

const links = [
  { href: "/", label: "হোম", icon: "home" },
  { href: "/products", label: "প্রোডাক্ট", icon: "grid" },
  { href: "/about", label: "আমাদের সম্পর্কে", icon: "info" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/products") {
    return pathname === "/products" || pathname.startsWith("/product/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileIcon({ kind }: { kind: (typeof links)[number]["icon"] }) {
  if (kind === "home") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>;
  if (kind === "grid") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
  if (kind === "info") return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 7l9 5 9-5-9-5Z"/><path d="m3 17 9 5 9-5"/><path d="m3 12 9 5 9-5"/></svg>;
}

export function HeaderClient({ isLoggedIn }: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[linear-gradient(120deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          CourseMarket
          <span className="ml-1 bg-gradient-to-r from-[#ff7a18] to-[#ffb347] bg-clip-text text-transparent">X</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#ff7a18]/25 to-[#ffb347]/20 text-white"
                    : "text-slate-100 hover:bg-white/15 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-orange-300/70 hover:text-white sm:inline-flex"
            >
              প্রোফাইল
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-4 py-1.5 text-xs font-black text-slate-950 sm:inline-flex"
            >
              লগইন
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex rounded-full border border-white/25 bg-white/10 p-2 text-white md:hidden"
            aria-label="মেনু টগল করুন"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/15 px-4 pb-4 md:hidden">
          <nav className="mt-3 space-y-2">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-gradient-to-r from-[#ff7a18]/25 to-[#ffb347]/20 text-white"
                      : "text-slate-100 hover:bg-white/10"
                  }`}
                >
                  <MobileIcon kind={link.icon} />
                  {link.label}
                </Link>
              );
            })}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
                প্রোফাইল
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-3 py-2 text-sm font-semibold text-slate-950"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
                লগইন
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
