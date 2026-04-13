import { XMLParser } from "fast-xml-parser";

import { env } from "@/lib/env";
import { adaptCatalog, extractCatalogItems } from "@/services/catalog/catalog.adapter";
import type { Product } from "@/types/product";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true
});

async function fetchCatalogPayload() {
  if (!env.catalogApiUrl) {
    return null;
  }

  const response = await fetch(env.catalogApiUrl, {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (contentType.includes("xml") || text.trim().startsWith("<")) {
    return xmlParser.parse(text);
  }

  return JSON.parse(text);
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const payload = await fetchCatalogPayload();
    const extracted = extractCatalogItems(payload);
    return adaptCatalog(extracted.items);
  } catch (error) {
    console.error("Failed to load catalog feed", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug);
}
