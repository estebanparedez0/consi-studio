import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-accentSoft px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
