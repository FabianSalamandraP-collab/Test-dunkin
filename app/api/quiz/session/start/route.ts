import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  normalizeOptionalInteger,
  normalizeOptionalText,
} from "@/lib/quiz-tracking";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const context = getQuizTrackingAdminContext();

  if (!context.ok) {
    return NextResponse.json(
      { error: context.error, ready: false },
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible iniciar la sesión del quiz.",
      },
      { status: 500 }
    );
  }
}
