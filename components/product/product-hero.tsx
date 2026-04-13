"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: "new-in",
    eyebrow: "Nueva coleccion",
    title: "Moda que entra bien en mobile y convierte mejor.",
    description: "Descubri piezas protagonistas, tonos suaves y una experiencia mas cercana a un ecommerce real.",
    accent: "NEW IN"
  },
  {
    id: "bridal",
    eyebrow: "Especial novias",
    title: "Texturas, siluetas y detalles que elevan cada look.",
    description: "Una portada breve y visual para entrar al catalogo sin perder ritmo ni espacio util.",
    accent: "NOVIAS"
  },
  {
    id: "sale",
    eyebrow: "Ultimos pares",
    title: "Sale curado para impulsar decisiones rapidas.",
    description: "Promos visibles, cards compactas y menos friccion desde el primer scroll.",
    accent: "SALE"
  }
] as const;

export function ProductHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#efe3d9] via-[#f5ece6] to-transparent" />
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(
                "group min-w-[88%] snap-center overflow-hidden rounded-[2rem] border border-line bg-surface text-left shadow-soft transition duration-300 sm:min-w-[460px]",
                index === activeIndex ? "opacity-100" : "opacity-90"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <div className="grid min-h-[280px] gap-4 p-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted">
                  <span>{slide.eyebrow}</span>
                  <span>{slide.accent}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr] sm:items-end">
                  <div className="space-y-3">
                    <h2 className="max-w-[12ch] font-display text-[2rem] leading-[0.95] text-foreground">
                      {slide.title}
                    </h2>
                    <p className="max-w-[32ch] text-sm leading-6 text-muted">{slide.description}</p>
                    <span className="inline-flex rounded-full border border-line bg-white px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground">
                      Ver coleccion
                    </span>
                  </div>
                  <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#ead8cc_0%,#f8f1eb_100%)] p-4">
                    <div className="aspect-[4/5] rounded-[1.15rem] border border-white/60 bg-[radial-gradient(circle_at_top,#fff8f2_0%,#ebd3c6_58%,#e2c3b3_100%)]" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={`${slide.id}-dot`}
              type="button"
              aria-label={`Ir al slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                index === activeIndex ? "w-6 bg-foreground" : "w-2 bg-line"
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
