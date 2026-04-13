import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_0.85fr] lg:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft">
        <div className="aspect-[4/5] bg-surfaceStrong">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
              Imagen no disponible
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          {product.category ? <Badge>{product.category}</Badge> : null}
          <h1 className="font-display text-4xl leading-tight">{product.name}</h1>
          <p className="text-lg text-muted">{product.priceLabel ?? "Precio a confirmar por WhatsApp"}</p>
        </div>
        {product.description ? (
          <p className="text-sm leading-7 text-muted">{product.description}</p>
        ) : (
          <p className="text-sm leading-7 text-muted">
            Te compartimos este producto desde el catálogo conectado. El detalle completo y la
            disponibilidad se coordinan por WhatsApp.
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={buildWhatsAppHref(product)} target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </Button>
          <Button href="/" variant="secondary">
            Volver al catálogo
          </Button>
        </div>
        <dl className="grid gap-4 rounded-card border border-line bg-surface p-5 text-sm text-muted">
          {product.sku ? (
            <div className="flex items-center justify-between gap-3">
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
          ) : null}
          {product.category ? (
            <div className="flex items-center justify-between gap-3">
              <dt>Categoría</dt>
              <dd>{product.category}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <dt>Canal</dt>
            <dd>WhatsApp + webapp</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
