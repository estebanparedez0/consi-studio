import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-[0.15em] text-foreground">
          CONSI
        </Link>
        <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted">
          <Link href="/">Inicio</Link>
          <Link href="/#catalogo">Catálogo</Link>
        </nav>
      </div>
    </header>
  );
}
