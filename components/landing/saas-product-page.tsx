"use client";

import { useActionState, useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  testimonials: Array<{ name: string; role: string; quote: string }>;
}

const initialCheckoutState: CheckoutState = {
  status: "idle",
  message: "",
};

const previewTabs = [
  "কোর্স ড্যাশবোর্ড",
  "ভিডিও মডিউল",
  "অ্যাকশন প্ল্যান",
] as const;

const problemItems = [
  "কীভাবে শুরু করবেন বুঝতে পারছেন না",
  "অনেক কিছু শিখেও ফল পাচ্ছেন না",
  "গাইডলাইন নেই, সবকিছু এলোমেলো",
];

const benefits = [
  {
    title: "স্টেপ বাই স্টেপ ব্লুপ্রিন্ট",
    description: "শুরু থেকে কাজ শুরু করার জন্য পরিস্কার রোডম্যাপ পাবেন।",
    icon: "spark",
  },
  {
    title: "প্রুভেন স্ট্র্যাটেজি",
    description: "যে কৌশলগুলো বাস্তবে কাজ করেছে, সেগুলোই সাজিয়ে দেওয়া হয়েছে।",
    icon: "chart",
  },
  {
    title: "রিয়েল এক্সাম্পল",
    description: "বাস্তব উদাহরণ দেখে বুঝে কাজ করতে পারবেন আরও দ্রুত।",
    icon: "layers",
  },
  {
    title: "দ্রুত শুরু করার গাইড",
    description: "সময় নষ্ট না করে কোথা থেকে শুরু করবেন, সেটি পরিষ্কার থাকবে।",
    icon: "rocket",
  },
  {
    title: "টাইম সেভিং সিস্টেম",
    description: "অগোছালো ট্রাই-অ্যান্ড-এrror বাদ দিয়ে সরাসরি কাজে নামুন।",
    icon: "clock",
  },
  {
    title: "বিগিনার ফ্রেন্ডলি",
    description: "একদম নতুনরাও সহজে অনুসরণ করতে পারবে এমনভাবে সাজানো।",
    icon: "shield",
  },
];

const timelineSteps = [
  "কোর্স এক্সেস নিন",
  "ভিডিও ফলো করুন",
  "অ্যাকশন নিন",
  "রেজাল্ট পেতে শুরু করুন",
];

const includedItems = [
  "সম্পূর্ণ ভিডিও কোর্স",
  "লাইফটাইম এক্সেস",
  "আপডেট ফ্রি",
  "সাপোর্ট গাইড",
];

const useCases = [
  "নতুন কিছু শুরু করতে চান",
  "অনলাইন ইনকাম করতে চান",
  "স্কিল ডেভেলপ করতে চান",
];

const faqs = [
  {
    question: "নতুনদের জন্য কি?",
    answer: "হ্যাঁ, একদম শুরু থেকে শেখানো হয়েছে, তাই নতুনরাও সহজে অনুসরণ করতে পারবেন।",
  },
  {
    question: "মোবাইল থেকে করা যাবে?",
    answer: "অবশ্যই। মোবাইল, ট্যাব বা ল্যাপটপ যেকোনো ডিভাইস থেকেই কোর্স করা যাবে।",
  },
  {
    question: "কোর্স কিনলে কতদিন অ্যাক্সেস থাকবে?",
    answer: "একবার কিনলেই লাইফটাইম অ্যাক্সেস পাবেন এবং ভবিষ্যৎ আপডেটও ফ্রি থাকবে।",
  },
];

function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="market-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

function Icon({ kind }: { kind: "spark" | "chart" | "layers" | "rocket" | "clock" | "shield" | "check" | "faq" }) {
  if (kind === "spark") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 1.8 4.6L18 9.4l-3.3 2.8 1.1 4.3L12 14.2l-3.8 2.3 1.1-4.3L6 9.4l4.2-1.8L12 3Z" /></svg>;
  }
  if (kind === "chart") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></svg>;
  }
  if (kind === "layers") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></svg>;
  }
  if (kind === "rocket") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 19c2.5-.5 4-2 4.5-4.5L16 8l2-5 5-2-2 5-6.5 6.5C14 15 12.5 16.5 10 17l-5 2 2-5Z" /><path d="M12 12 9 9" /></svg>;
  }
  if (kind === "clock") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>;
  }
  if (kind === "shield") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 5 6v6c0 5 3.5 8.5 7 9 3.5-.5 7-4 7-9V6l-7-3Z" /><path d="m9.5 12 1.7 1.7L15 10" /></svg>;
  }
  if (kind === "faq") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 1 1 5.8 1c-.6 1.2-1.7 1.7-2.3 2.3-.4.3-.6.8-.6 1.7" /><path d="M12 17h.01" /></svg>;
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>;
}

