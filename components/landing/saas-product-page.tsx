"use client";

import { useActionState, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";
import { createOrderAction, type CheckoutState } from "@/app/product/[slug]/actions";
import type { Product } from "@/lib/types";

type CustomerPrefill = {
  fullName: string;
  email: string;
  phone: string;
};

type PaymentMethod = "bkash" | "sslcommerz";
type FormErrors = Partial<Record<"fullName" | "email" | "phone", string>>;

interface LandingPageProps {
  product: Product;
  initialCustomer: CustomerPrefill;
  testimonials: Array<{ name: string; role: string; quote: string; avatar?: string }>;
}

const initialCheckoutState: CheckoutState = { status: "idle", message: "" };

const faqItems = [
  ["ইবুকটি কি সম্পূর্ণ বাংলায় লেখা?", "হ্যাঁ, ইবুকটি সম্পূর্ণ বাংলায় সহজ ভাষায় লেখা হয়েছে।"],
  ["পূর্ব অভিজ্ঞতা না থাকলেও কি পড়তে পারব?", "একদম পারবেন। এটি শূন্য থেকে শেখানোর মতো করে সাজানো।"],
  ["পেমেন্টের পর কখন পাব?", "অর্ডার কনফার্ম হওয়ার পরই অ্যাক্সেস তথ্য পাবেন।"],
  ["কোন ফরম্যাটে ইবুক পাব?", "PDF ও EPUB - দুই ফরম্যাটেই অ্যাক্সেসযোগ্য।"],
];

const bonuses = [
  {
    icon: "file",
    title: "ChatGPT প্রম্পটস চিট শিট",
    value: "৳১৯,৯০০",
    desc: "ইংরেজি প্র্যাকটিসের জন্য ৫০+ রেডিমেড প্রম্পট।",
  },
  {
    icon: "calendar",
    title: "৩০ দিনের প্র্যাকটিস প্ল্যানার",
    value: "৳১৫,০০০",
    desc: "আপনাকে ট্র্যাকে রাখার জন্য দৈনিক সময়সূচী।",
  },
  {
    icon: "gift",
    title: "বোনাস কথোপকথন প্যাক",
    value: "৳১৫,০০০",
    desc: "অ্যাডভান্সড বাস্তব পরিস্থিতির জন্য অতিরিক্ত স্ক্রিপ্ট।",
  },
] as const;

const learnCards = [
  {
    title: "ফেসবুক মার্কেটিং",
    desc: "অডিয়েন্স টার্গেটিং থেকে কনভার্সন অপ্টিমাইজেশন পর্যন্ত।",
    icon: "chart",
    tone: "text-cyan-300",
    box: "bg-cyan-500/10",
    bgTint: "rgba(34, 211, 238, 0.10)",
    borderTint: "rgba(34, 211, 238, 0.35)",
  },
  {
    title: "ভিডিও কন্টেন্ট",
    desc: "স্ক্রিপ্ট, রিলস ও শর্ট ভিডিও দিয়ে দ্রুত রিচ বাড়ানো।",
    icon: "video",
    tone: "text-blue-300",
    box: "bg-blue-500/10",
    bgTint: "rgba(59, 130, 246, 0.10)",
    borderTint: "rgba(59, 130, 246, 0.35)",
  },
  {
    title: "ই-কমার্স বিজনেস",
    desc: "প্রোডাক্ট নির্বাচন, অফার স্ট্রাকচার ও সেলস ফানেল।",
    icon: "bag",
    tone: "text-violet-300",
    box: "bg-violet-500/10",
    bgTint: "rgba(139, 92, 246, 0.10)",
    borderTint: "rgba(139, 92, 246, 0.35)",
  },
  {
    title: "কন্টেন্ট রাইটিং",
    desc: "কপি ও হেডলাইন লিখে সেলস-ফোকাসড কনটেন্ট তৈরি।",
    icon: "pen",
    tone: "text-amber-300",
    box: "bg-amber-500/10",
    bgTint: "rgba(245, 158, 11, 0.10)",
    borderTint: "rgba(245, 158, 11, 0.35)",
  },
  {
    title: "এসইও মাস্টারি",
    desc: "কিওয়ার্ড থেকে অন-পেজ অপ্টিমাইজেশন এক্সিকিউশন।",
    icon: "search",
    tone: "text-fuchsia-300",
    box: "bg-fuchsia-500/10",
    bgTint: "rgba(217, 70, 239, 0.10)",
    borderTint: "rgba(217, 70, 239, 0.35)",
  },
  {
    title: "ইমেইল মার্কেটিং",
    desc: "অটোমেশন ফ্লো ও সিকোয়েন্স দিয়ে রিপিট সেল বাড়ানো।",
    icon: "mail",
    tone: "text-orange-300",
    box: "bg-orange-500/10",
    bgTint: "rgba(249, 115, 22, 0.10)",
    borderTint: "rgba(249, 115, 22, 0.35)",
  },
] as const;

function Icon({ kind, className = "h-5 w-5" }: { kind: string; className?: string }) {
  if (kind === "arrow") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  if (kind === "check") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>;
  if (kind === "chart") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg>;
  if (kind === "video") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>;
  if (kind === "bag") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>;
  if (kind === "pen") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z"/></svg>;
  if (kind === "search") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
  if (kind === "mail") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
  if (kind === "lock") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></svg>;
  if (kind === "book") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6a2 2 0 0 1 2-2h13v16H6a2 2 0 0 1-2-2V6Z"/><path d="M8 4v16"/></svg>;
  if (kind === "download") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>;
  if (kind === "gift") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18v4H3z"/><path d="M12 10v11"/><path d="M4 14v7h16v-7"/><path d="M12 10H7a2 2 0 1 1 0-4c2.5 0 5 4 5 4Z"/><path d="M12 10h5a2 2 0 1 0 0-4c-2.5 0-5 4-5 4Z"/></svg>;
  if (kind === "file") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>;
  if (kind === "calendar") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>;
  if (kind === "hand-stop") return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v8"/><path d="M9 6.2V12"/><path d="M15 6.2V12"/><path d="M6.8 8.5V13"/><path d="M17.2 8.5V13"/><path d="M6.2 12.5 5 11.3a1.6 1.6 0 0 0-2.3 2.2l2.7 2.8A6 6 0 0 0 9.7 18H14a5 5 0 0 0 5-5v-1.5"/></svg>;
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>;
}

function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4">{children}</div>;
}

