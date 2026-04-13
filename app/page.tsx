import { HomeHeroCarousel } from "@/components/home/home-hero-carousel";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogProducts } from "@/services/catalog/catalog.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getCatalogProducts();

  return (
    <>
      <HomeHeroCarousel />
      <section id="catalogo" className="mx-auto max-w-6xl space-y-4 px-4 pb-12 pt-2 sm:px-5 sm:pb-14">
        <SectionHeading
          eyebrow="Shop the edit"
          title="Novedades que se venden solas."
          description="Una selección compacta, visual y pensada para descubrir productos rápido desde mobile."
        />
        <ProductGrid products={products} />
      </section>
    </>
  );
}
