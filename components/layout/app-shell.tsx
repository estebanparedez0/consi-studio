import type { ReactNode } from "react";

import { TopBar } from "@/components/layout/topbar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
