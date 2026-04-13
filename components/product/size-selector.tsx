"use client";

import { useState } from "react";

import type { ProductSizeOption } from "@/types/product";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: ProductSizeOption[];
  selectedSizeId?: string;
  onSelect: (sizeId: string) => void;
  guideLabel?: string;
}

export function SizeSelector({
  sizes,
  selectedSizeId,
  onSelect,
  guideLabel = "Guia de talles"
}: SizeSelectorProps) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">Talles</h2>
        <button
          type="button"
          className="text-sm text-muted underline underline-offset-4"
          onClick={() => setShowGuide((current) => !current)}
        >
          {guideLabel}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => {
          const isSelected = size.id === selectedSizeId;

          return (
            <button
              key={size.id}
              type="button"
              disabled={!size.available}
              className={cn(
                "min-h-12 rounded-2xl border text-sm font-medium transition duration-200",
                size.available
                  ? "border-line bg-white text-foreground active:scale-[0.98]"
                  : "cursor-not-allowed border-line/50 bg-surfaceStrong text-muted/60 line-through",
                isSelected && "border-accent bg-accent text-white shadow-soft"
              )}
              onClick={() => onSelect(size.id)}
            >
              {size.label}
            </button>
          );
        })}
      </div>

      {showGuide ? (
        <div className="rounded-card border border-line bg-surface p-4 text-sm leading-6 text-muted">
          Si dudas entre dos talles, te recomendamos elegir el mayor. Tambien podes escribirnos por
          WhatsApp y te ayudamos a encontrar el calce ideal.
        </div>
      ) : null}
    </section>
  );
}