export function HeroSection({
  product,
  onBuyNow,
}: {
  product: Product;
  onBuyNow: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,122,24,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,179,71,0.12),transparent_26%),linear-gradient(180deg,rgba(8,16,31,0.95),rgba(7,13,25,0.96))] px-6 py-10 shadow-[0_30px_90px_rgba(8,15,35,0.45)] sm:px-8 lg:px-10 lg:py-14">
      <div className="absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <div className="inline-flex rounded-full border border-orange-300/25 bg-orange-400/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-orange-200">
            {product.title}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            আপনি ঘরে বসেই ইনকাম শুরু করুন
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            ধাপে ধাপে গাইডলাইন, প্র্যাকটিক্যাল স্ট্র্যাটেজি এবং রিয়েল লাইফ উদাহরণসহ সম্পূর্ণ সিস্টেম। {product.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBuyNow}
              className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-7 py-3 text-sm font-black text-slate-950 shadow-[0_18px_45px_rgba(255,122,24,0.28)] transition hover:scale-[1.02]"
            >
              এখনই শুরু করুন
            </button>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              ⭐ ৫০০+ শিক্ষার্থী ইতিমধ্যে শুরু করেছে
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["লাইফটাইম এক্সেস", "বিগিনার ফ্রেন্ডলি", "অ্যাকশনভিত্তিক শেখা"].map((badge) => (
              <div key={badge} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-200">
                {badge}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-8 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="market-card relative overflow-hidden rounded-[2rem] p-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>লাইভ সিস্টেম ভিউ</span>
                <span>৳ {Number(product.price).toFixed(0)}</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="h-[320px] w-full rounded-[1.2rem] object-cover md:h-[420px]" />
                ) : (
                  <div className="flex h-[320px] items-center justify-center rounded-[1.2rem] bg-[radial-gradient(circle_at_top,rgba(255,122,24,0.25),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-center text-sm text-slate-300 md:h-[420px]">
                    আপনার কোর্স ড্যাশবোর্ড, মডিউল এবং রেজাল্ট রোডম্যাপ এখানেই দেখা যাবে
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <SectionShell
      eyebrow="সমস্যা"
      title="কেন এখনো শুরু করতে পারছেন না?"
      description="অনেকেই শুরু করার আগেই থেমে যায়, কারণ সঠিক দিকনির্দেশনা, বাস্তব উদাহরণ আর সহজ অ্যাকশন প্ল্যান একসাথে পায় না।"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {problemItems.map((item, index) => (
          <motion.article
            key={item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="inline-flex rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200">
              সমস্যা {index + 1}
            </div>
            <p className="mt-4 text-lg font-bold text-white">{item}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              এই কোর্স আপনাকে ঠিক কোথা থেকে শুরু করতে হবে, কীভাবে এগোতে হবে এবং কোথায় ফোকাস দিতে হবে সেটি স্পষ্ট করে দেবে।
            </p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

export function BenefitsGrid() {
  return (
    <SectionShell
      eyebrow="সমাধান"
      title="এই কোর্সে যা পাবেন"
      description="আপনার শেখাকে দ্রুত ফলাফলে রূপ দিতে যে বিষয়গুলো দরকার, সেগুলো এক জায়গায় সাজানো আছে।"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit, index) => (
          <motion.article
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-200">
              <Icon kind={benefit.icon as "spark" | "chart" | "layers" | "rocket" | "clock" | "shield"} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">{benefit.description}</p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

export function TimelineSection() {
  return (
    <SectionShell
      eyebrow="কীভাবে কাজ করে"
      title="শুরু থেকে ফলাফল পর্যন্ত সহজ একটি পথ"
      description="এই কোর্সটি এমনভাবে সাজানো হয়েছে যাতে আপনি শুধুই শিখবেন না, ধাপে ধাপে বাস্তব অ্যাকশনও নিতে পারবেন।"
    >
      <div className="relative ml-3 border-l border-white/10 pl-8">
        {timelineSteps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="relative pb-8 last:pb-0"
          >
            <span className="absolute -left-[2.65rem] inline-flex h-8 w-8 items-center justify-center rounded-full border border-orange-300/30 bg-orange-400/15 text-sm font-bold text-orange-200">
              {index + 1}
            </span>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 px-5 py-4">
              <h3 className="text-lg font-bold text-white">{step}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                প্রতিটি ধাপ বাস্তব প্রয়োগের জন্য তৈরি, যাতে শেখার সাথে সাথে আপনি সামনে এগিয়ে যেতে পারেন।
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

export function FeaturesSection() {
  return (
    <SectionShell
      eyebrow="আপনি যা পাবেন"
      title="একসাথে পুরো সিস্টেম হাতে পেয়ে যাবেন"
      description="শুধু ভিডিও নয়, বরং এমন সব রিসোর্স পাবেন যা আপনাকে দ্রুত শুরু করতে এবং ধারাবাহিক থাকতে সাহায্য করবে।"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {includedItems.map((item, index) => (
          <motion.article
            key={item}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
              <Icon kind="check" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">{item}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              ব্যবহারযোগ্য কনটেন্ট, সাপোর্টিভ গাইড এবং পুনরায় দেখার সুবিধা আপনাকে দ্রুত রেজাল্টের দিকে এগিয়ে নেবে।
            </p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

export function PreviewSection({
  product,
}: {
  product: Product;
}) {
  const [activePreview, setActivePreview] = useState(0);

  const previewText = useMemo(
    () => [
      "ড্যাশবোর্ডে প্রবেশ করেই আপনি কোর্সের পুরো রোডম্যাপ দেখতে পাবেন।",
      "প্রতিটি ভিডিও মডিউল ছোট ছোট অ্যাকশনভিত্তিক ধাপে ভাগ করা।",
      "শেষে একটি স্পষ্ট এক্সিকিউশন প্ল্যান থাকবে, যাতে শিখে বসে না থাকেন।",
    ],
    [],
  );

  return (
    <SectionShell
      eyebrow="প্রিভিউ"
      title="ভেতরে কী আছে, আগে দেখুন"
      description="একটি হাই-কনভার্টিং SaaS-স্টাইল অভিজ্ঞতায় কোর্স কনটেন্ট সাজানো হয়েছে, যাতে শেখা সহজ এবং মোটিভেশন ধরে রাখা যায়।"
    >
      <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-3">
          {previewTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActivePreview(index)}
              className={`w-full rounded-[1.4rem] border px-4 py-4 text-left text-sm transition ${
                activePreview === index
                  ? "border-orange-300/40 bg-orange-400/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              }`}
            >
              <span className="block font-bold">{tab}</span>
              <span className="mt-2 block leading-6">{previewText[index]}</span>
            </button>
          ))}
        </div>
        <motion.div
          key={activePreview}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="market-card overflow-hidden rounded-[1.8rem] p-4"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{previewTabs[activePreview]}</span>
              <span>প্রিমিয়াম অ্যাক্সেস</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
              {product.image_url ? (
                <img src={product.image_url} alt={`${product.title} preview`} className="h-[320px] w-full rounded-[1rem] object-cover md:h-[420px]" />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-[1rem] bg-[radial-gradient(circle_at_top_left,rgba(255,122,24,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-center text-sm leading-7 text-slate-300 md:h-[420px]">
                  কোর্সের স্ক্রিনশট, মডিউল ভিউ এবং এক্সিকিউশন সিস্টেম এখানে দেখা যাবে।
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

export function UseCaseSection() {
  return (
    <SectionShell
      eyebrow="কার জন্য"
      title="এই কোর্সটি যাদের জন্য তৈরি"
      description="আপনি যদি শুধু তথ্য নয়, বরং একটি পরিষ্কার সিস্টেম চান, তাহলে এই কোর্সটি আপনার জন্য।"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {useCases.map((item, index) => (
          <motion.article
            key={item}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-lg font-bold text-white">{item}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              আপনি যদি বাস্তবমুখী শেখা এবং দ্রুত অ্যাকশন নিতে চান, এই কোর্স আপনাকে সেই পথে গাইড করবে।
            </p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Array<{ name: string; role: string; quote: string }>;
}) {
  return (
    <SectionShell
      eyebrow="রিভিউ"
      title="শিক্ষার্থীরা কী বলছে"
      description="বাস্তব ব্যবহারকারীর অভিজ্ঞতা আপনার জন্য সবচেয়ে বড় আস্থার জায়গা।"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm leading-7 text-slate-200">“{item.quote}”</p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="font-bold text-white">{item.name}</p>
              <p className="mt-1 text-xs text-slate-400">{item.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

export function PricingCard({
  price,
  onBuyNow,
}: {
  price: number;
  onBuyNow: () => void;
}) {
  return (
    <SectionShell
      eyebrow="অফার"
      title="আজকের জন্য স্পেশাল অফার"
      description="একবার কিনলেই সম্পূর্ণ সিস্টেম হাতে পাবেন, সাথে লাইফটাইম অ্যাক্সেস।"
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-300/30 bg-[linear-gradient(180deg,rgba(255,122,24,0.18),rgba(255,179,71,0.08))] p-6 shadow-[0_28px_80px_rgba(255,122,24,0.16)]">
          <div className="absolute right-6 top-6 rounded-full border border-orange-300/40 bg-orange-400/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
            সীমিত ছাড়
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-100">আজকের জন্য স্পেশাল অফার</p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm text-slate-200">পূর্ণ কোর্স + লাইফটাইম অ্যাক্সেস</p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-5xl font-black text-white">৳ {Number(price).toFixed(0)}</p>
                <p className="pb-2 text-lg text-slate-300 line-through">৳ ১৯৯৯</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">একবারের পেমেন্ট। আপডেট ফ্রি। সাপোর্টসহ।</p>
            </div>
            <button
              type="button"
              onClick={onBuyNow}
              className="rounded-full bg-white px-7 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
            >
              এখনই কিনুন
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function GuaranteeSection() {
  return (
    <SectionShell
      eyebrow="গ্যারান্টি"
      title="ঝুঁকি কম, আত্মবিশ্বাস বেশি"
      description="আপনি যেন নিশ্চিন্তে শুরু করতে পারেন, তাই শেখার মাঝপথে আটকে গেলে সাপোর্ট পাবেন।"
    >
      <div className="grid gap-4 md:grid-cols-[0.38fr_0.62fr]">
        <div className="rounded-[1.7rem] border border-emerald-300/20 bg-emerald-400/10 p-6 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/15 text-emerald-200">
            <Icon kind="shield" />
          </div>
          <p className="mt-4 text-2xl font-black text-white">৭ দিনের সাপোর্ট</p>
        </div>
        <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-bold text-white">৭ দিনের মধ্যে বুঝতে না পারলে সাপোর্ট পাবেন</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            অর্থহীন প্রতিশ্রুতি নয়, বরং বাস্তব সহায়তা। আপনি যদি শুরু করতে গিয়ে কোথাও আটকে যান, আমরা আপনাকে গাইড করব যাতে শেখা থেমে না যায়।
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionShell
      eyebrow="FAQ"
      title="সাধারণ জিজ্ঞাসা"
      description="কোর্স কেনার আগে সবচেয়ে গুরুত্বপূর্ণ প্রশ্নগুলোর উত্তর এখানে দেওয়া আছে।"
    >
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <motion.div key={faq.question} layout className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3 text-white">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-200">
                    <Icon kind="faq" />
                  </span>
                  <span className="font-bold">{faq.question}</span>
                </span>
                <span className="text-2xl text-orange-200">{open ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-300">{faq.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}

export function CheckoutModal({
  isOpen,
  onClose,
  product,
  initialCustomer,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialCustomer: CustomerPrefill;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <CheckoutModalContent onClose={onClose} product={product} initialCustomer={initialCustomer} />
      ) : null}
    </AnimatePresence>
  );
}

function CheckoutModalContent({
  onClose,
  product,
  initialCustomer,
}: {
  onClose: () => void;
  product: Product;
  initialCustomer: CustomerPrefill;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, formAction, isPending] = useActionState(createOrderAction, initialCheckoutState);

  useEffect(() => {
    if (state.status !== "success") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [onClose, state.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const nextErrors: FormErrors = {};
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!fullName) {
      nextErrors.fullName = "নাম লিখুন";
    }
    if (!email || !email.includes("@")) {
      nextErrors.email = "সঠিক ইমেইল দিন";
    }
    if (!phone || phone.length < 11) {
      nextErrors.phone = "সঠিক ফোন নম্বর দিন";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28 }}
        className="market-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-5 shadow-[0_35px_100px_rgba(8,15,35,0.55)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
        >
          বন্ধ
        </button>
        <div className="grid gap-6 md:grid-cols-[0.42fr_0.58fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">চেকআউট</p>
            <h3 className="mt-3 text-2xl font-black text-white">{product.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              আপনার তথ্য দিন এবং পেমেন্ট পদ্ধতি নির্বাচন করুন। পরবর্তী ধাপে আমরা অর্ডারটি রেকর্ড করব।
            </p>
            <div className="mt-6 rounded-[1.4rem] border border-orange-300/25 bg-orange-400/10 p-4">
              <p className="text-sm text-orange-100">আজকের মূল্য</p>
              <p className="mt-2 text-4xl font-black text-white">৳ {Number(product.price).toFixed(0)}</p>
            </div>
          </div>

          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="productSlug" value={product.slug} />
            <input type="hidden" name="paymentMethod" value={paymentMethod} />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-100">নাম</label>
              <input
                name="fullName"
                defaultValue={initialCustomer.fullName}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${
                  errors.fullName ? "border-rose-300/50 bg-rose-400/10" : "border-white/15 bg-white/5 focus:border-orange-300/60"
                }`}
                placeholder="আপনার নাম লিখুন"
              />
              {errors.fullName ? <p className="mt-2 text-xs text-rose-200">{errors.fullName}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-100">ইমেইল</label>
              <input
                name="email"
                type="email"
                defaultValue={initialCustomer.email}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${
                  errors.email ? "border-rose-300/50 bg-rose-400/10" : "border-white/15 bg-white/5 focus:border-orange-300/60"
                }`}
                placeholder="you@example.com"
              />
              {errors.email ? <p className="mt-2 text-xs text-rose-200">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-100">ফোন</label>
              <input
                name="phone"
                defaultValue={initialCustomer.phone}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${
                  errors.phone ? "border-rose-300/50 bg-rose-400/10" : "border-white/15 bg-white/5 focus:border-orange-300/60"
                }`}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone ? <p className="mt-2 text-xs text-rose-200">{errors.phone}</p> : null}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-100">পেমেন্ট অপশন</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "bkash", label: "bKash", hint: "মোবাইল পেমেন্ট" },
                  { id: "sslcommerz", label: "SSLCommerz", hint: "Card / Nagad / Rocket" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                    className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                      paymentMethod === option.id
                        ? "border-orange-300/40 bg-orange-400/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <span className="block font-bold">{option.label}</span>
                    <span className="mt-1 block text-xs text-slate-400">{option.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-5 py-3 text-sm font-black text-slate-950 transition hover:shadow-[0_18px_35px_rgba(255,122,24,0.24)] disabled:opacity-60"
            >
              {isPending ? "প্রসেসিং..." : "পরবর্তী ধাপ"}
            </button>

            {state.accountMessage ? (
              <p className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {state.accountMessage}
              </p>
            ) : null}

            {state.message ? (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  state.status === "success"
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                    : "border-rose-300/20 bg-rose-400/10 text-rose-100"
                }`}
              >
                {state.message}
              </p>
            ) : null}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductLandingPage({
  product,
  initialCustomer,
  testimonials,
}: LandingPageProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-24 pt-8">
        <HeroSection product={product} onBuyNow={() => setIsCheckoutOpen(true)} />
        <ProblemSection />
        <BenefitsGrid />
        <TimelineSection />
        <FeaturesSection />
        <PreviewSection product={product} />
        <UseCaseSection />
        <TestimonialsSection testimonials={testimonials} />
        <PricingCard price={product.price} onBuyNow={() => setIsCheckoutOpen(true)} />
        <GuaranteeSection />
        <FAQAccordion />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="pointer-events-auto mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 shadow-[0_20px_50px_rgba(8,15,35,0.4)] backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-orange-200">স্পেশাল অফার</p>
            <p className="text-sm font-bold text-white">আজই শুরু করুন ৳ {Number(product.price).toFixed(0)}-এ</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-5 py-2.5 text-sm font-black text-slate-950"
          >
            এখনই কিনুন
          </button>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={product}
        initialCustomer={initialCustomer}
      />
    </>
  );
}
