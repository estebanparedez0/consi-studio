import { env } from "@/lib/env";
import type { Product } from "@/types/product";

const DEFAULT_MESSAGE = "Hola, quiero recibir asesoramiento sobre productos de Consi Studio.";

interface CartWhatsAppItem {
  productName: string;
  quantity: number;
  colorName?: string;
  sizeLabel?: string;
  priceLabel?: string;
}

interface BuildWhatsAppHrefOptions {
  product?: Product;
  colorName?: string;
  sizeLabel?: string;
}

export function buildWhatsAppHref({ product, colorName, sizeLabel }: BuildWhatsAppHrefOptions = {}) {
  const number = env.whatsappNumber;
  const selections = [colorName ? `color ${colorName}` : "", sizeLabel ? `talle ${sizeLabel}` : ""]
    .filter(Boolean)
    .join(", ");
  const message = product
    ? `Hola! Quiero este modelo ${product.name}${selections ? ` en ${selections}` : ""}${product.price ? ` (${product.priceLabel})` : ""}.`
    : DEFAULT_MESSAGE;

  const encodedMessage = encodeURIComponent(message);

  if (!number) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${number}?text=${encodedMessage}`;
}

export function buildCartWhatsAppHref(items: CartWhatsAppItem[]) {
  const number = env.whatsappNumber;

  const lines = items.map((item) => {
    const selections = [item.colorName ? `color ${item.colorName}` : "", item.sizeLabel ? `talle ${item.sizeLabel}` : ""]
      .filter(Boolean)
      .join(", ");

    return `- ${item.quantity} x ${item.productName}${selections ? ` (${selections})` : ""}${item.priceLabel ? ` - ${item.priceLabel}` : ""}`;
  });

  const message =
    items.length > 0
      ? `Hola! Quiero comprar estos productos:\n${lines.join("\n")}`
      : DEFAULT_MESSAGE;

  const encodedMessage = encodeURIComponent(message);

  if (!number) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${number}?text=${encodedMessage}`;
}
