import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.4rem] border border-line/80 bg-surface shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(41,31,29,0.12)] active:scale-[0.99]"
      >
        <div className="relative aspect-[4/5] bg-surfaceStrong">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
              Imagen pendiente
            </div>
          )}
          {product.badge ? (
            <div className="absolute left-2.5 top-2.5">
              <Badge>{product.badge}</Badge>
            </div>
          ) : null}
        </div>
        <div className="flex min-h-[104px] flex-1 flex-col justify-between gap-3 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-foreground transition duration-200 group-hover:text-accent">
              {product.name}
            </p>
            <span className="shrink-0 pt-0.5 text-sm text-muted transition duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
              ↗
            </span>
          </div>
          <div className="min-h-[2.75rem] space-y-1">
            <p className="text-sm font-medium text-foreground">
              {product.priceLabel ?? "Consultar precio"}
            </p>
            {product.compareAtPriceLabel ? (
              <p className="text-xs text-muted line-through">{product.compareAtPriceLabel}</p>
            ) : (
              <span className="block h-4" aria-hidden="true" />
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
