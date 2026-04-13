import { env } from "@/lib/env";
import type { Product } from "@/types/product";

const DEFAULT_MESSAGE = "Hola, quiero recibir asesoramiento sobre productos de Consi Studio.";

export function buildWhatsAppHref(product?: Product) {
  const number = env.whatsappNumber;
  const message = product
    ? `Hola, quiero consultar por ${product.name}${product.price ? ` (${product.priceLabel})` : ""}.`
    : DEFAULT_MESSAGE;

  const encodedMessage = encodeURIComponent(message);

  if (!number) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${number}?text=${encodedMessage}`;
}
