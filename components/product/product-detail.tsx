import { ProductPage } from "@/components/product/product-page";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return <ProductPage product={product} />;
}
