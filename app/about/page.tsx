import { SiteHeader } from "@/components/ui/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">আমাদের সম্পর্কে</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">মার্কেটিং-ফার্স্ট ইকমার্স অবকাঠামো</h1>
          <p className="mt-4 text-base text-slate-700">
            এই সিস্টেমটি সরাসরি রেসপন্স-ভিত্তিক বিক্রির জন্য তৈরি। প্রতিটি প্রোডাক্ট আলাদা ল্যান্ডিং ফানেল, পরিষ্কার বার্তা, জরুরিতা, সামাজিক প্রমাণ এবং সহজ ইনলাইন চেকআউটসহ উপস্থাপন করা হয়।
          </p>
        </section>
      </main>
    </>
  );
}
