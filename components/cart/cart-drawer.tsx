"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { AddressSearch } from "@/components/cart/address-search";
import { useCart } from "@/components/cart/cart-provider";
import { buildCartWhatsAppHref } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";

type CheckoutStep = "cart" | "shipping" | "payment" | "success";
type DeliveryMethod = "shipping" | "pickup";

interface ShippingFormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  deliveryMethod: DeliveryMethod;
}

interface CreatePaymentResponse {
  url: string;
}

const initialShippingForm: ShippingFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
  deliveryMethod: "shipping"
};

const checkoutSteps = [
  { id: "cart", label: "Carrito" },
  { id: "shipping", label: "Envio" },
  { id: "payment", label: "Pago" }
] as const;

const deliveryOptions: Array<{
  id: DeliveryMethod;
  label: string;
  description: string;
}> = [
  {
    id: "shipping",
    label: "Envio a domicilio",
    description: "Completas tu direccion y coordinamos el despacho al finalizar."
  },
  {
    id: "pickup",
    label: "Retiro por local",
    description: "Reservas tu pedido ahora y compartimos la ubicacion al confirmar."
  }
];

interface AddressCoordinates {
  lat: number;
  lng: number;
}

const DEFAULT_MONTEVIDEO_CENTER: AddressCoordinates = {
  lat: -34.9011,
  lng: -56.1645
};

const DEFAULT_URUGUAY_CENTER: AddressCoordinates = {
  lat: -32.5228,
  lng: -55.7658
};

const AddressMap = dynamic(
  () => import("@/components/cart/address-map").then((module) => module.AddressMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[236px] w-full animate-pulse rounded-[1rem] border border-line bg-surfaceStrong" />
    )
  }
);

function hasValidAddressDetails(form: ShippingFormState) {
  return (
    form.address.trim().length >= 8 &&
    form.city.trim().length >= 2
  );
}

function buildAddressQuery(form: ShippingFormState) {
  return [form.address.trim(), form.city.trim(), "Uruguay"].filter(Boolean).join(", ");
}

