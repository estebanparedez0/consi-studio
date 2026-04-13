import { formatCurrency, normalizeCatalogPrice } from "@/lib/utils";
import type { CatalogResponse } from "@/types/catalog";
import type { Product } from "@/types/product";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
}

function pickNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    const normalized = normalizeCatalogPrice(value);
    if (typeof normalized === "number") return normalized;
  }
}

function pickImages(record: Record<string, unknown>) {
  const direct = [
    pickString(record, [
      "image",
      "imageUrl",
      "imagen",
      "thumbnail",
      "featuredImage",
      "image_link"
    ]),
    ...asArray(record.images).flatMap((item) => {
      if (typeof item === "string") return item;
      const imageRecord = asRecord(item);
      return imageRecord ? pickString(imageRecord, ["url", "src", "image"]) ?? [] : [];
    })
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(direct));
}

export function extractCatalogItems(payload: unknown): CatalogResponse {
  if (Array.isArray(payload)) {
    return { items: payload, raw: payload };
  }

  const record = asRecord(payload);

  if (!record) {
    return { items: [], raw: payload };
  }

  const candidate =
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.products) && record.products) ||
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.data) && record.data) ||
    (asRecord(record.rss) &&
      asRecord(asRecord(record.rss)?.channel) &&
      asArray(asRecord(asRecord(record.rss)?.channel)?.item)) ||
    (asRecord(record.data) && Array.isArray(asRecord(record.data)?.items) && asRecord(record.data)?.items) ||
    [];

  return {
    items: candidate as unknown[],
    raw: payload
  };
}

export function adaptCatalogItem(item: unknown, index: number): Product | null {
  const record = asRecord(item);

  if (!record) return null;

  const name = pickString(record, ["name", "title", "nombre", "productName"]);
  if (!name) return null;

  const images = pickImages(record);
  const currency = pickString(record, ["currency", "moneda"]) ?? "UYU";
  const basePrice = pickNumber(record, ["price", "precio", "amount"]);
  const salePrice = pickNumber(record, ["salePrice", "sale_price"]);
  const price = salePrice ?? basePrice;
  const slugSource = pickString(record, ["slug"]) ?? name;
  const id = String(
    pickString(record, ["id", "_id", "sku", "code"]) ?? `${slugify(slugSource)}-${index + 1}`
  );
  const googleCategory = pickString(record, ["google_product_category"]);
  const availability = pickString(record, ["availability"]);
  const compareAtPrice = salePrice && basePrice && salePrice < basePrice ? basePrice : undefined;
  const badge = salePrice && compareAtPrice ? "sale" : availability === "in stock" ? "new" : undefined;
  const paymentOptions =
    typeof price === "number"
      ? [
          {
            id: "base",
            label: "Precio lista",
            iconSrc: "https://cfluna.com/assets/universoconsi.com/files/banks/transf.png",
            amount: price,
            amountLabel: formatCurrency(price, currency)
          },
          {
            id: "transfer",
            label: "Transferencia",
            iconSrc: "https://cfluna.com/assets/universoconsi.com/files/banks/transf.png",
            amount: Math.round(price * 0.9),
            amountLabel: formatCurrency(Math.round(price * 0.9), currency)
          },
          {
            id: "itau-debit",
            label: "Itau debito",
            iconSrc: "https://cfluna.com/assets/universoconsi.com/files/banks/itau.svg",
            amount: Math.round(price * 0.92),
            amountLabel: formatCurrency(Math.round(price * 0.92), currency)
          },
          {
            id: "itau-credit",
            label: "Itau credito",
            iconSrc: "https://cfluna.com/assets/universoconsi.com/files/banks/itau.png",
            amount: price,
            amountLabel: formatCurrency(price, currency)
          }
        ]
      : undefined;

  return {
    id,
    slug: slugify(slugSource),
    name,
    description: pickString(record, ["description", "descripcion", "detail", "details"]),
    price,
    currency,
    priceLabel: typeof price === "number" ? formatCurrency(price, currency) : undefined,
    compareAtPrice,
    compareAtPriceLabel:
      typeof compareAtPrice === "number" ? formatCurrency(compareAtPrice, currency) : undefined,
    badge,
    imageUrl: images[0],
    gallery: images,
    category: pickString(record, ["category", "categoria", "collection", "brand"]) ?? googleCategory,
    sku: pickString(record, ["sku", "code", "reference", "id"]),
    pdp: {
      paymentOptions
    },
    raw: item
  };
}

export function adaptCatalog(items: unknown[]) {
  return items
    .map((item, index) => adaptCatalogItem(item, index))
    .filter((item): item is Product => item !== null);
}
