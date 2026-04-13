"use client";

import { cn } from "@/lib/utils";

interface StickyCTAProps {
  priceLabel?: string;
  disabled?: boolean;
  href?: string;
}

export function StickyCTA({ priceLabel, disabled, href }: StickyCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-[1.75rem] border border-line bg-surface px-4 py-3 shadow-soft">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Precio</p>
          <p className="truncate text-lg font-medium text-foreground">
            {priceLabel ?? "Consultar por WhatsApp"}
          </p>
        </div>

        {disabled || !href ? (
          <button
            type="button"
            disabled
            className="min-h-12 rounded-full bg-line px-5 text-sm font-medium text-white/80"
          >
            Elegi un talle
          </button>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white transition duration-200 hover:opacity-90"
            )}
          >
            Comprar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
