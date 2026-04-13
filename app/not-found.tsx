import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-5 py-16 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Consi Studio</p>
      <div className="space-y-3">
        <h1 className="font-display text-4xl">Producto no encontrado</h1>
        <p className="text-sm leading-7 text-muted">
          El enlace puede haber cambiado o el producto ya no estar disponible en el catálogo.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/">Volver al inicio</Button>
        <Button href={buildWhatsAppHref()} variant="secondary" target="_blank" rel="noreferrer">
          Abrir WhatsApp
        </Button>
      </div>
      <Link href="/" className="text-sm text-muted underline underline-offset-4">
        Ir al catálogo
      </Link>
    </section>
  );
}
