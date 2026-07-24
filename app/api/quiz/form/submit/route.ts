import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  getSessionSummary,
  insertQuizEvent,
  requireBooleanField,
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
    const fullName = requireTextField(payload, "fullName");
    const email = requireTextField(payload, "email");
    const acceptDataProcessing = requireBooleanField(
      payload,
      "acceptDataProcessing"
    );
    const acceptPromotions =
      typeof payload.acceptPromotions === "boolean"
        ? payload.acceptPromotions
        : false;
    const phone =
      typeof payload.phone === "string" && payload.phone.trim().length > 0
        ? payload.phone.trim()
        : null;

    const session = await getSessionSummary(admin, sessionId);

    const { data: answers, error: answersError } = await admin
      .from("quiz_answers")
      .select(
        "question_key,question_order,selected_option_key,selected_option_label,selected_value,answered_at"
      )
      .eq("session_id", sessionId)
      .order("question_order", { ascending: true });

    if (answersError) {
      throw answersError;
    }

    const participantPayload = {
      name: fullName,
      email,
      phone,
      accept_data_processing: acceptDataProcessing,
      accept_promotions: acceptPromotions,
      quiz_result:
        session.personality_label ||
        session.recommended_drink_label ||
        "Resultado pendiente",
      answers: answers ?? [],
      registered_at: new Date().toISOString(),
    };

    const { data: participant, error: participantError } = await admin
      .from("quiz_participants")
      .insert(participantPayload as never)
      .select("id")
      .single();

    if (participantError) {
      throw participantError;
    }

    const participantId = (participant as { id: string }).id;

    const { error: sessionError } = await admin
      .from("quiz_sessions")
      .update({
        participant_id: participantId,
      } as never)
      .eq("id", sessionId);

    if (sessionError) {
      throw sessionError;
    }

    await insertQuizEvent(admin, {
      event_type: "form_submitted",
      session_id: sessionId,
      participant_id: participantId,
      result_personality_key: session.personality_key,
      recommended_drink_key: session.recommended_drink_key,
      recommended_drink_label: session.recommended_drink_label,
      device_type:
        typeof payload.deviceType === "string"
          ? payload.deviceType.trim()
          : null,
      browser_name:
        typeof payload.browserName === "string"
          ? payload.browserName.trim()
          : null,
      metadata: {
        email,
        phone,
        acceptPromotions,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      participantId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible registrar el formulario del quiz.",
      },
      { status: 400 }
    );
  }
}
