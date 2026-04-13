import { ProductGrid } from "@/components/product/product-grid";
import { ProductHero } from "@/components/product/product-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogProducts } from "@/services/catalog/catalog.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getCatalogProducts();

  return (
    <>
      <ProductHero />
      <section id="catalogo" className="mx-auto max-w-6xl space-y-6 px-5 py-10 sm:py-14">
        <SectionHeading
          eyebrow="Selección"
          title="Catálogo conectado y listo para convertir."
          description="El contenido viene desde un endpoint externo y la capa visual queda separada para que podamos escalar sin reescribir la app."
        />
        <ProductGrid products={products} />
      </section>
    </>
  );
}
