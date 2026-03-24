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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">Shop</p>
          <h1 className="mt-2 text-4xl font-black text-white">All Products</h1>
          <p className="mt-3 text-slate-300">Explore every course and digital product available in the marketplace.</p>
        </section>

        <section className="mt-8">
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
      </main>
    </>
  );
}
