import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  insertQuizEvent,
  normalizeOptionalText,
  requireIntegerField,
  requireTextField,
  trackVercelServerEvent,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-session-answer",
    limit: 240,
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
    const selectedOptionKey = requireTextField(payload, "selectedOptionKey");
    const selectedOptionLabel =
      (payload.selectedOptionLabel as string | undefined) || null;

    trackVercelServerEvent("quiz_question_answered", {
      sessionId,
      questionKey,
      questionOrder,
      selectedOptionKey,
      selectedOptionLabel,
      preview: true,
      deviceType: normalizeOptionalText(payload.deviceType),
      browserName: normalizeOptionalText(payload.browserName),
    });

    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId,
      questionKey,
      answersCount: questionOrder,
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
        ignoreDuplicates: false,
      });

    if (upsertError) {
      const { error: insertFallbackError } = await admin
        .from("quiz_answers")
        .insert(answerPayload as never);

      if (insertFallbackError) {
        const { error: updateFallbackError } = await admin
          .from("quiz_answers")
          .update({
            selected_option_key: selectedOptionKey,
            selected_option_label: selectedOptionLabel,
            selected_value: answerPayload.selected_value,
            question_order: questionOrder,
          } as never)
          .eq("session_id", sessionId)
          .eq("question_key", questionKey);

        if (updateFallbackError) {
          throw upsertError;
        }
      }
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
    console.error("Error registrando respuesta del quiz:", error);

    return NextResponse.json(
      { error: "No fue posible registrar la respuesta del quiz." },
      { status: 400 }
    );
  }
}
