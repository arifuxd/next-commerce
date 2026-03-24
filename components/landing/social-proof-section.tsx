const metrics = [
  { label: "Customers", value: "12,000+" },
  { label: "Avg. Rating", value: "4.9/5" },
  { label: "Refund Rate", value: "<1.8%" },
  { label: "Uptime", value: "99.9%" },
];

export function SocialProofSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Social Proof</p>
      <h2 className="mt-3 text-3xl font-black">Trusted by High-Performing Teams</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-white/20 bg-white/5 p-4">
            <p className="text-2xl font-black">{metric.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-300">{metric.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
