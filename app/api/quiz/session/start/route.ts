import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  normalizeOptionalInteger,
  normalizeOptionalText,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-session-start",
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });

  if (protection) {
    return protection;
  }

  if (isQuizPreviewMode()) {
    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId: `preview-${crypto.randomUUID()}`,
      status: "preview",
      startedAt: new Date().toISOString(),
    });
  }

  const context = getQuizTrackingAdminContext();

  if (!context.ok) {
    return NextResponse.json(
      {
        error:
          "El tracking del quiz no está disponible en este entorno por ahora.",
        ready: false,
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const { admin } = context.value;

    const sessionPayload = {
      device_type: normalizeOptionalText(payload.deviceType),
      browser_name: normalizeOptionalText(payload.browserName),
      os_name: normalizeOptionalText(payload.osName),
      language: normalizeOptionalText(payload.language),
      screen_width: normalizeOptionalInteger(payload.screenWidth),
      screen_height: normalizeOptionalInteger(payload.screenHeight),
      referrer: normalizeOptionalText(payload.referrer),
      utm_source: normalizeOptionalText(payload.utmSource),
      utm_medium: normalizeOptionalText(payload.utmMedium),
      utm_campaign: normalizeOptionalText(payload.utmCampaign),
    };

    const { data, error } = await admin
      .from("quiz_sessions")
      .insert(sessionPayload as never)
      .select("id,status,started_at")
      .single();

    if (error) {
      throw error;
    }

    const sessionData = data as {
      id: string;
      status: string;
      started_at: string;
    };

    await insertQuizEvent(admin, {
      event_type: "test_started",
      session_id: sessionData.id,
      device_type: sessionPayload.device_type,
      browser_name: sessionPayload.browser_name,
      metadata: {
        language: sessionPayload.language,
        osName: sessionPayload.os_name,
        referrer: sessionPayload.referrer,
        screenWidth: sessionPayload.screen_width,
        screenHeight: sessionPayload.screen_height,
        utmSource: sessionPayload.utm_source,
        utmMedium: sessionPayload.utm_medium,
        utmCampaign: sessionPayload.utm_campaign,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId: sessionData.id,
      status: sessionData.status,
      startedAt: sessionData.started_at,
    });
  } catch (error) {
    console.error("Error iniciando sesión del quiz:", error);

    return NextResponse.json(
      {
        error: "No fue posible iniciar la sesión del quiz.",
      },
      { status: 500 }
    );
  }
}
