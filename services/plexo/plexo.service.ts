const PLEXO_DEV_ENDPOINT = "https://link.testing.plexo-apps.link/b2b/links";
const PLEXO_CURRENCY_UYU = 1;
const PLEXO_LINK_TYPE = 1;
const PLEXO_NOTIFICATION_CHANNEL = 1;
const PLEXO_VALID_UNTIL = "2026-08-08T00:00:00";

interface CreatePlexoPaymentInput {
  amount: number;
  email: string;
}

interface PlexoLinkRequestBody {
  links: Array<{
    linkType: number;
    amount: {
      currency: number;
      value: number;
    };
    description: string;
    reference: string;
    validUntil: string;
    notificationChannel: number;
    consumerEmail: string;
  }>;
}

type PlexoResponseShape =
  | {
      links?: Array<{
        url?: string;
      }>;
    }
  | {
      data?: {
        links?: Array<{
          url?: string;
        }>;
      };
    }
  | {
      url?: string;
    };

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function extractPaymentUrl(payload: PlexoResponseShape) {
  if ("url" in payload && typeof payload.url === "string" && payload.url.length > 0) {
    return payload.url;
  }

  if ("links" in payload) {
    const directUrl = payload.links?.[0]?.url;
    if (typeof directUrl === "string" && directUrl.length > 0) {
      return directUrl;
    }
  }

  if ("data" in payload) {
    const nestedUrl = payload.data?.links?.[0]?.url;
    if (typeof nestedUrl === "string" && nestedUrl.length > 0) {
      return nestedUrl;
    }
  }

  return undefined;
}

export async function createPlexoPaymentLink({ amount, email }: CreatePlexoPaymentInput) {
  const clientId = getRequiredEnv("PLEXO_CLIENT_ID");
  const clientSecret = getRequiredEnv("PLEXO_CLIENT_SECRET");

  const safeAmount = Math.round(amount);

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const body: PlexoLinkRequestBody = {
    links: [
      {
        linkType: PLEXO_LINK_TYPE,
        amount: {
          currency: PLEXO_CURRENCY_UYU,
          value: safeAmount
        },
        description: "Compra demo Consi Studio",
        reference: `CONSI-DEMO-${Date.now()}`,
        validUntil: PLEXO_VALID_UNTIL,
        notificationChannel: PLEXO_NOTIFICATION_CHANNEL,
        consumerEmail: email
      }
    ]
  };

  const response = await fetch(PLEXO_DEV_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ClientId: clientId,
      ClientSecret: clientSecret
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as PlexoResponseShape | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Plexo payment link creation failed";
    throw new Error(message);
  }

  if (!payload) {
    throw new Error("Empty Plexo response");
  }

  const paymentUrl = extractPaymentUrl(payload);

  if (!paymentUrl) {
    throw new Error("Plexo response did not include a payment URL");
  }

  return paymentUrl;
}
