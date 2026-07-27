import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  requireTextField,
  normalizeOptionalInteger,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-session-complete",
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });

  if (protection) {
    return protection;
  }

  if (isQuizPreviewMode()) {
    const payload = (await request.json()) as Record<string, unknown>;
    const sessionId = requireTextField(payload, "sessionId");

    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId,
      status: "completed",
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
    const personalityKey = requireTextField(payload, "personalityKey");
    const personalityLabel = requireTextField(payload, "personalityLabel");
    const recommendedDrinkKey = requireTextField(
      payload,
      "recommendedDrinkKey"
    );
    const recommendedDrinkLabel = requireTextField(
      payload,
      "recommendedDrinkLabel"
    );

    const completionPayload = {
      status: "completed",
      is_completed: true,
      is_abandoned: false,
      completed_at: new Date().toISOString(),
      personality_key: personalityKey,
      personality_label: personalityLabel,
      recommended_drink_key: recommendedDrinkKey,
      recommended_drink_label: recommendedDrinkLabel,
      score: normalizeOptionalInteger(payload.score),
      total_duration_seconds: normalizeOptionalInteger(
        payload.totalDurationSeconds
      ),
    };

    const { error: updateError } = await admin
      .from("quiz_sessions")
      .update(completionPayload as never)
      .eq("id", sessionId);

    if (updateError) {
      throw updateError;
    }

    await insertQuizEvent(admin, {
      event_type: "test_completed",
      session_id: sessionId,
      result_personality_key: personalityKey,
      recommended_drink_key: recommendedDrinkKey,
      recommended_drink_label: recommendedDrinkLabel,
      device_type:
        typeof payload.deviceType === "string"
          ? payload.deviceType.trim()
          : null,
      browser_name:
        typeof payload.browserName === "string"
          ? payload.browserName.trim()
          : null,
      metadata: {
        personalityLabel,
        score: completionPayload.score,
        totalDurationSeconds: completionPayload.total_duration_seconds,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      status: completionPayload.status,
    });
  } catch (error) {
    console.error("Error finalizando sesión del quiz:", error);

    return NextResponse.json(
      {
        error: "No fue posible finalizar la sesión del quiz.",
      },
      { status: 400 }
    );
  }
}
