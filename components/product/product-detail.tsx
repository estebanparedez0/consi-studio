import { ProductPage } from "@/components/product/product-page";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}
