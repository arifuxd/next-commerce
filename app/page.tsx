import Link from "next/link";
import { SiteHeader } from "@/components/ui/site-header";
import { ProductCard } from "@/components/ui/product-card";
import { getActiveProducts } from "@/lib/products";

const testimonials = [
  {
    name: "তারিক হাসান",
    role: "ফ্রিল্যান্স ডেভেলপার",
    comment: "কোর্সের গঠন খুবই ব্যবহারিক। আমি দ্রুত কাজ ডেলিভার করতে পেরেছি এবং বেশি ক্লায়েন্ট পেয়েছি।",
    photo: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "নাদিয়া রহমান",
    role: "মার্কেটিং লিড",
    comment: "পাঠগুলো পরিষ্কার, টেমপ্লেটগুলো দারুণ, আর প্রোডাক্টের মান সত্যিই প্রিমিয়াম।",
    photo: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "শাফিন করিম",
    role: "এজেন্সি মালিক",
    comment: "দামের তুলনায় অসাধারণ। মনে হয়েছে যেন পুরো একটি রেডি এক্সিকিউশন সিস্টেম কিনলাম।",
    photo: "https://i.pravatar.cc/100?img=28",
  },
];

const collections = [
  { name: "ওয়েব ডেভেলপমেন্ট", count: "২৪টি কোর্স", icon: "code" },
  { name: "ইউআই/ইউএক্স ও প্রোডাক্ট", count: "১৬টি কোর্স", icon: "spark" },
  { name: "মার্কেটিং গ্রোথ", count: "১৮টি কোর্স", icon: "chart" },
  { name: "ফ্রিল্যান্সিং মাস্টারি", count: "১১টি কোর্স", icon: "briefcase" },
] as const;

function CategoryIcon({ kind }: { kind: (typeof collections)[number]["icon"] }) {
  if (kind === "code") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 4-4 16" />
      </svg>
    );
  }
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3 1.6 3.8L18 8.4l-3.2 2.7 1 4.1L12 13l-3.8 2.2 1-4.1L6 8.4l4.4-1.6L12 3Z" />
      </svg>
    );
  }
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">বাংলা লার্নিং মার্কেটপ্লেস</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
              চাহিদাসম্পন্ন দক্ষতা শিখুন। <span className="bg-gradient-to-r from-[#ff7a18] to-[#ffb347] bg-clip-text text-transparent">আয় বাড়ান</span>।
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              প্রিমিয়াম কোর্স, ব্যবহারযোগ্য ডিজিটাল প্রোডাক্ট এবং ধাপে ধাপে সাজানো সিস্টেম খুঁজে নিন, যা শেখা থেকে আয় করার পথে আপনাকে এগিয়ে দেবে।
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#featured"
                className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-6 py-3 text-sm font-black text-slate-950"
              >
                কোর্স দেখুন
              </Link>
              <Link
                href="#featured"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-orange-300/70"
              >
                প্রোডাক্ট দেখুন
              </Link>
            </div>
          </div>

          <div className="market-card relative overflow-hidden rounded-3xl p-6">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-500/30 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200">ফিচার্ড বান্ডেল</p>
            <h2 className="mt-3 text-3xl font-black text-white">সম্পূর্ণ ফ্রিল্যান্স লঞ্চ কিট</h2>
            <p className="mt-3 text-sm text-slate-300">ল্যান্ডিং টেমপ্লেট, আউটরিচ স্ক্রিপ্ট, প্রপোজাল সিস্টেম এবং প্রাইসিং প্লেবুক একসাথে।</p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm line-through text-slate-400">$149.00</p>
                <p className="text-3xl font-black text-orange-300">$89.00</p>
              </div>
              <Link
                href={products[0] ? `/product/${products[0].slug}` : "/"}
                className="rounded-full bg-white px-5 py-2 text-xs font-black text-slate-900"
              >
                বিস্তারিত দেখুন
              </Link>
            </div>
          </div>
        </section>

        <section id="featured" className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">ফিচার্ড প্রোডাক্ট</p>
              <h2 className="mt-2 text-3xl font-black text-white">সবচেয়ে জনপ্রিয় কোর্স ও রিসোর্স</h2>
            </div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-300">
              {products.length}টি প্রোডাক্ট
            </span>
          </div>

          {products.length === 0 ? (
            <div className="market-card rounded-2xl p-10 text-center text-slate-300">এখনও কোনো প্রোডাক্ট লাইভ হয়নি।</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-200">ক্যাটাগরি</p>
          <h2 className="mt-2 text-3xl font-black text-white">ক্যাটাগরি অনুযায়ী দেখুন</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <article key={collection.name} className="market-card rounded-2xl p-5 transition hover:border-orange-300/50">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-200">
                  <CategoryIcon kind={collection.icon} />
                </span>
                <p className="mt-4 text-lg font-bold text-white">{collection.name}</p>
                <p className="mt-1 text-sm text-slate-300">{collection.count}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-200">গ্রাহক মতামত</p>
          <h2 className="mt-2 text-3xl font-black text-white">শিক্ষার্থীদের আস্থার জায়গা</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="market-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <img src={item.photo} alt={item.name} className="h-11 w-11 rounded-full border border-white/20 object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-200">&ldquo;{item.comment}&rdquo;</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-3xl border border-orange-300/30 bg-gradient-to-r from-[#ff7a18]/20 to-[#ffb347]/20 p-8">
          <h2 className="text-3xl font-black text-white">আজই শেখা শুরু করুন এবং ক্যারিয়ারকে এগিয়ে নিন</h2>
          <p className="mt-3 max-w-2xl text-slate-200">হাজারো শিক্ষার্থীর মতো আপনিও বাস্তবমুখী দক্ষতা অর্জন করুন এবং দ্রুত আয় করার পথে এগিয়ে যান।</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900">
              এখনই সাইন আপ করুন
            </Link>
            <Link href="#featured" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">
              ক্যাটালগ দেখুন
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <p className="text-xl font-black text-white">CourseMarketX</p>
            <p className="mt-2 text-sm text-slate-400">ক্যারিয়ার উন্নয়নের জন্য প্রিমিয়াম কোর্স ও ডিজিটাল প্রোডাক্ট।</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">প্ল্যাটফর্ম</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link href="/">প্রোডাক্ট</Link></li>
              <li><Link href="/about">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/login">অ্যাকাউন্ট</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">সাপোর্ট</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>help@coursemarketx.com</li>
              <li>+880 1XXX-XXXXXX</li>
              <li>ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">নীতিমালা</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>শর্তাবলি</li>
              <li>প্রাইভেসি</li>
              <li>রিফান্ড নীতি</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
