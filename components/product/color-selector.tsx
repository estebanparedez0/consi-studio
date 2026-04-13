"use client";

import type { ProductColorOption } from "@/types/product";

import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: ProductColorOption[];
  selectedColorId: string;
  onSelect: (colorId: string) => void;
}

export function ColorSelector({ colors, selectedColorId, onSelect }: ColorSelectorProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">Color</h2>
        <p className="text-sm text-muted">
          {colors.find((color) => color.id === selectedColorId)?.name}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = color.id === selectedColorId;

          return (
            <button
              key={color.id}
              type="button"
              aria-label={`Seleccionar color ${color.name}`}
              className={cn(
                "flex flex-col items-center gap-2 rounded-full p-1 transition-transform duration-200",
                isSelected ? "scale-100" : "scale-[0.98]"
              )}
              onClick={() => onSelect(color.id)}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-white/60 shadow-sm transition-all duration-200",
                  isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-background shadow-soft" : "ring-1 ring-line"
                )}
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs text-muted">{color.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