function SectionTitle({ title, gradient }: { title: string; gradient?: string }) {
  return (
    <h2 className="text-center text-3xl font-bold leading-tight text-white md:text-[2.25rem] lg:text-[2.5rem] light:text-slate-900">
      {title}
      {gradient ? <span className="block bg-gradient-to-r from-[#F97316] to-[#FBBF24] bg-clip-text text-transparent">{gradient}</span> : null}
    </h2>
  );
}

function Hero({ onBuyNow }: { onBuyNow: () => void }) {

  return (
    <section className="pl-hero relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.12),transparent_60%),#0D0D1A] py-16 md:py-24">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle,#8B5CF6 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <Container>
        <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex rounded-full border border-orange-400/30 bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-300 light:border-orange-300 light:bg-orange-100 light:text-orange-700">বাংলাদেশের সেরা ডিজিটাল ইবুক</div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl light:text-slate-900">আপনি মারা গেলেই</h1>
            <h1 className="bg-gradient-to-r from-[#F97316] to-[#FBBF24] bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">ইনকাম সোর্স শেষ!</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-300 light:text-slate-600">তাই চাকরি থেকে বিজনেসে ট্রানজিট করার ৫২ সপ্তাহের কমপ্লিট ব্লুপ্রিন্ট দেখে আজই স্টেপ নিন।</p>
            <p className="mt-3 text-sm text-slate-500 light:text-slate-500">৫,০০০+ পাঠক • PDF + EPUB • তাৎক্ষণিক ডাউনলোড</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <motion.button
                type="button"
                onClick={onBuyNow}
                whileHover={{ y: -2 }}
                className="hero-cta hero-shake group btn-primary shimmer-btn inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(249,115,22,0.35)] sm:px-9 sm:py-4 md:px-10 md:py-5 md:text-lg"
              >
                এখনই ইবুক কিনুন
                <Icon kind="arrow" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.button>
              <div className="text-sm text-slate-400 light:text-slate-600">★★★★★ ৪.৯/৫ রেটিং</div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-300 light:text-slate-700 md:justify-start">
              {["২০০+ পৃষ্ঠার ইবুক", "PDF ও EPUB ফরম্যাট", "লাইফটাইম অ্যাক্সেস"].map((line) => (
                <p key={line} className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300"><Icon kind="check" className="h-3.5 w-3.5" /></span>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[320px]">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              whileHover={{ scale: 1.04 }}
              className="relative overflow-hidden rounded-2xl border border-[#2A2B4A] bg-gradient-to-br from-[#1e1060] via-[#2d1b69] to-[#1a0635] p-4 shadow-[0_0_50px_rgba(139,92,246,0.3)] light:border-slate-300"
            >
              <img src="/book-cover.jpg" alt="Book Cover" className="h-[430px] w-full rounded-xl object-cover" />
              <span className="absolute right-6 top-6 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
                New Arrival
              </span>
              <span className="absolute bottom-6 left-6 rounded-full border border-orange-300/40 bg-orange-500/25 px-3 py-1 text-xs font-semibold text-orange-100 backdrop-blur">
                5000+ Purchased
              </span>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LearnSection() {
  return (
    <section className="pl-testimonials-section bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.08),transparent_60%),#0D0D1A] py-16 light:bg-[radial-gradient(ellipse_at_top_left,rgba(255,122,24,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(250,204,21,0.08),transparent_50%),linear-gradient(180deg,#fffdf8,#fff7ed)]">
      <Container>
        <div className="mb-12 text-center">
          <SectionTitle title="এই ইবুক পড়ে যা শিখবেন" gradient="তা আপনাকে এগিয়ে দিবে" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {learnCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl border p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ backgroundColor: card.bgTint, borderColor: card.borderTint }}
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 ${card.box} ${card.tone}`}>
                <Icon kind={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{card.desc}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function InfoSections({ product, testimonials, onBuyNow }: { product: Product; testimonials: LandingPageProps["testimonials"]; onBuyNow: () => void }) {
  return (
    <>
      <hr className="mx-auto h-px w-full max-w-none border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />

      <section className="pl-section-solid bg-[#0f0f1f] py-16 light:bg-white">
        <Container>
          <div className="mb-12 text-center">
            <SectionTitle title="কেন এই ইবুকটি" gradient="অবশ্যই পড়বেন?" />
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-400 light:text-slate-600">বাংলাদেশে ডিজিটাল ইনকাম নিয়ে ব্যবহারিক ও প্রমাণিত গাইড।</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["book", "সহজ ভাষায় লেখা", "যেকোনো শিক্ষার স্তরের মানুষ সহজে পড়ে বুঝতে পারবেন।", "border-t-[#F97316]", "text-orange-300", "bg-orange-500/10"],
              ["video", "যেকোনো ডিভাইসে পড়ুন", "মোবাইল, ট্যাবলেট, কম্পিউটার - সবখানে পড়া যাবে।", "border-t-[#8B5CF6]", "text-violet-300", "bg-violet-500/10"],
              ["arrow", "তাৎক্ষণিক ডাউনলোড", "অর্ডার করার সাথে সাথে অ্যাক্সেস পাবেন।", "border-t-[#10B981]", "text-emerald-300", "bg-emerald-500/10"],
            ].map(([icon, title, text, b, tone, box], i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`pl-why-card rounded-xl border border-[#2A2B4A] bg-[#12132A] p-6 border-t-[3px] ${b} light:border-slate-200`}
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 ${box} ${tone} light:border-slate-200`}><Icon kind={icon} className="h-5 w-5" /></span>
                <h3 className="mt-4 text-lg font-bold text-white light:text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 light:text-slate-600">{text}</p>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <hr className="mx-auto h-px w-full border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />
      <LearnSection />

      <hr className="mx-auto h-px w-full border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />

      <section id="toc" className="pl-section-panel pl-toc bg-[#0a0a16] py-16 light:bg-[linear-gradient(180deg,#fffefb,#fff8ef)]">
        <Container>
          <div className="mb-12 text-center">
            <SectionTitle title="সুচিপত্র পড়ে দেখুন -" gradient="তারপর সিদ্ধান্ত নিন" />
            <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-400">কিনবো নাকি কিনবো না - কনটেন্ট আগে দেখুন।</p>
          </div>
          <TocPreviewPanel product={product} onBuyNow={onBuyNow} />
        </Container>
      </section>

      <BonusSection />


      <hr className="mx-auto h-px w-full border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />

      <section className="pl-testimonials-section bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.08),transparent_60%),#0D0D1A] py-16 light:bg-[radial-gradient(ellipse_at_top_left,rgba(255,122,24,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(250,204,21,0.08),transparent_50%),linear-gradient(180deg,#fffdf8,#fff7ed)]">
        <Container>
          <div className="mb-12 text-center">
            <SectionTitle title="পাঠকরা কী বলছেন?" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.article key={t.name} whileHover={{ y: -3 }} className="pl-testimonial-card rounded-xl border border-[#2A2B4A] bg-[#12132A] p-6 light:border-slate-200 light:bg-white">
                <p className="text-[#FBBF24]">★★★★★</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 light:text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src={t.avatar ?? `https://i.pravatar.cc/120?img=${i + 10}`} alt={t.name} className="h-10 w-10 rounded-full border border-orange-400/40 object-cover" />
                  <div className="text-center md:text-left">
                    <p className="text-sm font-semibold text-white light:text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400 light:text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <hr className="mx-auto h-px w-full border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />

      <section id="pricing" className="pl-section-panel bg-[#0a0a16] py-16 light:bg-slate-50">
        <Container>
          <div className="mb-12 text-center">
            <SectionTitle title="ইবুকের মূল্য" gradient="ও প্যাকেজ" />
          </div>
          <div className="pl-pricing-card mx-auto max-w-lg rounded-2xl border border-[#8B5CF6] bg-[linear-gradient(135deg,#1A1B35,#12132A)] p-8 text-center light:border-violet-300 light:bg-slate-50">
            <span className="inline-flex rounded-full bg-violet-900/50 px-3 py-1 text-xs font-semibold text-violet-300 light:bg-violet-100 light:text-violet-700">সবচেয়ে জনপ্রিয়</span>
            <h3 className="mt-4 text-2xl font-bold text-white">সম্পূর্ণ ইবুক প্যাকেজ</h3>
            <div className="mt-4 flex items-end justify-center gap-3">
              <span className="text-2xl text-slate-500 line-through">৳{Math.max(Math.round(product.price * 2.4), product.price + 700)}</span>
              <span className="bg-gradient-to-r from-[#F97316] to-[#FBBF24] bg-clip-text text-5xl font-bold text-transparent">৳{Number(product.price).toFixed(0)}</span>
            </div>
            <div className="mt-6 space-y-2 text-left">
              {[
                "২০০+ পেইজ প্র্যাকটিক্যাল ব্লুপ্রিন্ট",
                "PDF + EPUB সাথে ইনস্ট্যান্ট অ্যাক্সেস",
                "রিয়েল মার্কেটিং টেমপ্লেট ও চেকলিস্ট",
                "লাইফটাইম আপডেট এবং সাপোর্ট",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-slate-200 light:text-slate-700">
                  <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400/50 text-emerald-300">
                    <Icon kind="check" className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </p>
              ))}
            </div>
            <button type="button" onClick={onBuyNow} className="btn-primary shimmer-btn mt-8 w-full rounded-lg px-5 py-4 text-lg font-semibold text-white">এখনই ইবুক কিনুন</button>
          </div>
        </Container>
      </section>

      <hr className="mx-auto h-px w-full border-0 bg-gradient-to-r from-transparent via-[#2A2B4A] to-transparent light:via-slate-200" />

      <section id="faq" className="pl-section-panel bg-[#0a0a16] py-16 light:bg-slate-50">
        <Container>
          <div className="mb-12 text-center">
            <SectionTitle title="সচরাচর জিজ্ঞাসা" gradient="(FAQ)" />
          </div>
          <FaqBlock />
        </Container>
      </section>
    </>
  );
}

function TocPreviewPanel({ product, onBuyNow }: { product: Product; onBuyNow: () => void }) {
  const slides = [
    product.image_url ?? `https://picsum.photos/seed/${product.slug}-1/900/1200`,
    `https://picsum.photos/seed/${product.slug}-2/900/1200`,
    `https://picsum.photos/seed/${product.slug}-3/900/1200`,
    `https://picsum.photos/seed/${product.slug}-4/900/1200`,
    `https://picsum.photos/seed/${product.slug}-5/900/1200`,
    `https://picsum.photos/seed/${product.slug}-6/900/1200`,
  ];

  const chapterList = ["সূচিপত্র (কোর্স প্রিভিউ)", "দা টেমপ্লেটস", "দা আর্কিটাইপ", "দা বিহেভিয়ার", "দা ফ্রেম", "দা এক্সিকিউশন", "দা গ্রোথপ্ল্যান"];
  const [index, setIndex] = useState(0);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2A2B4A] bg-[#0b1228] light:border-amber-100/80 light:bg-[linear-gradient(180deg,#fffefb,#fff7ed)]">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative border-r border-[#2A2B4A] p-4 light:border-amber-100/70">
          <button type="button" onClick={() => setIndex((v) => (v - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#2A2B4A] bg-[#050b1a] text-white light:border-amber-200 light:bg-white light:text-slate-700" aria-label="Previous"><Icon kind="arrow" className="h-4 w-4 rotate-180" /></button>
          <button type="button" onClick={() => setIndex((v) => (v + 1) % slides.length)} className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#2A2B4A] bg-[#050b1a] text-white light:border-amber-200 light:bg-white light:text-slate-700" aria-label="Next"><Icon kind="arrow" className="h-4 w-4" /></button>

          <div className="mx-auto max-w-md rounded-xl bg-[#020716] p-3 light:bg-white">
            <div className="overflow-hidden rounded-md border border-white/10">
              <img src={slides[index]} alt={`Preview page ${index + 1}`} className="h-[560px] w-full object-cover" />
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="pl-toc-page-count inline-flex rounded-full border border-[#2A2B4A] bg-[#050b1a] px-3 py-1 text-xs text-slate-300 light:border-amber-200 light:bg-[#0b1b3a] light:text-white">Page {index + 1} of {slides.length}</span>
          </div>
        </div>

        <div className="flex flex-col bg-[#0e162b] light:bg-[#fffaf0]">
          <div className="flex items-center gap-2 border-b border-[#2A2B4A] px-5 py-4 text-sm font-semibold uppercase text-[#FBBF24] light:border-amber-100 light:text-amber-600">
            <Icon kind="book" className="h-4 w-4" />
            Table of Contents
          </div>
          <div className="flex-1 space-y-2 px-4 py-4">
            {chapterList.map((chapter, i) => {
              const active = i === 0;
              return (
                <div key={chapter} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "pl-toc-active-label border border-[#FBBF24]/50 bg-[linear-gradient(135deg,rgba(249,115,22,0.95),rgba(245,158,11,0.9))] text-white light:border-amber-300" : "text-slate-500 opacity-70 light:text-slate-600 light:opacity-100"}`}>
                  {active ? <span className="h-2 w-2 rounded-full bg-[#FBBF24]" /> : <Icon kind="lock" className="h-4 w-4" />}
                  <span>{chapter}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[#2A2B4A] px-5 py-4 light:border-amber-100">
            <p className="text-[11px] uppercase text-slate-400 light:text-white">Full Version</p>
            <p className="mt-1 text-2xl font-bold text-white light:text-white">২০০+ পেইজ</p>
            <button type="button" onClick={onBuyNow} className="btn-primary shimmer-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"><Icon kind="download" className="h-4 w-4" />এখনই কিনুন ({Number(product.price).toFixed(0)})</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BonusSection() {
  return (
    <section className="py-20 md:py-24 light:bg-slate-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mx-auto mb-4 relative h-16 w-16 text-red-300">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="rgba(239,68,68,0.15)" stroke="rgba(248,113,113,0.9)" strokeWidth="3" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <Hand className="h-7 w-7" strokeWidth={2.3} />
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl light:text-slate-900">
            থামুন, আরও আছে
          </h2>
          <p className="mt-4 text-lg text-slate-400 light:text-slate-600">আজ কিনলে এই বোনাসগুলো সম্পূর্ণ ফ্রি পাচ্ছেন।</p>
        </motion.div>

        <div className="mx-auto max-w-4xl space-y-4">
          {bonuses.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-[#2A2B4A] bg-[#12132A]/85 p-6 light:border-slate-200 light:bg-white"
            >
              <div className="flex items-center gap-5">
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FBBF24] p-3 text-white">
                  <Icon kind={b.icon} className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white light:text-slate-900">{b.title}</h3>
                  <p className="text-sm text-slate-400 light:text-slate-600">{b.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm text-slate-400 line-through light:text-slate-500">{b.value}</span>
                  <p className="font-bold text-[#FBBF24]">ফ্রি</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-4xl rounded-xl border border-[#2A2B4A] bg-[#12132A]/70 p-6 text-center light:border-slate-200 light:bg-white"
        >
          <p className="text-slate-400 light:text-slate-600">মোট বোনাস মূল্য: <span className="line-through">৳৪৯,৯০০</span></p>
          <p className="text-2xl font-bold bg-gradient-to-r from-[#F97316] to-[#FBBF24] bg-clip-text text-transparent">আজই ফ্রি অন্তর্ভুক্ত!</p>
        </motion.div>
      </Container>
    </section>
  );
}
function FaqBlock() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqItems.map(([q, a], i) => (
        <article key={q} className="pl-faq-card rounded-lg border border-[#2A2B4A] bg-[#12132A] px-5 py-4 light:border-slate-200 light:bg-white">
          <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between text-left">
            <span className="text-sm font-semibold text-white light:text-slate-900">{q}</span>
            <span className="text-lg text-orange-400">{open === i ? "−" : "+"}</span>
          </button>
          {open === i ? <p className="mt-3 text-sm text-slate-400 light:text-slate-600">{a}</p> : null}
        </article>
      ))}
    </div>
  );
}

function StickyBuyBar({ product, onBuyNow }: { product: Product; onBuyNow: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-3 md:hidden">
      <div className="pointer-events-auto rounded-xl border border-[#1A1B35] bg-[#0A0A18]/97 p-3 light:border-slate-300 light:bg-white/95">
        <button type="button" onClick={onBuyNow} className="btn-primary shimmer-btn w-full rounded-lg px-5 py-3 text-sm font-semibold text-white">এখনই ইবুক কিনুন — ৳{Number(product.price).toFixed(0)}</button>
      </div>
    </div>
  );
}

function CheckoutModal({ isOpen, onClose, product, initialCustomer }: { isOpen: boolean; onClose: () => void; product: Product; initialCustomer: CustomerPrefill }) {
  return <AnimatePresence>{isOpen ? <CheckoutModalContent onClose={onClose} product={product} initialCustomer={initialCustomer} /> : null}</AnimatePresence>;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="text-center md:text-left">
      <label className="mb-1.5 block text-sm font-semibold text-slate-100 light:text-slate-700">{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-rose-200 light:text-rose-600">{error}</p> : null}
    </div>
  );
}

function CheckoutModalContent({ onClose, product, initialCustomer }: { onClose: () => void; product: Product; initialCustomer: CustomerPrefill }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, formAction, isPending] = useActionState(createOrderAction, initialCheckoutState);

  useEffect(() => {
    if (state.status !== "success") return;
    const timer = window.setTimeout(() => onClose(), 1200);
    return () => window.clearTimeout(timer);
  }, [onClose, state.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const nextErrors: FormErrors = {};
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    if (!fullName) nextErrors.fullName = "Please enter your name";
    if (!email || !email.includes("@")) nextErrors.email = "Please enter a valid email";
    if (!phone || phone.length < 11) nextErrors.phone = "Please enter a valid phone number";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) event.preventDefault();
  }

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }} className="relative w-full max-w-2xl rounded-2xl border border-[#2A2B4A] bg-[#12132A] p-5 pt-14 light:border-slate-200 light:bg-white">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white light:border-slate-300 light:bg-slate-100 light:text-slate-700">Close</button>

        <div className="grid gap-5 md:grid-cols-[0.4fr_0.6fr]">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-slate-50">
            <p className="text-xs font-semibold uppercase text-orange-300">Checkout</p>
            <h3 className="mt-2 text-2xl font-black text-white light:text-slate-900">{product.title}</h3>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
              <img src={product.image_url ?? "/window.svg"} alt={product.title} className="h-32 w-full object-cover" />
            </div>
            <p className="mt-3 text-sm text-slate-300 light:text-slate-600">অর্ডার কনফার্ম করতে তথ্য দিন।</p>
            <p className="mt-4 text-3xl font-black text-[#FBBF24]">৳{Number(product.price).toFixed(0)}</p>
          </div>

          <form action={formAction} onSubmit={handleSubmit} className="space-y-3">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="productSlug" value={product.slug} />
            <input type="hidden" name="paymentMethod" value={paymentMethod} />
            <Field label="Full Name" error={errors.fullName}><input name="fullName" defaultValue={initialCustomer.fullName} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 light:border-slate-300 light:bg-white light:text-slate-900 light:placeholder:text-slate-400" placeholder="Your full name" /></Field>
            <Field label="Email" error={errors.email}><input name="email" type="email" defaultValue={initialCustomer.email} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 light:border-slate-300 light:bg-white light:text-slate-900 light:placeholder:text-slate-400" placeholder="you@example.com" /></Field>
            <Field label="Phone" error={errors.phone}><input name="phone" defaultValue={initialCustomer.phone} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 light:border-slate-300 light:bg-white light:text-slate-900 light:placeholder:text-slate-400" placeholder="01XXXXXXXXX" /></Field>
            <div className="text-center md:text-left">
              <p className="mb-2 text-sm font-semibold text-slate-100 light:text-slate-700">Payment Method</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[{ id: "bkash", label: "bKash" }, { id: "sslcommerz", label: "SSLCommerz" }].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                    className={`rounded-xl border px-3 py-2 text-sm ${paymentMethod === option.id ? "border-orange-300/50 bg-orange-500/15 text-white light:text-orange-700" : "border-white/15 bg-white/5 text-white/80 light:border-slate-300 light:bg-white light:text-slate-700"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={isPending} className="btn-primary shimmer-btn w-full rounded-xl px-5 py-3 text-sm font-black text-white disabled:opacity-60">{isPending ? "Processing..." : "Place Order"}</button>
            {state.accountMessage ? <p className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 light:text-cyan-700">{state.accountMessage}</p> : null}
            {state.message ? <p className={`rounded-xl border px-3 py-2 text-sm ${state.status === "success" ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100 light:text-emerald-700" : "border-rose-300/25 bg-rose-500/10 text-rose-100 light:text-rose-700"}`}>{state.message}</p> : null}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductLandingPage({ product, initialCustomer, testimonials }: LandingPageProps) {
  const [openCheckout, setOpenCheckout] = useState(false);

  return (
    <div className="product-landing w-full bg-[#0D0D1A] light:bg-[#f8fafc]">
      <Hero onBuyNow={() => setOpenCheckout(true)} />
      <InfoSections product={product} testimonials={testimonials} onBuyNow={() => setOpenCheckout(true)} />
      <StickyBuyBar product={product} onBuyNow={() => setOpenCheckout(true)} />
      <CheckoutModal isOpen={openCheckout} onClose={() => setOpenCheckout(false)} product={product} initialCustomer={initialCustomer} />
      <style jsx global>{`.hero-shake {
          animation: heroShakePause 4.8s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes heroShakePause {
          0%, 80%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          83% { transform: translate3d(-1px, 0, 0) rotate(-0.3deg); }
          86% { transform: translate3d(1px, -1px, 0) rotate(0.3deg); }
          89% { transform: translate3d(-1px, 1px, 0) rotate(-0.2deg); }
          92% { transform: translate3d(1px, 0, 0) rotate(0.2deg); }
          95% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }        .btn-primary {
          background-color: #f97316 !important;
          background-image: linear-gradient(135deg, #f97316, #ea580c) !important;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.2), 0 10px 28px rgba(249, 115, 22, 0.36) !important;
        }
        .btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.28), 0 16px 38px rgba(249, 115, 22, 0.42) !important;
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: "";
          position: absolute;
          top: -20%;
          left: -130%;
          width: 70%;
          height: 140%;
          transform: skewX(-22deg);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
          transition: left 0.7s ease;
          pointer-events: none;
        }
        .shimmer-btn:hover::after {
          left: 140%;
        }
        button:not(.hero-cta):not(:disabled) {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        button:not(.hero-cta):not(:disabled):hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}
























