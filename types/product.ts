export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  priceLabel?: string;
  imageUrl?: string;
  gallery: string[];
  category?: string;
  sku?: string;
  raw: unknown;
}
