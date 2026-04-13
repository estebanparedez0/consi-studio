import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  priceLabel?: string;
  compareAtPriceLabel?: string;
  installmentLabel?: string;
  shortDescription?: string;
}

export function ProductInfo({
  product,
  priceLabel,
  compareAtPriceLabel,
  installmentLabel,
  shortDescription
}: ProductInfoProps) {
  return (
    <section className="space-y-3">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          {product.category ? (
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{product.category}</span>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display text-[2rem] leading-[1.02] text-foreground">{product.name}</h1>
          <div className="flex flex-wrap items-end gap-3">
            <p className="text-[1.65rem] font-medium leading-none text-foreground">
              {priceLabel ?? product.priceLabel ?? "Precio a confirmar"}
            </p>
            {(compareAtPriceLabel ?? product.compareAtPriceLabel) ? (
              <p className="text-sm text-muted line-through">
                {compareAtPriceLabel ?? product.compareAtPriceLabel}
              </p>
            ) : null}
          </div>
          {installmentLabel ? (
            <p className="rounded-2xl bg-accentSoft px-3 py-2 text-sm text-foreground">
              {installmentLabel}
            </p>
          ) : null}
          {shortDescription ? (
            <p className="text-sm leading-6 text-muted">{shortDescription}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
