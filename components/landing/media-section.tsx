interface MediaSectionProps {
  imageUrl: string | null;
  title: string;
}

export function MediaSection({ imageUrl, title }: MediaSectionProps) {
  return (
    <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white px-6 py-8 md:grid-cols-2 md:px-10">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-100 via-white to-amber-100 p-5">
        <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-white/60 bg-white/70 p-4 text-center text-sm text-slate-600">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full max-h-[320px] w-full rounded-lg object-cover" />
          ) : (
            <p>প্রোডাক্টের প্রিভিউ ছবি বা ভিডিও এখানে দেখা যাবে।</p>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">ভিজ্যুয়াল ওয়াকথ্রু</p>
        <h2 className="mt-3 text-3xl font-black text-slate-900">আপনি কী কিনছেন, তা পরিষ্কারভাবে দেখুন</h2>
        <p className="mt-4 text-sm text-slate-600 md:text-base">
          এই প্রোডাক্ট তাৎক্ষণিক কাজে লাগানোর জন্য তৈরি। প্রতিটি অংশ এমনভাবে সাজানো হয়েছে যাতে আপনি দ্রুত বাস্তবায়ন করতে পারেন এবং কম পরীক্ষা-নিরীক্ষায় ভালো ফল পান।
        </p>
      </div>
    </section>
  );
}
