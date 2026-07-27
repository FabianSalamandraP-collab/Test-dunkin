import { NextResponse } from "next/server";
import { sanitizeDunkinOfficialUrl } from "@/config/dunkin-official-urls";
import {
  getQuizTrackingAdminContext,
  getSessionSummary,
  insertQuizEvent,
  normalizeOptionalText,
  requireTextField,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-view-in-dunkin",
    limit: 30,
    windowMs: 15 * 60 * 1000,
  });

  if (protection) {
    return protection;
  }

  if (isQuizPreviewMode()) {
    const payload = (await request.json()) as Record<string, unknown>;
    const sessionId = requireTextField(payload, "sessionId");
    const targetUrl = sanitizeDunkinOfficialUrl(
      normalizeOptionalText(payload.targetUrl)
    );

    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId,
      tracked: true,
      targetUrl,
      trackedAt: new Date().toISOString(),
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
    const sessionId = requireTextField(payload, "sessionId");
    const session = await getSessionSummary(admin, sessionId);
    const targetUrl = sanitizeDunkinOfficialUrl(
      normalizeOptionalText(payload.targetUrl)
    );
    const clickedAtClient =
      normalizeOptionalText(payload.clickedAtClient) ||
      new Date().toISOString();
    const trackedAt = new Date().toISOString();
    const trackedDate = trackedAt.slice(0, 10);
    const trackedHour = new Date(trackedAt).getUTCHours();
    const utmSource = normalizeOptionalText(payload.utmSource);
    const utmMedium = normalizeOptionalText(payload.utmMedium);
    const utmCampaign = normalizeOptionalText(payload.utmCampaign);
    const referrer = normalizeOptionalText(payload.referrer);
    const browserName = normalizeOptionalText(payload.browserName);
    const deviceType = normalizeOptionalText(payload.deviceType);

    await insertQuizEvent(admin, {
      event_type: "view_in_dunkin_clicked",
      session_id: sessionId,
      participant_id: session.participant_id,
      result_personality_key: session.personality_key,
      recommended_drink_key: session.recommended_drink_key,
      recommended_drink_label: session.recommended_drink_label,
      device_type: deviceType,
      browser_name: browserName,
      metadata: {
        targetUrl,
        clickedAtClient,
        trackedAt,
        trackedDate,
        trackedHour,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      tracked: true,
      targetUrl,
      trackedAt,
    });
  } catch (error) {
    console.error("Error registrando clic en Ver en Dunkin':", error);

    return NextResponse.json(
      {
        error: "No fue posible registrar el clic en Ver en Dunkin'.",
      },
      { status: 400 }
    );
  }
}
