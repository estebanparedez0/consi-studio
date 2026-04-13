import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-line bg-surface px-5 py-10 text-center text-sm text-muted",
        className
      )}
    >
      {message}
    </div>
  );
}
