"use client";

export default function MarketLoader() {
  return (
    <main className="market-loader-root fixed inset-0 z-[80] flex min-h-dvh items-center justify-center overflow-hidden bg-[#07101f] px-4">
      <div className="market-loader-overlay pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.14),transparent_35%)]" />

      <div className="relative z-10 flex items-center justify-center">
        <div className="relative h-24 w-24">
          <span className="market-loader-ring-outer absolute inset-0 rounded-full border border-white/20" />
          <span className="market-loader-ring-mid absolute inset-2 rounded-full border border-orange-300/50" />
          <span className="market-loader-ring-spin absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-400 animate-[spin_1.6s_linear_infinite]" />
          <span className="market-loader-core absolute inset-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 shadow-[0_0_30px_rgba(249,115,22,0.55)] animate-pulse" />
        </div>
      </div>
    </main>
  );
}

