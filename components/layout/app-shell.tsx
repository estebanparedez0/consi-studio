import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { TopBar } from "@/components/layout/topbar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopBar />
        <main>{children}</main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
