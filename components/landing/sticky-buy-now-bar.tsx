interface StickyBuyNowBarProps {
  price: number;
}

export function StickyBuyNowBar({ price }: StickyBuyNowBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">সীমিত অফার</p>
          <p className="text-sm font-bold text-slate-900">এখনই কিনুন ${Number(price).toFixed(2)} দামে</p>
        </div>
        <a
          href="#checkout"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          এখনই কিনুন
        </a>
      </div>
    </div>
  );
}
