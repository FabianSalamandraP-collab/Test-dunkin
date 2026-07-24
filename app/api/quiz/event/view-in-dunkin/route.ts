import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  getSessionSummary,
  insertQuizEvent,
  normalizeOptionalText,
  requireTextField,
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
    const sessionId = requireTextField(payload, "sessionId");
    const session = await getSessionSummary(admin, sessionId);
    const targetUrl = normalizeOptionalText(payload.targetUrl);
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible registrar el clic en Ver en Dunkin'.",
      },
      { status: 400 }
    );
  }
}
