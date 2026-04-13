export interface CatalogFeedItem {
  id?: string;
  title?: string;
  description?: string;
  availability?: string;
  price?: string | number;
  image_link?: string;
  brand?: string;
  google_product_category?: string;
  sale_price?: string | number;
  condition?: string;
  link?: string;
  wa_compliance_category?: string;
}

export interface RssCatalogPayload {
  rss?: {
    channel?: {
      title?: string;
      link?: string;
      description?: string;
      item?: CatalogFeedItem | CatalogFeedItem[];
    };
  };
}

export type CatalogPayload =
  | Record<string, unknown>
  | unknown[]
  | {
      data?: unknown;
      items?: unknown;
      products?: unknown;
      results?: unknown;
    }
  | RssCatalogPayload;

export interface CatalogResponse {
  items: unknown[];
  raw: unknown;
}
