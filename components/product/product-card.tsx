import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] bg-surfaceStrong">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
              Imagen pendiente
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          {product.category ? <Badge>{product.category}</Badge> : null}
          <div className="space-y-1">
            <Link href={`/products/${product.slug}`} className="block font-medium text-foreground">
              {product.name}
            </Link>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted">{product.priceLabel ?? "Consultar precio"}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button href={`/products/${product.slug}`} variant="secondary" className="flex-1">
            Ver detalle
          </Button>
          <Button
            href={buildWhatsAppHref({ product })}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}
