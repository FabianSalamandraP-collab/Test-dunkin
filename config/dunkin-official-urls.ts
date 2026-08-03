import type { QuizResult } from "@/types/quiz";

export const DUNKIN_ORDER_BASE_URL = "https://www.dunkincolombia.com/pedir";

type QuizResultId = QuizResult["id"];

interface DunkinOfficialLinkEntry {
  resultId: QuizResultId;
  drinkLabel: string;
  url: string | null;
}

// Punto unico de configuracion para las URLs oficiales del CTA final.
// Si una bebida todavia no tiene una URL dedicada, el sistema usa primero
// el fallback operativo y, si no existe, la URL base de pedido.
export const DUNKIN_OFFICIAL_LINKS: Record<
  QuizResultId,
  DunkinOfficialLinkEntry
> = {
  creative: {
    resultId: "creative",
    drinkLabel: "Iced Latte",
    url: null,
  },
  balanced: {
    resultId: "balanced",
    drinkLabel: "Iced Tea",
    url: null,
  },
  energetic: {
    resultId: "energetic",
    drinkLabel: "Refresher Mango Piña",
    url: null,
  },
  passionate: {
    resultId: "passionate",
    drinkLabel: "Frutibatido",
    url: null,
  },
};

export function getConfiguredDunkinOfficialUrl(resultId: string) {
  return DUNKIN_OFFICIAL_LINKS[resultId as QuizResultId]?.url || null;
}

export function resolveDunkinOfficialUrl(
  resultId: string,
  fallbackUrl?: string | null
) {
  return (
    getConfiguredDunkinOfficialUrl(resultId) ||
    fallbackUrl ||
    DUNKIN_ORDER_BASE_URL
  );
}

export function sanitizeDunkinOfficialUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (parsedUrl.protocol !== "https:") {
      return null;
    }

    if (hostname !== "dunkincolombia.com") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}
