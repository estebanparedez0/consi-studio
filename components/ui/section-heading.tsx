import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted">{eyebrow}</p>
      ) : null}
      <div className="space-y-2">
        <h2 className="font-display text-3xl leading-tight text-foreground">{title}</h2>
        {description ? <p className="max-w-xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
    </div>
  );
}
