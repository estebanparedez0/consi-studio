import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  installmentLabel?: string;
}

export function ProductInfo({ product, installmentLabel }: ProductInfoProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          {product.category ? <span className="text-xs uppercase tracking-[0.18em] text-muted">{product.category}</span> : null}
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-[2rem] leading-tight text-foreground">{product.name}</h1>
          <div className="flex flex-wrap items-end gap-3">
            <p className="text-2xl font-medium text-foreground">
              {product.priceLabel ?? "Precio a confirmar"}
            </p>
            {product.compareAtPriceLabel ? (
              <p className="text-sm text-muted line-through">{product.compareAtPriceLabel}</p>
            ) : null}
          </div>
          {installmentLabel ? <p className="text-sm text-muted">{installmentLabel}</p> : null}
        </div>
      </div>
    </section>
  );
}
