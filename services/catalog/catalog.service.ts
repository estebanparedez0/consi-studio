import { XMLParser } from "fast-xml-parser";

import { env } from "@/lib/env";
import { adaptCatalog, extractCatalogItems } from "@/services/catalog/catalog.adapter";
import type { Product } from "@/types/product";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true
});
let hasLoggedCatalogSample = false;

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
    const products = adaptCatalog(extracted.items);

    if (!hasLoggedCatalogSample && extracted.items.length > 0) {
      console.info("[catalog] raw sample", extracted.items.slice(0, 3));
      console.info(
        "[catalog] mapped sample",
        products.slice(0, 3).map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          priceLabel: product.priceLabel,
          compareAtPrice: product.compareAtPrice
        }))
      );
      hasLoggedCatalogSample = true;
    }

    return products;
  } catch (error) {
    console.error("Failed to load catalog feed", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug);
}
