import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { ProductCardGrid } from "@/components/product/product-card-grid";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface px-5 py-10 text-center text-sm text-muted">
        Todavia no hay productos visibles en el catalogo.
      </div>
    );
  }

  return (
    <ProductCardGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductCardGrid>
  );
}
