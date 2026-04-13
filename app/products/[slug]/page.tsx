import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/product-detail";
import { getProductBySlug } from "@/services/catalog/catalog.service";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
