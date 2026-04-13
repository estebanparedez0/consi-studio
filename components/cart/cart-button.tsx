"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { totalCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      aria-label="Abrir carrito"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-foreground"
      onClick={openDrawer}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5 stroke-current"
        fill="none"
        strokeWidth="1.8"
      >
        <path d="M5 8.5h14l-1.2 10a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 8.5Z" />
        <path d="M8.5 9V7.5a3.5 3.5 0 1 1 7 0V9" />
      </svg>
      {totalCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
          {totalCount}
        </span>
      ) : null}
    </button>
  );
}
