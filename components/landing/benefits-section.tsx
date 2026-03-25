const benefits = [
  "à¦ªà§à¦°à¦®à¦¾à¦£à¦¿à¦¤ à¦ªà§à¦²à¦¾à¦—-à¦…à§à¦¯à¦¾à¦¨à§à¦¡-à¦ªà§à¦²à§‡ à¦“à§Ÿà¦¾à¦°à§à¦•à¦«à§à¦²à§‹ à¦¦à¦¿à§Ÿà§‡ à¦¸à¦®à§Ÿ à¦¬à¦¾à¦à¦šà¦¾à¦¨",
  "à¦¦à¦°à§à¦¶à¦¨à¦¾à¦°à§à¦¥à§€à¦•à§‡ à¦¦à§à¦°à§à¦¤ à¦•à§à¦°à§‡à¦¤à¦¾à§Ÿ à¦°à§‚à¦ªà¦¾à¦¨à§à¦¤à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§à¦¯ à¦¤à§ˆà¦°à¦¿",
  "à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯ à¦Ÿà§‡à¦®à¦ªà§à¦²à§‡à¦Ÿ à¦“ à¦«à§à¦°à§‡à¦®à¦“à§Ÿà¦¾à¦°à§à¦• à¦…à¦¨à§à¦¤à¦°à§à¦­à§à¦•à§à¦¤",
  "à¦…à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦•à¦¿à¦›à§ à¦¨à§Ÿ, à¦ªà§à¦°à§‹à¦ªà§à¦°à¦¿ à¦¬à¦¾à¦¸à§à¦¤à¦¬à¦®à§à¦–à§€ à¦ªà§à¦°à§Ÿà§‹à¦—",
];

export function BenefitsSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase text-cyan-700">à¦¸à§à¦¬à¦¿à¦§à¦¾</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">à¦†à¦ªà¦¨à¦¿ à¦¸à¦™à§à¦—à§‡ à¦¸à¦™à§à¦—à§‡ à¦¯à¦¾ à¦ªà¦¾à¦¬à§‡à¦¨</h2>
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

