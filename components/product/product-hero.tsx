import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export function ProductHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[75%] bg-gradient-to-b from-[#efe3d9] to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Boutique embebible"
            title="Una experiencia de compra pensada para compartirse por WhatsApp."
            description="Mobile-first, ligera y lista para convertir conversaciones en ventas con una estética suave, elegante y editable."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#catalogo">Ver catálogo</Button>
            <Button href={buildWhatsAppHref()} variant="secondary" target="_blank" rel="noreferrer">
              Hablar por WhatsApp
            </Button>
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-surface p-4 shadow-soft">
          <div className="overflow-hidden rounded-[1.5rem] bg-[#ead8cc] p-5">
            <div className="space-y-3 rounded-[1.25rem] bg-[#fffaf6] p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                <span>Nueva colección</span>
                <span>Consi Studio</span>
              </div>
              <div className="aspect-[4/5] rounded-[1rem] bg-[linear-gradient(180deg,#e8d6ca_0%,#f8f1eb_100%)]" />
              <div className="space-y-1">
                <p className="font-display text-2xl">Catálogo conectado</p>
                <p className="text-sm leading-6 text-muted">
                  Productos reales, CTA directo y una base lista para crecer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
