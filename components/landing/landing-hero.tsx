import type { Product } from "@/lib/types";

interface LandingHeroProps {
  product: Product;
}

export function LandingHero({ product }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-white md:px-10">
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">প্রিমিয়াম ডিজিটাল প্রোডাক্ট</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{product.title}</h1>
      <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">{product.description}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#pricing"
          className="rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
        >
          এখনই কিনুন - ${Number(product.price).toFixed(2)}
        </a>
        <a href="#features" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold">
          ফিচার দেখুন
        </a>
      </div>
    </section>
  );
}
