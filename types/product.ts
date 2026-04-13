export type ProductBadge = "sale" | "new";

export interface ProductInstallment {
  quantity: number;
  amount: number;
  label: string;
}

export interface ProductPaymentOption {
  id: string;
  label: string;
  iconSrc: string;
  amount?: number;
  amountLabel?: string;
}

export interface ProductColorOption {
  id: string;
  name: string;
  value: string;
  imageUrl?: string;
  gallery?: string[];
}

export interface ProductSizeOption {
  id: string;
  label: string;
  available: boolean;
}

export interface ProductTrustPoint {
  id: string;
  title: string;
  description: string;
}

export interface ProductPdpContent {
  badge?: ProductBadge;
  installment?: ProductInstallment;
  paymentOptions?: ProductPaymentOption[];
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  shortDescription?: string;
  materials?: string[];
  details?: string[];
  trustPoints?: ProductTrustPoint[];
  sizeGuideLabel?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  priceLabel?: string;
  compareAtPrice?: number;
  compareAtPriceLabel?: string;
  badge?: ProductBadge;
  imageUrl?: string;
  gallery: string[];
  category?: string;
  sku?: string;
  pdp?: ProductPdpContent;
  raw: unknown;
}
