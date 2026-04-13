"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/cart-provider";
import { ColorSelector } from "@/components/product/color-selector";
import { ImageCarousel } from "@/components/product/image-carousel";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductInfo } from "@/components/product/product-info";
import { ProductPricing } from "@/components/product/product-pricing";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { RelatedProducts } from "@/components/product/related-products";
import { SizeSelector } from "@/components/product/size-selector";
import { StickyCTA } from "@/components/product/sticky-cta";
import { formatCurrency } from "@/lib/utils";
import type {
  Product,
  ProductColorOption,
  ProductInstallment,
  ProductSizeOption,
  ProductTrustPoint
} from "@/types/product";

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

const FALLBACK_COLORS: Array<Pick<ProductColorOption, "name" | "value">> = [
  { name: "Marfil", value: "#e8d9cf" },
  { name: "Cocoa", value: "#8b675c" },
  { name: "Negro", value: "#2a2524" }
];

const FALLBACK_SIZES: ProductSizeOption[] = [
  { id: "36", label: "36", available: true },
  { id: "37", label: "37", available: true },
  { id: "38", label: "38", available: true },
  { id: "39", label: "39", available: false },
  { id: "40", label: "40", available: true }
];

const DEFAULT_TRUST_POINTS: ProductTrustPoint[] = [
  {
    id: "shipping",
    title: "Envios a todo el pais",
    description: "Despachamos rapido y te acompanamos durante todo el proceso."
  },
  {
    id: "payments",
    title: "Cuotas sin interes",
    description: "Opciones pensadas para una compra comoda y simple."
  },
  {
    id: "exchanges",
    title: "Cambios faciles",
    description: "Si el talle no va perfecto, te ayudamos a resolverlo."
  }
];

function getInstallment(product: Product): ProductInstallment | undefined {
  if (product.pdp?.installment) {
    return product.pdp.installment;
  }

  if (!product.price) {
    return undefined;
  }

  const quantity = 3;
  const amount = Math.round(product.price / quantity);

  return {
    quantity,
    amount,
    label: `${quantity} cuotas sin interes de ${formatCurrency(amount, product.currency ?? "UYU")}`
  };
}

function getColors(product: Product): ProductColorOption[] {
  if (product.pdp?.colors?.length) {
    return product.pdp.colors;
  }

  const images = product.gallery.length > 0 ? product.gallery : product.imageUrl ? [product.imageUrl] : [];

  if (images.length === 0) {
    return [
      {
        id: "unico",
        name: "Unico",
        value: "#d5c2b7"
      }
    ];
  }

  return images.slice(0, 3).map((image, index) => ({
    id: `color-${index + 1}`,
    name: FALLBACK_COLORS[index]?.name ?? `Tono ${index + 1}`,
    value: FALLBACK_COLORS[index]?.value ?? "#d5c2b7",
    imageUrl: image,
    gallery: [image]
  }));
}

function getSizes(product: Product): ProductSizeOption[] {
  return product.pdp?.sizes?.length ? product.pdp.sizes : FALLBACK_SIZES;
}

function getDescription(product: Product) {
  return (
    product.pdp?.shortDescription ??
    product.description ??
    "Una silueta versatil, femenina y facil de combinar, pensada para acompanarte con comodidad en el dia a dia."
  );
}

function getMaterials(product: Product) {
  return (
    product.pdp?.materials ?? [
      "Terminacion premium de tacto suave",
      "Interior confortable para uso diario",
      "Base liviana y flexible"
    ]
  );
}

function getDetails(product: Product) {
  const defaults = [
    "Calce comodo con terminacion prolija",
    "Ideal para looks de todos los dias y ocasiones especiales",
    "Atencion personalizada para ayudarte a elegir mejor"
  ];

  return product.pdp?.details?.length ? product.pdp.details : defaults;
}

function getTrustPoints(product: Product) {
  return product.pdp?.trustPoints?.length ? product.pdp.trustPoints : DEFAULT_TRUST_POINTS;
}

function getLowestPaymentOption(product: Product) {
  return product.pdp?.paymentOptions?.reduce((best, option) => {
    if (typeof option.amount !== "number") return best;
    if (!best || typeof best.amount !== "number" || option.amount < best.amount) {
      return option;
    }
    return best;
  }, product.pdp?.paymentOptions?.[0]);
}

