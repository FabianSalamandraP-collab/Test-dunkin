import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  normalizeOptionalText,
  requireIntegerField,
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
    const questionKey = requireTextField(payload, "questionKey");
    const questionOrder = requireIntegerField(payload, "questionOrder");
    const selectedOptionKey = requireTextField(payload, "selectedOptionKey");
    const selectedOptionLabel = requireTextField(
      payload,
      "selectedOptionLabel"
    );

    const answerPayload = {
      session_id: sessionId,
      question_key: questionKey,
      question_order: questionOrder,
      selected_option_key: selectedOptionKey,
      selected_option_label: selectedOptionLabel,
      selected_value: normalizeOptionalText(payload.selectedValue),
    };

    const { error: upsertError } = await admin
      .from("quiz_answers")
      .upsert(answerPayload as never, {
        onConflict: "session_id,question_key",
      });

    if (upsertError) {
      throw upsertError;
    }

    const { count, error: countError } = await admin
      .from("quiz_answers")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId);

    if (countError) {
      throw countError;
    }

    const answersCount = count ?? 0;

    const { error: sessionError } = await admin
      .from("quiz_sessions")
      .update({ answers_count: answersCount } as never)
      .eq("id", sessionId);

    if (sessionError) {
      throw sessionError;
    }

    await insertQuizEvent(admin, {
      event_type: "question_answered",
      session_id: sessionId,
      question_key: questionKey,
      question_order: questionOrder,
      selected_option_key: selectedOptionKey,
      device_type: normalizeOptionalText(payload.deviceType),
      browser_name: normalizeOptionalText(payload.browserName),
      metadata: {
        selectedOptionLabel,
        selectedValue: answerPayload.selected_value,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      questionKey,
      answersCount,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible registrar la respuesta del quiz.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
