interface PricingSectionProps {
  price: number;
  stockQuantity: number;
}

export function PricingSection({ price, stockQuantity }: PricingSectionProps) {
  return (
    <section id="pricing" className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase text-amber-800">à¦®à§‚à¦²à§à¦¯</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">à¦†à¦œà¦‡ à¦¤à¦¾à§Žà¦•à§à¦·à¦£à¦¿à¦• à¦…à§à¦¯à¦¾à¦•à§à¦¸à§‡à¦¸ à¦¨à¦¿à¦¨</h2>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black text-slate-900">৳{Number(price).toFixed(2)}</p>
          <p className="mt-1 text-sm text-slate-700">à¦à¦•à¦¬à¦¾à¦°à§‡à¦° à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿà¥¤ à¦•à§‹à¦¨à§‹ à¦ªà§à¦¨à¦°à¦¾à¦¬à§ƒà¦¤à§à¦¤ à¦«à¦¿ à¦¨à§‡à¦‡à¥¤</p>
        </div>
        <a
          href="#checkout"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          à¦à¦–à¦¨à¦‡ à¦•à¦¿à¦¨à§à¦¨
        </a>
      </div>
      <p className="mt-4 text-sm text-rose-700">à¦à¦‡ à¦®à§‚à¦²à§à¦¯à§‡ à¦®à¦¾à¦¤à§à¦° {Math.max(stockQuantity, 3)}à¦Ÿà¦¿ à¦¡à¦¿à¦¸à¦•à¦¾à¦‰à¦¨à§à¦Ÿà§‡à¦¡ à¦²à¦¾à¦‡à¦¸à§‡à¦¨à§à¦¸ à¦¬à¦¾à¦•à¦¿ à¦†à¦›à§‡à¥¤</p>
    </section>
  );
}


