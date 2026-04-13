import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { ProductCardGrid } from "@/components/product/product-card-grid";
import { SectionHeading } from "@/components/ui/section-heading";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow="Tambien te puede gustar"
        title="Relacionados"
        className="space-y-1"
      />

      <ProductCardGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductCardGrid>
    </section>
  );
}
