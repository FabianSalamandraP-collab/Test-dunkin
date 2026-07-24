import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  requireTextField,
  requireIntegerField,
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible registrar el abandono del quiz.",
      },
      { status: 400 }
    );
  }
}
