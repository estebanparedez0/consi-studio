"use client";

import Image from "next/image";

import { useCart } from "@/components/cart/cart-provider";
import { buildCartWhatsAppHref } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, totalAmount, closeDrawer, removeItem, updateQuantity } = useCart();
  const whatsappHref = buildCartWhatsAppHref(
    items.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      colorName: item.colorName,
      sizeLabel: item.sizeLabel,
      priceLabel: item.priceLabel
    }))
  );

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Cerrar carrito"
          className="fixed inset-0 z-40 bg-black/35"
          onClick={closeDrawer}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[390px] flex-col border-l border-line bg-background shadow-soft transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Carrito</p>
            <h2 className="font-display text-2xl">Tu seleccion</h2>
          </div>
          <button type="button" className="text-sm text-muted" onClick={closeDrawer}>
            Cerrar
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-muted">
              Tu carrito esta vacio por ahora.
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-line bg-surface p-3">
                <div className="flex gap-3">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-surfaceStrong">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted">
                        {[item.colorName, item.sizeLabel].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-sm font-medium text-foreground">{item.priceLabel ?? "Consultar"}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-line bg-background p-1">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.18em] text-muted"
                        onClick={() => removeItem(item.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="border-t border-line px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="font-medium text-foreground">
              {totalAmount > 0 ? formatCurrency(totalAmount) : "A confirmar"}
            </span>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-medium uppercase tracking-[0.16em] ${items.length > 0 ? "bg-accent text-white" : "pointer-events-none bg-line text-white/80"}`}
          >
            Comprar por WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
