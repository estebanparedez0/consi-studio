import { NextResponse } from "next/server";

import { createPlexoPaymentLink } from "@/services/plexo/plexo.service";

export const runtime = "nodejs";

interface CreatePaymentRequestBody {
  amount?: number;
  email?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentRequestBody;
    const amount = typeof body.amount === "number" ? body.amount : Number.NaN;
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "El monto del pago no es valido." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "El email es obligatorio para generar el pago." }, { status: 400 });
    }

    const url = await createPlexoPaymentLink({ amount, email });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to create Plexo payment link", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No pudimos generar el link de pago de Plexo."
      },
      { status: 500 }
    );
  }
}
