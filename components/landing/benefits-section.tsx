const benefits = [
  "Save time with a proven plug-and-play workflow",
  "Built to convert visitors into paying customers quickly",
  "Actionable templates and frameworks included",
  "Practical implementation with no fluff",
];

export function BenefitsSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Benefits</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">What You Get Immediately</h2>
      <ul className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            {benefit}
          </li>
        ))}
      </ul>
    </section>
  );
}
