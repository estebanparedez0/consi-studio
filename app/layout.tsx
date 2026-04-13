import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { tokensToCssVariables } from "@/styles/tokens";

import "./globals.css";

export const metadata: Metadata = {
  title: "Consi Studio",
  description: "Webapp ecommerce mobile-first pensada para compartirse desde WhatsApp."
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body style={tokensToCssVariables()}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
