"use client";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease
}: QuantitySelectorProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
          Cantidad
        </h2>
      </div>

      <div className="inline-flex items-center rounded-full border border-line bg-surface p-1 shadow-soft">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-foreground"
          onClick={onDecrease}
        >
          -
        </button>
        <span className="min-w-10 text-center text-sm font-medium text-foreground">{quantity}</span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-foreground"
          onClick={onIncrease}
        >
          +
        </button>
      </div>
    </section>
  );
}
