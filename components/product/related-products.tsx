import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { ProductCardGrid } from "@/components/product/product-card-grid";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Tambien te puede gustar</p>
        <h2 className="font-display text-3xl leading-none text-foreground">Relacionados</h2>
      </div>

      <ProductCardGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductCardGrid>
    </section>
  );
}
