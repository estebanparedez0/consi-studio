"use client";

import type { AddressCoordinates } from "@/components/cart/address-map";

interface AddressSearchProps {
  address: string;
  city: string;
  notes: string;
  isSearching: boolean;
  hasCoordinates: boolean;
  isConfirmed: boolean;
  geocodeError: string;
  addressError: string;
  confirmedAddressLabel: string;
  confirmedCoordinates: AddressCoordinates | null;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSearch: () => void;
  onConfirm: () => void;
}

export function AddressSearch({
  address,
  city,
  notes,
  isSearching,
  hasCoordinates,
  isConfirmed,
  geocodeError,
  addressError,
  confirmedAddressLabel,
  confirmedCoordinates,
  onAddressChange,
  onCityChange,
  onNotesChange,
  onSearch,
  onConfirm
}: AddressSearchProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted">Envio a domicilio</h3>
        <p className="text-sm leading-6 text-muted">
          Busca y confirma tu direccion antes de continuar para minimizar errores de entrega.
        </p>
      </div>

      <div className="grid gap-3">
        <input
          className="min-h-11 rounded-2xl border border-line bg-background px-4 text-sm"
          placeholder="Calle y numero"
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
        />
        <input
          className="min-h-11 rounded-2xl border border-line bg-background px-4 text-sm"
          placeholder="Ciudad"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
        />
        <textarea
          className="min-h-24 rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          placeholder="Apto, referencias o notas para la entrega (opcional)"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line bg-background px-5 text-sm font-medium uppercase tracking-[0.16em] text-foreground"
          onClick={onSearch}
        >
          {isSearching ? "Buscando direccion..." : "Buscar direccion"}
        </button>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Ubicacion en mapa</p>
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {isSearching ? "Buscando..." : hasCoordinates ? "Direccion encontrada" : "Pendiente"}
          </span>
        </div>
        <p className="text-xs leading-5 text-muted">
          Toca el mapa o arrastra el pin para ajustar la ubicacion exacta de entrega.
        </p>
      </div>

      <button
        type="button"
        className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium uppercase tracking-[0.16em] ${
          hasCoordinates ? "bg-foreground text-background" : "bg-line text-white/80"
        }`}
        disabled={!hasCoordinates}
        onClick={onConfirm}
      >
        {isConfirmed ? "Direccion confirmada" : "Confirmar direccion de envio"}
      </button>

      {geocodeError ? (
        <div className="rounded-[1rem] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {geocodeError}
        </div>
      ) : null}

      {addressError ? (
        <div className="rounded-[1rem] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {addressError}
        </div>
      ) : null}

      {isConfirmed && confirmedCoordinates ? (
        <div className="space-y-3 rounded-[1.25rem] border border-line bg-background p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Direccion confirmada</p>
              <p className="mt-1 text-sm leading-6 text-foreground">{confirmedAddressLabel}</p>
              <p className="text-xs leading-5 text-muted">
                {confirmedCoordinates.lat.toFixed(5)}, {confirmedCoordinates.lng.toFixed(5)}
              </p>
            </div>
            <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-accent">
              Confirmada
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-[1rem] border border-dashed border-line bg-background px-3 py-3 text-sm text-muted">
          Busca la direccion, revisa la ubicacion en el mapa y confirmala para habilitar el siguiente paso.
        </div>
      )}
    </div>
  );
}
