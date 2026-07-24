import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type PublicRouteProtectionOptions = {
  namespace: string;
  limit: number;
  windowMs: number;
  message?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __dunkinRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function getRateLimitStore() {
  if (!global.__dunkinRateLimitStore) {
    global.__dunkinRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return global.__dunkinRateLimitStore;
}

function cleanupExpiredRateLimitEntries(store: Map<string, RateLimitEntry>) {
  const now = Date.now();

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

function getClientFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent")?.trim();
  const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp?.trim();

  return clientIp || userAgent || "anonymous";
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin")?.trim();

  if (!origin) {
    return true;
  }

  const allowedOrigins = new Set<string>();

  try {
    allowedOrigins.add(new URL(request.url).origin);
  } catch {
    // No-op: request.url should be valid, but we fail closed only on explicit mismatch.
  }

  try {
    allowedOrigins.add(new URL(getSiteUrl()).origin);
  } catch {
    // No-op: invalid env should not block local development if request origin matches.
  }

  return allowedOrigins.has(origin);
}

function consumeRateLimit(
  request: Request,
  options: PublicRouteProtectionOptions
) {
  const store = getRateLimitStore();
  cleanupExpiredRateLimitEntries(store);

  const now = Date.now();
  const fingerprint = getClientFingerprint(request);
  const key = `${options.namespace}:${fingerprint}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function protectPublicRoute(
  request: Request,
  options: PublicRouteProtectionOptions
) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Solicitud no permitida." },
      { status: 403 }
    );
  }

  const rateLimit = consumeRateLimit(request, options);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          options.message ||
          "Has realizado demasiadas solicitudes. Inténtalo nuevamente en unos minutos.",
      },
      {
        status: 429,
        headers: {
          "retry-after": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  return null;
}
