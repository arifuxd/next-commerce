const benefits = [
  "প্রমাণিত প্লাগ-অ্যান্ড-প্লে ওয়ার্কফ্লো দিয়ে সময় বাঁচান",
  "দর্শনার্থীকে দ্রুত ক্রেতায় রূপান্তর করার জন্য তৈরি",
  "ব্যবহারযোগ্য টেমপ্লেট ও ফ্রেমওয়ার্ক অন্তর্ভুক্ত",
  "অপ্রয়োজনীয় কিছু নয়, পুরোপুরি বাস্তবমুখী প্রয়োগ",
];

export function BenefitsSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">সুবিধা</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">আপনি সঙ্গে সঙ্গে যা পাবেন</h2>
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
