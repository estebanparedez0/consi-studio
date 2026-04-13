"use client";

import Image from "next/image";
import Link from "next/link";

import { CartButton } from "@/components/cart/cart-button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <Link href="/" className="relative block h-9 w-[136px] shrink-0">
          <Image
            src="https://cfluna.com/assets/universoconsi.com/files/logo.png"
            alt="Universo Consi"
            fill
            priority
            sizes="136px"
            className="object-contain object-left"
          />
        </Link>
        <nav className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
          <Link href="/#catalogo" className="rounded-full px-2 py-1.5">
            Shop
          </Link>
          <Link href="/" className="rounded-full border border-line bg-surface px-3 py-1.5 text-foreground">
            New In
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
