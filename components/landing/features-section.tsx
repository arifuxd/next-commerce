const features = [
  {
    title: "ধাপে ধাপে প্লেবুক",
    body: "অনুমান ছাড়াই লঞ্চ ও অপ্টিমাইজ করার পরিষ্কার সিস্টেম।",
  },
  {
    title: "উচ্চ কনভার্টিং টেমপ্লেট",
    body: "কনভার্সন সাইকোলজির ভিত্তিতে তৈরি রেডি-টু-ইউজ অ্যাসেট।",
  },
  {
    title: "পারফরম্যান্স চেকলিস্ট",
    body: "বিস্তারিত লঞ্চ ও QA চেকলিস্ট, যাতে কিছু বাদ না যায়।",
  },
  {
    title: "দ্রুত বাস্তবায়ন",
    body: "যে টিম এখনই ফলাফল চায়, তাদের জন্য তৈরি।",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">ফিচার</p>
      <h2 className="mt-3 text-3xl font-black text-slate-900">কনভার্সন-কেন্দ্রিক ফিচারসমূহ</h2>
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
