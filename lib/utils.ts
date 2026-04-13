import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "UYU") {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function normalizeCatalogPrice(value: unknown, currency = "UYU") {
  if (typeof value !== "number" && typeof value !== "string") {
    return undefined;
  }

  const raw = typeof value === "number" ? value : Number(value.replace(/[^\d.,-]/g, "").replace(",", "."));

  if (!Number.isFinite(raw) || raw <= 0) {
    return undefined;
  }

  // The current Consi feed exposes prices like 6.9 / 10.8 / 11.5 as shorthand thousands in UYU.
  if (currency === "UYU" && raw > 0 && raw < 100) {
    return Math.round(raw * 1000);
  }

  return Math.round(raw);
}