export function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const colors = getColors(product);
  const sizes = getSizes(product);
  const installment = getInstallment(product);
  const trustPoints = getTrustPoints(product);
  const shortDescription = getDescription(product);
  const materials = getMaterials(product);
  const details = getDetails(product);
  const paymentOptions = product.pdp?.paymentOptions ?? [];
  const defaultPaymentOption = getLowestPaymentOption(product);
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id ?? "");
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>();
  const [selectedPaymentId, setSelectedPaymentId] = useState(defaultPaymentOption?.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState<"" | "Agregado a tu carrito">("");

  const selectedColor = colors.find((color) => color.id === selectedColorId) ?? colors[0];
  const selectedSize = sizes.find((size) => size.id === selectedSizeId);
  const images =
    selectedColor?.gallery && selectedColor.gallery.length > 0
      ? selectedColor.gallery
      : product.gallery.length > 0
        ? product.gallery
        : product.imageUrl
          ? [product.imageUrl]
          : [];
  const selectedPaymentOption =
    paymentOptions.find((option) => option.id === selectedPaymentId) ?? defaultPaymentOption;
  const effectivePrice = selectedPaymentOption?.amount ?? product.price;
  const effectivePriceLabel = selectedPaymentOption?.amountLabel ?? product.priceLabel;
  const effectiveInstallment =
    typeof effectivePrice === "number"
      ? `${3} cuotas sin interes de ${formatCurrency(Math.round(effectivePrice / 3), product.currency ?? "UYU")}`
      : installment?.label;

  const accordionItems = [
    {
      id: "shipping",
      title: "Envios",
      content: "Hacemos envios a todo el pais. Te compartimos tiempos, costos y seguimiento apenas completas tu compra."
    },
    {
      id: "changes",
      title: "Cambios y devoluciones",
      content: "Si necesitas otro talle o color, te acompanamos con cambios simples y atencion personalizada."
    }
  ];

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: selectedColor?.imageUrl ?? product.imageUrl,
      price: effectivePrice,
      priceLabel: effectivePriceLabel,
      paymentLabel: selectedPaymentOption?.label,
      quantity,
      colorName: selectedColor?.name,
      sizeLabel: selectedSize.label
    });
    setCartFeedback("Agregado a tu carrito");
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-36 pt-3 sm:px-5 sm:pt-4">
        <div className="mb-4">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-foreground"
            onClick={() => router.back()}
          >
            <span aria-hidden="true">←</span>
            Volver
          </button>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-[0.95fr_0.85fr] lg:gap-8 lg:space-y-0">
          <ImageCarousel
            key={selectedColorId}
            images={images}
            productName={product.name}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />

          <div className="space-y-5 rounded-[2rem] bg-background">
            <ProductInfo
              product={product}
              priceLabel={effectivePriceLabel}
              compareAtPriceLabel={product.compareAtPriceLabel}
              installmentLabel={effectiveInstallment}
              shortDescription={shortDescription}
            />

            <ProductPricing
              options={paymentOptions}
              selectedOptionId={selectedPaymentOption?.id}
              onSelect={setSelectedPaymentId}
            />

            <ColorSelector
              colors={colors}
              selectedColorId={selectedColorId}
              onSelect={(colorId) => {
                setSelectedColorId(colorId);
                setActiveImageIndex(0);
              }}
            />

            <SizeSelector
              sizes={sizes}
              selectedSizeId={selectedSizeId}
              onSelect={setSelectedSizeId}
              guideLabel={product.pdp?.sizeGuideLabel}
            />

            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />

            <div className="space-y-3">
              <button
                type="button"
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-medium uppercase tracking-[0.16em] text-white transition duration-200 disabled:bg-line disabled:text-white/80"
              >
                Agregar a mi carrito
              </button>
              {cartFeedback ? (
                <p className="text-sm text-muted">{cartFeedback}</p>
              ) : null}
            </div>

            <section className="space-y-2 rounded-[1.35rem] border border-line/80 bg-surface px-3.5 py-3 shadow-soft">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                Beneficios
              </h2>
              <div className="divide-y divide-line/70">
                {trustPoints.map((point) => (
                  <article
                    key={point.id}
                    className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{point.title}</p>
                      <p className="mt-0.5 text-sm leading-5 text-muted">{point.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-[1.8rem] border border-line bg-surface p-4 shadow-soft">
              <div className="space-y-3">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                  Descripcion extendida
                </h2>
                <p className="text-sm leading-7 text-muted">
                  {product.description ??
                    "Cada pieza esta pensada para sentirse especial y facil de usar, con foco en comodidad, textura y presencia visual."}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                  Materiales
                </h3>
                <ul className="space-y-2 text-sm leading-6 text-muted">
                  {materials.map((material) => (
                    <li key={material}>• {material}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                  Detalles clave
                </h3>
                <ul className="space-y-2 text-sm leading-6 text-muted">
                  {details.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
              </div>
            </section>

            <ProductAccordion items={accordionItems} />
          </div>
        </div>

        <div className="mt-8">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>

      <StickyCTA
        priceLabel={effectivePriceLabel}
        disabled={!selectedSize}
        onClick={handleAddToCart}
      />
    </>
  );
}
