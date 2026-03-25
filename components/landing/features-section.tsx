const features = [
  {
    title: "à¦§à¦¾à¦ªà§‡ à¦§à¦¾à¦ªà§‡ à¦ªà§à¦²à§‡à¦¬à§à¦•",
    body: "à¦…à¦¨à§à¦®à¦¾à¦¨ à¦›à¦¾à§œà¦¾à¦‡ à¦²à¦žà§à¦š à¦“ à¦…à¦ªà§à¦Ÿà¦¿à¦®à¦¾à¦‡à¦œ à¦•à¦°à¦¾à¦° à¦ªà¦°à¦¿à¦·à§à¦•à¦¾à¦° à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à¥¤",
  },
  {
    title: "à¦‰à¦šà§à¦š à¦•à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¿à¦‚ à¦Ÿà§‡à¦®à¦ªà§à¦²à§‡à¦Ÿ",
    body: "à¦•à¦¨à¦­à¦¾à¦°à§à¦¸à¦¨ à¦¸à¦¾à¦‡à¦•à§‹à¦²à¦œà¦¿à¦° à¦­à¦¿à¦¤à§à¦¤à¦¿à¦¤à§‡ à¦¤à§ˆà¦°à¦¿ à¦°à§‡à¦¡à¦¿-à¦Ÿà§-à¦‡à¦‰à¦œ à¦…à§à¦¯à¦¾à¦¸à§‡à¦Ÿà¥¤",
  },
  {
    title: "à¦ªà¦¾à¦°à¦«à¦°à¦®à§à¦¯à¦¾à¦¨à§à¦¸ à¦šà§‡à¦•à¦²à¦¿à¦¸à§à¦Ÿ",
    body: "à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦²à¦žà§à¦š à¦“ QA à¦šà§‡à¦•à¦²à¦¿à¦¸à§à¦Ÿ, à¦¯à¦¾à¦¤à§‡ à¦•à¦¿à¦›à§ à¦¬à¦¾à¦¦ à¦¨à¦¾ à¦¯à¦¾à§Ÿà¥¤",
  },
  {
    title: "à¦¦à§à¦°à§à¦¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬à¦¾à§Ÿà¦¨",
    body: "à¦¯à§‡ à¦Ÿà¦¿à¦® à¦à¦–à¦¨à¦‡ à¦«à¦²à¦¾à¦«à¦² à¦šà¦¾à§Ÿ, à¦¤à¦¾à¦¦à§‡à¦° à¦œà¦¨à§à¦¯ à¦¤à§ˆà¦°à¦¿à¥¤",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase text-emerald-700">à¦«à¦¿à¦šà¦¾à¦°</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">à¦•à¦¨à¦­à¦¾à¦°à§à¦¸à¦¨-à¦•à§‡à¦¨à§à¦¦à§à¦°à¦¿à¦• à¦«à¦¿à¦šà¦¾à¦°à¦¸à¦®à§‚à¦¹</h2>
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

