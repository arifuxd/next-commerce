const features = [
  {
    title: "Step-by-step playbook",
    body: "Clear system to launch and optimize without guesswork.",
  },
  {
    title: "High-converting templates",
    body: "Ready-to-use assets designed around conversion psychology.",
  },
  {
    title: "Performance checklists",
    body: "Detailed launch and QA checklist so nothing gets missed.",
  },
  {
    title: "Fast implementation",
    body: "Built for teams that need results this week, not next quarter.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Features</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">Conversion-Focused Feature Stack</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
