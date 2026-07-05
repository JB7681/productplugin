import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.originalPrice && product.originalPrice !== product.price;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl2 bg-white dark:bg-ink-900 shadow-soft hover:shadow-card transition-shadow duration-300 border border-neutral-100 dark:border-neutral-800">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white shadow-soft">
              Featured
            </span>
          )}
          {product.latest && (
            <span className="rounded-full bg-neutral-900/85 dark:bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-white dark:text-ink-950 shadow-soft">
              New
            </span>
          )}
        </div>
        <span className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-ink-950/90 px-2 py-1 text-[10px] font-medium text-neutral-700 dark:text-neutral-200">
          {product.platform}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <p className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-white">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
          {product.description}
        </p>

        {product.rating ? (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            {"★".repeat(Math.round(product.rating))}
            <span className="text-neutral-400">({product.rating})</span>
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            {product.price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">{product.originalPrice}</span>
          )}
        </div>

        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark active:scale-[0.98] transition-all duration-150"
        >
          View Product
        </a>
      </div>
    </div>
  );
}