export function CartDrawer() {
  const { items, isOpen, totalAmount, closeDrawer, removeItem, updateQuantity } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [shippingForm, setShippingForm] = useState<ShippingFormState>(initialShippingForm);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [lastPaymentUrl, setLastPaymentUrl] = useState<string | null>(null);
  const [shippingLatLng, setShippingLatLng] = useState<AddressCoordinates | null>(null);
  const [confirmedShippingLatLng, setConfirmedShippingLatLng] = useState<AddressCoordinates | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const whatsappHref = buildCartWhatsAppHref(
    items.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      colorName: item.colorName,
      sizeLabel: item.sizeLabel,
      priceLabel: item.priceLabel
    }))
  );

  const isShippingComplete =
    shippingForm.fullName.trim() &&
    shippingForm.email.trim() &&
    shippingForm.phone.trim() &&
    (shippingForm.deliveryMethod === "pickup" ||
      Boolean(confirmedShippingLatLng && shippingAddress));

  const canProceedToPayment = items.length > 0 && totalAmount > 0 && Boolean(isShippingComplete);
  const hasAddressDetails = hasValidAddressDetails(shippingForm);
  const currentAddressQuery = buildAddressQuery(shippingForm);
  const mapCenter = shippingLatLng ?? DEFAULT_MONTEVIDEO_CENTER ?? DEFAULT_URUGUAY_CENTER;

  const paymentSummary = useMemo(
    () => Array.from(new Set(items.map((item) => item.paymentLabel).filter(Boolean))).join(" · "),
    [items]
  );

  function resetAndClose() {
    setStep("cart");
    setPaymentError("");
    setAddressError("");
    setIsCreatingPayment(false);
    closeDrawer();
  }

  function updateShippingField<K extends keyof ShippingFormState>(
    field: K,
    value: ShippingFormState[K]
  ) {
    setShippingForm((current) => ({ ...current, [field]: value }));
    if (field !== "notes") {
      setPaymentError("");
    }
    if (field === "deliveryMethod") {
      setAddressError("");
      setGeocodeError("");
      if (value === "pickup") {
        setShippingAddress("");
        setConfirmedShippingLatLng(null);
        setShippingLatLng(null);
      }
    }
    if (field === "address" || field === "city") {
      setShippingAddress("");
      setConfirmedShippingLatLng(null);
      setAddressError("");
      setGeocodeError("");
    }
  }

  async function handleSearchAddress() {
    if (!hasAddressDetails) {
      setAddressError("Ingresa una direccion valida y una ciudad para buscarla en el mapa.");
      return;
    }

    setAddressError("");
    setGeocodeError("");
    setIsGeocoding(true);

    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "1",
        countrycodes: "uy",
        q: currentAddressQuery
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("No pudimos buscar esa direccion en OpenStreetMap.");
      }

      const payload = (await response.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
      const match = payload[0];

      if (!match) {
        throw new Error("No pudimos encontrar esa direccion. Ajusta la calle o la ciudad e intenta nuevamente.");
      }

      setShippingLatLng({
        lat: Number(match.lat),
        lng: Number(match.lon)
      });
      setConfirmedShippingLatLng(null);
      setShippingAddress(match.display_name?.trim() || currentAddressQuery);
    } catch (error) {
      setShippingLatLng(null);
      setConfirmedShippingLatLng(null);
      setShippingAddress("");
      setGeocodeError(
        error instanceof Error
          ? error.message
          : "No pudimos validar la direccion en este momento."
      );
    } finally {
      setIsGeocoding(false);
    }
  }

  function handleConfirmAddress() {
    if (!hasAddressDetails) {
      setAddressError("Ingresa una direccion valida y una ciudad para confirmar el envio.");
      return;
    }

    if (!shippingLatLng) {
      setAddressError("Ubica la direccion en el mapa antes de confirmarla.");
      return;
    }

    setShippingAddress(shippingAddress || currentAddressQuery);
    setConfirmedShippingLatLng(shippingLatLng);
    setAddressError("");
  }

  function handleSelectCoordinates(coordinates: AddressCoordinates) {
    setShippingLatLng(coordinates);
    setConfirmedShippingLatLng(null);
    setAddressError("");
    setGeocodeError("");
  }

  async function handleCreatePayment() {
    if (!canProceedToPayment || !shippingForm.email.trim()) {
      setPaymentError("Completa tus datos antes de continuar al pago.");
      return;
    }

    setIsCreatingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: totalAmount,
          email: shippingForm.email.trim()
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | CreatePaymentResponse
        | { error?: string }
        | null;

      if (!response.ok || !payload || typeof payload !== "object" || !("url" in payload)) {
        throw new Error(
          payload && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "No pudimos generar el link de pago en este momento."
        );
      }

      setLastPaymentUrl(payload.url);
      window.location.href = payload.url;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos conectar con Plexo. Intenta nuevamente en unos segundos."
      );
    } finally {
      setIsCreatingPayment(false);
    }
  }

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Cerrar carrito"
          className="fixed inset-0 z-40 bg-black/35"
          onClick={resetAndClose}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[390px] flex-col border-l border-line bg-background shadow-soft transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Checkout</p>
            <h2 className="font-display text-2xl">
              {step === "cart"
                ? "Tu carrito"
                : step === "shipping"
                  ? "Envio o retiro"
                  : step === "payment"
                    ? "Resumen y pago"
                    : "Pedido listo"}
            </h2>
          </div>
          <button type="button" className="text-sm text-muted" onClick={resetAndClose}>
            Cerrar
          </button>
        </div>

        <div className="border-b border-line px-4 py-3">
          <div className="grid grid-cols-3 gap-2">
            {checkoutSteps.map((entry, index) => {
              const currentIndex = checkoutSteps.findIndex((item) => item.id === step);
              const isActive = entry.id === step;
              const isComplete = currentIndex > index;

              return (
                <div key={entry.id} className="space-y-1">
                  <div className={`h-1 rounded-full ${isActive || isComplete ? "bg-accent" : "bg-line"}`} />
                  <p className={`text-[10px] uppercase tracking-[0.18em] ${isActive ? "text-foreground" : "text-muted"}`}>
                    {entry.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === "cart" ? (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-muted">
                  Tu carrito esta vacio por ahora.
                </div>
              ) : (
                items.map((item) => (
                  <article key={item.id} className="rounded-[1.5rem] border border-line bg-surface p-3">
                    <div className="flex gap-3">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-surfaceStrong">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="space-y-1">
                          <p className="line-clamp-2 text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted">
                            {[item.colorName, item.sizeLabel].filter(Boolean).join(" · ")}
                          </p>
                          <p className="text-sm font-medium text-foreground">{item.priceLabel ?? "Consultar"}</p>
                          {item.paymentLabel ? <p className="text-xs text-muted">{item.paymentLabel}</p> : null}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-line bg-background p-1">
                            <button
                              type="button"
                              className="h-8 w-8 rounded-full text-sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              className="h-8 w-8 rounded-full text-sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-xs uppercase tracking-[0.18em] text-muted"
                            onClick={() => removeItem(item.id)}
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          ) : null}

          {step === "shipping" ? (
            <div className="space-y-4">
              <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Como quieres recibirlo</h3>
                <div className="grid gap-2">
                  {deliveryOptions.map((option) => {
                    const isSelected = shippingForm.deliveryMethod === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`min-h-12 rounded-[1.25rem] border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-accent bg-background shadow-[0_8px_24px_rgba(201,127,109,0.12)]"
                            : "border-line bg-background"
                        }`}
                        onClick={() => updateShippingField("deliveryMethod", option.id)}
                      >
                        <p className="text-sm font-medium text-foreground">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-muted">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Contacto</h3>
                <div className="grid gap-3">
                  <input
                    className="min-h-11 rounded-2xl border border-line bg-background px-4 text-sm"
                    placeholder="Nombre y apellido"
                    value={shippingForm.fullName}
                    onChange={(event) => updateShippingField("fullName", event.target.value)}
                  />
                  <input
                    className="min-h-11 rounded-2xl border border-line bg-background px-4 text-sm"
                    placeholder="Email"
                    type="email"
                    value={shippingForm.email}
                    onChange={(event) => updateShippingField("email", event.target.value)}
                  />
                  <input
                    className="min-h-11 rounded-2xl border border-line bg-background px-4 text-sm"
                    placeholder="Telefono"
                    value={shippingForm.phone}
                    onChange={(event) => updateShippingField("phone", event.target.value)}
                  />
                </div>
              </section>

              {shippingForm.deliveryMethod === "shipping" ? (
                <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                  <AddressSearch
                    address={shippingForm.address}
                    city={shippingForm.city}
                    notes={shippingForm.notes}
                    isSearching={isGeocoding}
                    hasCoordinates={Boolean(shippingLatLng)}
                    isConfirmed={Boolean(confirmedShippingLatLng)}
                    geocodeError={geocodeError}
                    addressError={addressError}
                    confirmedAddressLabel={shippingAddress}
                    confirmedCoordinates={confirmedShippingLatLng}
                    onAddressChange={(value) => updateShippingField("address", value)}
                    onCityChange={(value) => updateShippingField("city", value)}
                    onNotesChange={(value) => updateShippingField("notes", value)}
                    onSearch={handleSearchAddress}
                    onConfirm={handleConfirmAddress}
                  />
                  <div className="space-y-2">
                    <AddressMap
                      center={mapCenter}
                      markerPosition={shippingLatLng}
                      onSelectPosition={handleSelectCoordinates}
                    />
                  </div>
                </section>
              ) : (
                <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                  <div className="space-y-1">
                    <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Retiro por local</h3>
                    <p className="text-sm leading-6 text-foreground">Retiras tu pedido coordinando horario con el equipo de Consi Studio.</p>
                    <p className="text-sm leading-6 text-muted">
                      La ubicacion exacta y las indicaciones de acceso se comparten al confirmar el pago.
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-[1.25rem] border border-line bg-background">
                    <div className="flex min-h-36 items-end bg-[radial-gradient(circle_at_20%_20%,rgba(201,127,109,0.16),transparent_35%),linear-gradient(180deg,rgba(250,246,242,1),rgba(244,235,228,1))] p-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Mapa de retiro</p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          Coordinamos el punto exacto al confirmar para mantener una experiencia cuidada y personalizada.
                        </p>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="min-h-24 rounded-2xl border border-line bg-background px-4 py-3 text-sm"
                    placeholder="Notas para el retiro (opcional)"
                    value={shippingForm.notes}
                    onChange={(event) => updateShippingField("notes", event.target.value)}
                  />
                </section>
              )}
            </div>
          ) : null}

          {step === "payment" ? (
            <div className="space-y-4">
              <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                <div className="space-y-1">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Resumen</h3>
                  <p className="text-sm leading-6 text-muted">
                    Vas a continuar a Plexo para completar el pago en entorno de testing.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Productos</span>
                    <span className="text-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Precio aplicado</span>
                    <span className="text-right text-foreground">{paymentSummary || "Precio seleccionado en PDP"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Entrega</span>
                    <span className="text-right text-foreground">
                      {shippingForm.deliveryMethod === "shipping" ? "Envio a domicilio" : "Retiro por local"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-line pt-2">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-medium text-foreground">
                      {totalAmount > 0 ? formatCurrency(totalAmount) : "A confirmar"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-[1.5rem] border border-line bg-surface p-4">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Datos de contacto</h3>
                <div className="space-y-1 text-sm text-muted">
                  <p>{shippingForm.fullName}</p>
                  <p>{shippingForm.email}</p>
                  <p>{shippingForm.phone}</p>
                  {shippingForm.deliveryMethod === "shipping" ? (
                    <>
                      <p>{shippingAddress || buildAddressQuery(shippingForm)}</p>
                      {confirmedShippingLatLng ? (
                        <p>
                          {confirmedShippingLatLng.lat.toFixed(5)}, {confirmedShippingLatLng.lng.toFixed(5)}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p>Retiro coordinado por local</p>
                  )}
                </div>
              </section>

              {paymentError ? (
                <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {paymentError}
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "success" ? (
            <div className="rounded-[1.5rem] border border-line bg-surface px-4 py-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Pedido creado</p>
              <h3 className="mt-2 font-display text-3xl">Tu pedido esta listo</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                El link de pago se genero correctamente. Si no se abrio una nueva vista, puedes retomarlo desde aqui.
              </p>
            </div>
          ) : null}
        </div>

        <div className="border-t border-line px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="font-medium text-foreground">
              {totalAmount > 0 ? formatCurrency(totalAmount) : "A confirmar"}
            </span>
          </div>

          {step === "cart" ? (
            <button
              type="button"
              className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-medium uppercase tracking-[0.16em] ${
                items.length > 0 ? "bg-accent text-white" : "bg-line text-white/80"
              }`}
              disabled={items.length === 0}
              onClick={() => setStep("shipping")}
            >
              Continuar a envio
            </button>
          ) : null}

          {step === "shipping" ? (
            <div className="space-y-2">
              <button
                type="button"
                className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-medium uppercase tracking-[0.16em] ${
                  isShippingComplete ? "bg-accent text-white" : "bg-line text-white/80"
                }`}
                disabled={!isShippingComplete}
                onClick={() => setStep("payment")}
              >
                Continuar a pago
              </button>
              <button type="button" className="w-full text-sm text-muted" onClick={() => setStep("cart")}>
                Volver al carrito
              </button>
            </div>
          ) : null}

          {step === "payment" ? (
            <div className="space-y-2">
              <button
                type="button"
                className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-medium uppercase tracking-[0.16em] ${
                  canProceedToPayment && !isCreatingPayment ? "bg-accent text-white" : "bg-line text-white/80"
                }`}
                disabled={!canProceedToPayment || isCreatingPayment}
                onClick={handleCreatePayment}
              >
                {isCreatingPayment ? "Generando link de pago..." : "Pagar ahora"}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-foreground"
              >
                Soporte por WhatsApp
              </a>
              <button type="button" className="w-full text-sm text-muted" onClick={() => setStep("shipping")}>
                Volver a envio
              </button>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="space-y-2">
              {lastPaymentUrl ? (
                <a
                  href={lastPaymentUrl}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-medium uppercase tracking-[0.16em] text-white"
                >
                  Volver al link de pago
                </a>
              ) : null}
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-foreground"
                onClick={resetAndClose}
              >
                Seguir comprando
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
