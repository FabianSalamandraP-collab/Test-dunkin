import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Nullable<T> = T | null;

export interface QuizTrackingAdminContext {
  admin: SupabaseClient;
  supabaseUrl: string;
}

export interface QuizSessionSummary {
  id: string;
  participant_id: Nullable<string>;
  personality_key: Nullable<string>;
  personality_label: Nullable<string>;
  recommended_drink_key: Nullable<string>;
  recommended_drink_label: Nullable<string>;
}

export function getQuizTrackingAdminContext():
  { ok: true; value: QuizTrackingAdminContext } | { ok: false; error: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      error:
        "La capa de tracking del quiz requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return {
    ok: true,
    value: {
      admin,
      supabaseUrl,
    },
  };
}

export function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOptionalInteger(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export function requireTextField(
  payload: Record<string, unknown>,
  key: string
): string {
  const value = normalizeOptionalText(payload[key]);

  if (!value) {
    throw new Error(`El campo "${key}" es obligatorio.`);
  }

  return value;
}

export function requireBooleanField(
  payload: Record<string, unknown>,
  key: string
): boolean {
  if (typeof payload[key] !== "boolean") {
    throw new Error(`El campo "${key}" debe ser boolean.`);
  }

  return payload[key] as boolean;
}

export function requireIntegerField(
  payload: Record<string, unknown>,
  key: string
): number {
  const value = normalizeOptionalInteger(payload[key]);

  if (value === null) {
    throw new Error(`El campo "${key}" debe ser un entero.`);
  }

  return value;
}

export async function getSessionSummary(
  admin: QuizTrackingAdminContext["admin"],
  sessionId: string
): Promise<QuizSessionSummary> {
  const { data, error } = await admin
    .from("quiz_sessions")
    .select(
      "id,participant_id,personality_key,personality_label,recommended_drink_key,recommended_drink_label"
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("La sesión indicada no existe.");
  }

  return data as QuizSessionSummary;
}

export async function insertQuizEvent(
  admin: QuizTrackingAdminContext["admin"],
  event: {
    event_type:
      | "test_started"
      | "question_answered"
      | "test_completed"
      | "form_submitted"
      | "view_in_dunkin_clicked"
      | "test_abandoned";
    session_id: string;
    participant_id?: string | null;
    result_personality_key?: string | null;
    recommended_drink_key?: string | null;
    recommended_drink_label?: string | null;
    question_key?: string | null;
    question_order?: number | null;
    selected_option_key?: string | null;
    device_type?: string | null;
    browser_name?: string | null;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await admin.from("quiz_events").insert({
    event_type: event.event_type,
    session_id: event.session_id,
    participant_id: event.participant_id ?? null,
    result_personality_key: event.result_personality_key ?? null,
    recommended_drink_key: event.recommended_drink_key ?? null,
    recommended_drink_label: event.recommended_drink_label ?? null,
    question_key: event.question_key ?? null,
    question_order: event.question_order ?? null,
    selected_option_key: event.selected_option_key ?? null,
    device_type: event.device_type ?? null,
    browser_name: event.browser_name ?? null,
    metadata: event.metadata ?? {},
  });

  if (error) {
    throw error;
  }
}
