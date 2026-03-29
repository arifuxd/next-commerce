"use client";

export default function MarketLoader() {
  return (
    <main className="fixed inset-0 z-[80] flex min-h-dvh items-center justify-center overflow-hidden bg-[#07101f] px-4 light:bg-[#f6f9ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.14),transparent_35%)] light:bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.08),transparent_35%)]" />

      <div className="relative z-10 flex items-center justify-center">
        <div className="relative h-24 w-24">
          <span className="absolute inset-0 rounded-full border border-white/20 light:border-slate-300/80" />
          <span className="absolute inset-2 rounded-full border border-orange-300/50 light:border-orange-300/60" />
          <span className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-400 animate-[spin_1.6s_linear_infinite] light:border-t-orange-500 light:border-r-orange-400" />
          <span className="absolute inset-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 shadow-[0_0_30px_rgba(249,115,22,0.55)] animate-pulse light:from-orange-400 light:to-amber-300 light:shadow-[0_0_26px_rgba(249,115,22,0.25)]" />
        </div>
      </div>
    </main>
  );
}
