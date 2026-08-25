import { NextResponse } from "next/server";
import {
  getQuizTrackingAdminContext,
  getSessionSummary,
  insertQuizEvent,
  normalizeOptionalPhone,
  requireEmailField,
  requireBooleanField,
  requireHumanNameField,
  requireTextField,
  trackVercelServerEvent,
} from "@/lib/quiz-tracking";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { protectPublicRoute } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const protection = protectPublicRoute(request, {
    namespace: "quiz-form-submit",
    limit: 6,
    windowMs: 15 * 60 * 1000,
  });

  if (protection) {
    return protection;
  }

  if (isQuizPreviewMode()) {
    const payload = (await request.json()) as Record<string, unknown>;
    const sessionId = requireTextField(payload, "sessionId", { maxLength: 80 });
    const email = requireEmailField(payload, "email");
    const companyWebsite =
      typeof payload.companyWebsite === "string"
        ? payload.companyWebsite.trim()
        : "";

    trackVercelServerEvent("quiz_form_submitted", {
      sessionId,
      emailDomain: email.includes("@") ? email.split("@")[1] : "unknown",
      acceptPromotions:
        typeof payload.acceptPromotions === "boolean"
          ? payload.acceptPromotions
          : false,
      preview: true,
      honeypot: Boolean(companyWebsite),
    });

    if (companyWebsite) {
      return NextResponse.json({
        ready: true,
        preview: true,
        sessionId,
        participantId: "screened-by-honeypot",
      });
    }

    return NextResponse.json({
      ready: true,
      preview: true,
      sessionId,
      participantId: `preview-${email.toLowerCase()}`,
    });
  }

  const context = getQuizTrackingAdminContext();

  if (!context.ok) {
    return NextResponse.json(
      {
        error:
          "El registro no está disponible en este momento. Inténtalo nuevamente en unos minutos.",
        ready: false,
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const { admin } = context.value;

    const sessionId = requireTextField(payload, "sessionId", { maxLength: 80 });
    const fullName = requireHumanNameField(payload, "fullName");
    const email = requireEmailField(payload, "email");
    const acceptDataProcessing = requireBooleanField(
      payload,
      "acceptDataProcessing"
    );

    if (!acceptDataProcessing) {
      throw new Error(
        "Debes aceptar el tratamiento de datos para completar tu registro."
      );
    }

    const acceptPromotions =
      typeof payload.acceptPromotions === "boolean"
        ? payload.acceptPromotions
        : false;
    const phone = normalizeOptionalPhone(payload.phone);
    const companyWebsite =
      typeof payload.companyWebsite === "string"
        ? payload.companyWebsite.trim()
        : "";

    if (companyWebsite) {
      return NextResponse.json({
        ready: true,
        sessionId,
        participantId: "screened-by-honeypot",
      });
    }

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
        answersCount:
          typeof payload.answersCount === "number"
            ? payload.answersCount
            : null,
      },
    });

    return NextResponse.json({
      ready: true,
      sessionId,
      participantId,
    });
  } catch (error) {
    console.error("Error registrando formulario del quiz:", error);

    return NextResponse.json(
      {
        error: "No fue posible registrar el formulario del quiz.",
      },
      { status: 400 }
    );
  }
}
