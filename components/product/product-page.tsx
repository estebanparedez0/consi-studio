"use client";

import { useState } from "react";

import { ColorSelector } from "@/components/product/color-selector";
import { ImageCarousel } from "@/components/product/image-carousel";
import { ProductInfo } from "@/components/product/product-info";
import { SizeSelector } from "@/components/product/size-selector";
import { StickyCTA } from "@/components/product/sticky-cta";
import { WhatsAppFloatingButton } from "@/components/product/whatsapp-floating-button";
import { buildWhatsAppHref } from "@/lib/whatsapp";
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
    "Asesoramiento personalizado por WhatsApp"
  ];

  return product.pdp?.details?.length ? product.pdp.details : defaults;
}

function getTrustPoints(product: Product) {
  return product.pdp?.trustPoints?.length ? product.pdp.trustPoints : DEFAULT_TRUST_POINTS;
}

export function ProductPage({ product }: ProductPageProps) {
  const colors = getColors(product);
  const sizes = getSizes(product);
  const installment = getInstallment(product);
  const trustPoints = getTrustPoints(product);
  const description = getDescription(product);
  const materials = getMaterials(product);
  const details = getDetails(product);
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id ?? "");
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const whatsappHref = buildWhatsAppHref({
    product,
    colorName: selectedColor?.name,
    sizeLabel: selectedSize?.label
  });

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-36 pt-4 sm:px-5 sm:pt-6">
        <div className="space-y-7">
          <ImageCarousel
            key={selectedColorId}
            images={images}
            productName={product.name}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />

          <div className="space-y-7 rounded-[2rem] bg-background">
            <ProductInfo product={product} installmentLabel={installment?.label} />

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

            <section className="grid gap-3">
              {trustPoints.map((point) => (
                <article
                  key={point.id}
                  className="rounded-card border border-line bg-surface px-4 py-4 shadow-soft"
                >
                  <p className="text-sm font-medium text-foreground">{point.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{point.description}</p>
                </article>
              ))}
            </section>

            <section className="space-y-5 rounded-[2rem] border border-line bg-surface p-5 shadow-soft">
              <div className="space-y-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                  Descripcion
                </h2>
                <p className="text-sm leading-7 text-muted">{description}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                  Materiales
                </h3>
                <ul className="space-y-2 text-sm leading-6 text-muted">
                  {materials.map((material) => (
                    <li key={material}>{material}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                  Detalles clave
                </h3>
                <ul className="space-y-2 text-sm leading-6 text-muted">
                  {details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>

      <WhatsAppFloatingButton href={whatsappHref} />
      <StickyCTA
        priceLabel={product.priceLabel}
        href={selectedSize ? whatsappHref : undefined}
        disabled={!selectedSize}
      />
    </>
  );
}
