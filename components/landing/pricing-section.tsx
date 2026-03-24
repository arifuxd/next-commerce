interface PricingSectionProps {
  price: number;
  stockQuantity: number;
}

export function PricingSection({ price, stockQuantity }: PricingSectionProps) {
  return (
    <section id="pricing" className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">মূল্য</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">আজই তাৎক্ষণিক অ্যাক্সেস নিন</h2>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black text-slate-900">${Number(price).toFixed(2)}</p>
          <p className="mt-1 text-sm text-slate-700">একবারের পেমেন্ট। কোনো পুনরাবৃত্ত ফি নেই।</p>
        </div>
        <a
          href="#checkout"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          এখনই কিনুন
        </a>
      </div>
      <p className="mt-4 text-sm text-rose-700">এই মূল্যে মাত্র {Math.max(stockQuantity, 3)}টি ডিসকাউন্টেড লাইসেন্স বাকি আছে।</p>
    </section>
  );
}
