"use client";

import { track } from "@vercel/analytics";

export interface QuizTrackingClientContext {
  deviceType: "mobile" | "tablet" | "desktop";
  browserName: string;
  osName: string;
  language: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export type QuizVercelEventName =
  | "quiz_session_started"
  | "quiz_question_answered"
  | "quiz_session_completed"
  | "quiz_session_abandoned"
  | "quiz_view_in_dunkin_clicked"
  | "quiz_form_submitted"
  | "quiz_share_triggered"
  | "quiz_benefit_claim_clicked";

export function trackQuizEvent(
  name: QuizVercelEventName,
  properties: Record<string, unknown>
) {
  try {
    const MAX_CHARS = 255;
    const safeEventName =
      typeof name === "string" && name.length > 0
        ? name.slice(0, MAX_CHARS)
        : "quiz_event";

    const safeProperties: Record<string, string | number | boolean> = {};
    for (const [rawKey, value] of Object.entries(properties)) {
      if (
        value === null ||
        value === undefined ||
        typeof value === "object" ||
        typeof value === "bigint" ||
        typeof value === "symbol" ||
        typeof value === "function"
      ) {
        continue;
      }

      const key = rawKey.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, MAX_CHARS);
      if (!key) {
        continue;
      }

      if (typeof value === "string") {
        safeProperties[key] = value.slice(0, MAX_CHARS);
      } else if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        !Number.isNaN(value)
      ) {
        safeProperties[key] = value;
      } else if (typeof value === "boolean") {
        safeProperties[key] = value;
      }
    }
    track(safeEventName as QuizVercelEventName, safeProperties);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Vercel Analytics track falló:", error);
    }
  }
}

function getUtmValue(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  return value?.trim() || null;
}

function getDeviceType() {
  if (typeof window === "undefined") {
    return "desktop" as const;
  }

  const width = window.innerWidth;

  if (width < 768) {
    return "mobile" as const;
  }

  if (width < 1024) {
    return "tablet" as const;
  }

  return "desktop" as const;
}

function getBrowserName(userAgent: string) {
  if (/edg/i.test(userAgent)) return "edge";
  if (/opr|opera/i.test(userAgent)) return "opera";
  if (/chrome|crios/i.test(userAgent)) return "chrome";
  if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
    return "safari";
  }
  if (/firefox|fxios/i.test(userAgent)) return "firefox";
  return "unknown";
}

function getOsName(userAgent: string) {
  if (/windows/i.test(userAgent)) return "windows";
  if (/android/i.test(userAgent)) return "android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  if (/mac os x/i.test(userAgent)) return "macos";
  if (/linux/i.test(userAgent)) return "linux";
  return "unknown";
}

export function getQuizTrackingClientContext(): QuizTrackingClientContext {
  if (typeof window === "undefined") {
    return {
      deviceType: "desktop",
      browserName: "unknown",
      osName: "unknown",
      language: null,
      screenWidth: null,
      screenHeight: null,
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
    };
  }

  const userAgent = window.navigator.userAgent;
  const searchParams = new URLSearchParams(window.location.search);

  return {
    deviceType: getDeviceType(),
    browserName: getBrowserName(userAgent),
    osName: getOsName(userAgent),
    language: window.navigator.language || null,
    screenWidth: window.screen?.width || window.innerWidth || null,
    screenHeight: window.screen?.height || window.innerHeight || null,
    referrer: document.referrer || null,
    utmSource: getUtmValue(searchParams, "utm_source"),
    utmMedium: getUtmValue(searchParams, "utm_medium"),
    utmCampaign: getUtmValue(searchParams, "utm_campaign"),
  };
}

export async function postQuizTracking<T>(
  path: string,
  payload: Record<string, unknown>,
  options?: {
    keepalive?: boolean;
    silent?: boolean;
  }
): Promise<T | null> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: options?.keepalive,
    });

    const responseText = await response.text();
    const data = responseText
      ? (JSON.parse(responseText) as T & { error?: string })
      : null;

    if (!response.ok) {
      throw new Error(
        typeof data === "object" && data && "error" in data && data.error
          ? String(data.error)
          : "Error desconocido en tracking"
      );
    }

    return data;
  } catch (error) {
    if (!options?.silent) {
      console.warn("Tracking del quiz no disponible:", error);
    }

    return null;
  }
}

export function toDrinkKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
