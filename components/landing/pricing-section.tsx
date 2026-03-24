interface PricingSectionProps {
  price: number;
  stockQuantity: number;
}

export function PricingSection({ price, stockQuantity }: PricingSectionProps) {
  return (
    <section id="pricing" className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Pricing</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">Get Instant Access Today</h2>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black text-slate-900">${Number(price).toFixed(2)}</p>
          <p className="mt-1 text-sm text-slate-700">One-time payment. No recurring fees.</p>
        </div>
        <a
          href="#checkout"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Buy Now
        </a>
      </div>
      <p className="mt-4 text-sm text-rose-700">Only {Math.max(stockQuantity, 3)} discounted licenses left at this price.</p>
    </section>
  );
}
