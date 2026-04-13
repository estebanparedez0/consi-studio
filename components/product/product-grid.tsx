import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { ProductCardGrid } from "@/components/product/product-card-grid";
import { EmptyState } from "@/components/ui/empty-state";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState message="Todavia no hay productos visibles en el catalogo." />;
  }

  return (
    <ProductCardGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductCardGrid>
  );
}
