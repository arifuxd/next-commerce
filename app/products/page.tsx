import { SiteHeader } from "@/components/ui/site-header";
import { ProductCard } from "@/components/ui/product-card";
import { getActiveProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <section className="market-card rounded-3xl p-8">
          <p className="text-xs font-semibold uppercase text-orange-300">শপ</p>
          <h1 className="mt-2 text-4xl font-black text-white">সব প্রোডাক্ট</h1>
          <p className="mt-3 text-slate-300">মার্কেটপ্লেসে থাকা সব কোর্স ও ডিজিটাল প্রোডাক্ট ঘুরে দেখুন।</p>
        </section>

        <section className="mt-8">
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
      </main>
    </>
  );
}

