import { PaymentLogo } from "@/components/product/payment-logo";
import type { ProductPaymentOption } from "@/types/product";

interface ProductPricingProps {
  options?: ProductPaymentOption[];
  selectedOptionId?: string;
  onSelect?: (optionId: string) => void;
}

export function ProductPricing({ options, selectedOptionId, onSelect }: ProductPricingProps) {
  if (!options || options.length === 0) {
    return null;
  }

  const bestOption = options.reduce<ProductPaymentOption | undefined>((best, option) => {
    if (typeof option.amount !== "number") return best;
    if (!best || typeof best.amount !== "number" || option.amount < best.amount) {
      return option;
    }
    return best;
  }, undefined);

  return (
    <section className="space-y-2 rounded-[1.35rem] border border-line/80 bg-surface px-3.5 py-3 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
          Promociones y pagos
        </h2>
        {bestOption?.amountLabel ? (
          <span className="rounded-full bg-accentSoft px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
            Mejor precio {bestOption.amountLabel}
          </span>
        ) : null}
      </div>

      <div className="divide-y divide-line/70">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left first:pt-0 last:pb-0"
            onClick={() => onSelect?.(option.id)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${selectedOptionId === option.id ? "bg-accent" : "bg-line"}`}
              />
              <PaymentLogo src={option.iconSrc} alt={option.label} />
              <p className="text-sm text-foreground">{option.label}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{option.amountLabel ?? "Consultar"}</p>
              {bestOption?.id === option.id ? (
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Destacado</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
