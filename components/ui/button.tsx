import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const baseClassName =
  "inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary: "bg-transparent text-foreground ring-1 ring-line hover:bg-accentSoft",
  soft: "bg-accentSoft text-foreground hover:bg-[#e5cabc]"
} as const;

type ButtonVariant = keyof typeof variants;

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "href">)
    | (Omit<ComponentPropsWithoutRef<"button">, "className"> & { href?: undefined })
  );

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(baseClassName, variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link className={classes} {...props}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<ComponentPropsWithoutRef<"button">, "className">;

  return (
    <button
      {...buttonProps}
      className={classes}
      type={buttonProps.type ?? "button"}
    >
      {children}
    </button>
  );
}
