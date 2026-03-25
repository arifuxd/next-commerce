import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const currentPrice = Number(product.price);
  const oldPrice = currentPrice * 1.35;

  return (
    <article className="group market-card relative overflow-hidden rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,122,24,0.22)]">
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500/25 to-amber-300/20 text-xs font-semibold uppercase text-slate-200">
            ফিচার্ড কোর্স
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-1 text-lg font-bold text-white">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-300">{product.description}</p>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-400 line-through">${oldPrice.toFixed(2)}</p>
          <p className="text-2xl font-black text-orange-300">${currentPrice.toFixed(2)}</p>
        </div>
        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200">৩৫% সাশ্রয়</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="rounded-lg border border-white/20 px-3 py-2 text-center text-xs font-semibold text-slate-100 transition hover:border-orange-300/70 hover:text-white"
        >
          বিস্তারিত
        </Link>
        <Link
          href={`/product/${product.slug}#checkout`}
          className="rounded-lg bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-3 py-2 text-center text-xs font-black text-slate-950"
        >
          কিনুন
        </Link>
      </div>
    </article>
  );
}

