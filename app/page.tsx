import Link from "next/link";
import { SiteHeader } from "@/components/ui/site-header";
import { ProductCard } from "@/components/ui/product-card";
import { getActiveProducts } from "@/lib/products";

const testimonials = [
  {
    name: "Tariq Hasan",
    role: "Freelance Developer",
    comment: "The course structure is practical. I shipped faster and closed more clients.",
    photo: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Nadia Rahman",
    role: "Marketing Lead",
    comment: "Clear lessons, strong templates, and the product quality is premium.",
    photo: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Shafin Karim",
    role: "Agency Owner",
    comment: "Excellent value. It feels like buying a complete execution system.",
    photo: "https://i.pravatar.cc/100?img=28",
  },
];

const collections = [
  { name: "Web Development", count: "24 Courses", icon: "code" },
  { name: "UI/UX & Product", count: "16 Courses", icon: "spark" },
  { name: "Marketing Growth", count: "18 Courses", icon: "chart" },
  { name: "Freelancing Mastery", count: "11 Courses", icon: "briefcase" },
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Marketplace Learning Platform</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
              Learn In-Demand Skills. <span className="bg-gradient-to-r from-[#ff7a18] to-[#ffb347] bg-clip-text text-transparent">Build Income</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              Discover premium courses, actionable products, and step-by-step systems built to move you from learning to earning.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#featured"
                className="rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-6 py-3 text-sm font-black text-slate-950"
              >
                Browse Courses
              </Link>
              <Link
                href="#featured"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-orange-300/70"
              >
                View Products
              </Link>
            </div>
          </div>

          <div className="market-card relative overflow-hidden rounded-3xl p-6">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-500/30 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Featured Bundle</p>
            <h2 className="mt-3 text-3xl font-black text-white">Complete Freelance Launch Kit</h2>
            <p className="mt-3 text-sm text-slate-300">Landing templates, outreach scripts, proposal systems, and pricing playbooks in one product.</p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm line-through text-slate-400">$149.00</p>
                <p className="text-3xl font-black text-orange-300">$89.00</p>
              </div>
              <Link
                href={products[0] ? `/product/${products[0].slug}` : "/"}
                className="rounded-full bg-white px-5 py-2 text-xs font-black text-slate-900"
              >
                Explore Bundle
              </Link>
            </div>
          </div>
        </section>

        <section id="featured" className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Featured Products</p>
              <h2 className="mt-2 text-3xl font-black text-white">Top Selling Courses & Resources</h2>
            </div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-300">
              {products.length} products
            </span>
          </div>

          {products.length === 0 ? (
            <div className="market-card rounded-2xl p-10 text-center text-slate-300">No products live yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Collections</p>
          <h2 className="mt-2 text-3xl font-black text-white">Browse by Category</h2>
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
          <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Testimonials</p>
          <h2 className="mt-2 text-3xl font-black text-white">Trusted by Learners Worldwide</h2>
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
          <h2 className="text-3xl font-black text-white">Start Learning Today and Scale Your Career</h2>
          <p className="mt-3 max-w-2xl text-slate-200">Join thousands of learners using our marketplace to gain real-world skills and monetize them faster.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900">
              Sign Up Now
            </Link>
            <Link href="#featured" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">
              Explore Catalog
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <p className="text-xl font-black text-white">CourseMarketX</p>
            <p className="mt-2 text-sm text-slate-400">Premium courses and digital products for career growth.</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link href="/">Products</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>help@coursemarketx.com</li>
              <li>+880 1XXX-XXXXXX</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
