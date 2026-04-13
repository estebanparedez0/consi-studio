import { env } from "@/lib/env";
import type { Product } from "@/types/product";

const DEFAULT_MESSAGE = "Hola, quiero recibir asesoramiento sobre productos de Consi Studio.";

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
