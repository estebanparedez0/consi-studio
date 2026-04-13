import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ProductCardGridProps {
  children: ReactNode;
  className?: string;
}

export function ProductCardGrid({ children, className }: ProductCardGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-fr grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
