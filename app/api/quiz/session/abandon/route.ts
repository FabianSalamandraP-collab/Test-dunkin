import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  requireTextField,
  requireIntegerField,
  trackVercelServerEvent,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-session-abandon",
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });

  if (protection) {
    return protection;
  }

  if (isQuizPreviewMode()) {
    const payload = (await request.json()) as Record<string, unknown>;
    const sessionId = requireTextField(payload, "sessionId");
    const questionKey = requireTextField(payload, "questionKey");
    const questionOrder = requireIntegerField(payload, "questionOrder");

    trackVercelServerEvent("quiz_session_abandoned", {
      sessionId,
      questionKey,
      questionOrder,
      preview: true,
    });

    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId,
      status: "abandoned",
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
    const questionKey = requireTextField(payload, "questionKey");
    const questionOrder = requireIntegerField(payload, "questionOrder");

    const abandonPayload = {
      status: "abandoned",
      is_abandoned: true,
      abandoned_at: new Date().toISOString(),
      abandoned_question_key: questionKey,
      abandoned_question_order: questionOrder,
    };

    const { error: updateError } = await admin
      .from("quiz_sessions")
      .update(abandonPayload as never)
      .eq("id", sessionId)
      .eq("is_completed", false);

    if (updateError) {
      throw updateError;
    }

    await insertQuizEvent(admin, {
      event_type: "test_abandoned",
      session_id: sessionId,
      question_key: questionKey,
      question_order: questionOrder,
      device_type:
        typeof payload.deviceType === "string"
          ? payload.deviceType.trim()
          : null,
      browser_name:
        typeof payload.browserName === "string"
          ? payload.browserName.trim()
          : null,
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      status: abandonPayload.status,
    });
  } catch (error) {
    console.error("Error registrando abandono del quiz:", error);

    return NextResponse.json(
      {
        error: "No fue posible registrar el abandono del quiz.",
      },
      { status: 400 }
    );
  }
}
