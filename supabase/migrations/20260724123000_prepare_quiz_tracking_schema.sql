-- Preparar esquema v2 del quiz para analytics, abandono y eventos.
-- Esta migracion es aditiva: conserva la tabla legacy quiz_participants
-- para no romper el formulario actual y agrega las estructuras nuevas
-- necesarias para una integracion por fases.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'quiz_session_status'
      AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.quiz_session_status AS ENUM (
      'started',
      'completed',
      'abandoned'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'quiz_event_type'
      AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.quiz_event_type AS ENUM (
      'test_started',
      'question_answered',
      'test_completed',
      'form_submitted',
      'view_in_dunkin_clicked',
      'test_abandoned'
    );
  END IF;
END $$;

ALTER TABLE public.quiz_participants
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP WITH TIME ZONE;

UPDATE public.quiz_participants
SET registered_at = created_at
WHERE registered_at IS NULL;

ALTER TABLE public.quiz_participants
  ALTER COLUMN registered_at
  SET DEFAULT TIMEZONE('utc'::text, NOW());

ALTER TABLE public.quiz_participants
  ALTER COLUMN registered_at
  SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_quiz_participants_registered_at
  ON public.quiz_participants(registered_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_participants_email_ci
  ON public.quiz_participants(LOWER(email));

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  participant_id UUID REFERENCES public.quiz_participants(id) ON DELETE SET NULL,
  status public.quiz_session_status NOT NULL DEFAULT 'started',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_abandoned BOOLEAN NOT NULL DEFAULT FALSE,
  abandoned_question_key TEXT,
  abandoned_question_order SMALLINT,
  personality_key TEXT,
  personality_label TEXT,
  recommended_drink_key TEXT,
  recommended_drink_label TEXT,
  score INTEGER,
  total_duration_seconds INTEGER,
  answers_count SMALLINT NOT NULL DEFAULT 0,
  device_type TEXT,
  browser_name TEXT,
  os_name TEXT,
  language TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  CONSTRAINT quiz_sessions_score_check CHECK (
    score IS NULL OR score >= 0
  ),
  CONSTRAINT quiz_sessions_duration_check CHECK (
    total_duration_seconds IS NULL OR total_duration_seconds >= 0
  ),
  CONSTRAINT quiz_sessions_abandonment_check CHECK (
    NOT (is_completed = TRUE AND is_abandoned = TRUE)
  )
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_order SMALLINT NOT NULL,
  selected_option_key TEXT NOT NULL,
  selected_option_label TEXT NOT NULL,
  selected_value TEXT,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT quiz_answers_unique_question_per_session
    UNIQUE (session_id, question_key)
);

CREATE TABLE IF NOT EXISTS public.quiz_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  event_type public.quiz_event_type NOT NULL,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.quiz_participants(id) ON DELETE SET NULL,
  result_personality_key TEXT,
  recommended_drink_key TEXT,
  recommended_drink_label TEXT,
  question_key TEXT,
  question_order SMALLINT,
  selected_option_key TEXT,
  device_type TEXT,
  browser_name TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_started_at
  ON public.quiz_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status
  ON public.quiz_sessions(status);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_participant_id
  ON public.quiz_sessions(participant_id);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_personality_key
  ON public.quiz_sessions(personality_key);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_recommended_drink_key
  ON public.quiz_sessions(recommended_drink_key);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_utm_source
  ON public.quiz_sessions(utm_source);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_device_browser
  ON public.quiz_sessions(device_type, browser_name);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_order
  ON public.quiz_answers(session_id, question_order);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_question_key
  ON public.quiz_answers(question_key);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_selected_value
  ON public.quiz_answers(selected_value);

CREATE INDEX IF NOT EXISTS idx_quiz_events_type_created_at
  ON public.quiz_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_events_session_id
  ON public.quiz_events(session_id);

CREATE INDEX IF NOT EXISTS idx_quiz_events_participant_id
  ON public.quiz_events(participant_id);

CREATE INDEX IF NOT EXISTS idx_quiz_events_question_key
  ON public.quiz_events(question_key);

CREATE OR REPLACE FUNCTION public.is_quiz_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;

-- Nota:
-- Las tablas nuevas del esquema v2 se dejan sin politicas publicas de escritura.
-- La intencion es que el backend de Next.js escriba con service_role.
-- La tabla legacy quiz_participants mantiene su politica anterior para no romper
-- el formulario actual mientras la app migra por fases.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiz_participants'
      AND policyname = 'Quiz admins pueden leer participantes'
  ) THEN
    CREATE POLICY "Quiz admins pueden leer participantes"
      ON public.quiz_participants
      FOR SELECT
      TO authenticated
      USING (public.is_quiz_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiz_participants'
      AND policyname = 'Quiz admins pueden actualizar participantes'
  ) THEN
    CREATE POLICY "Quiz admins pueden actualizar participantes"
      ON public.quiz_participants
      FOR UPDATE
      TO authenticated
      USING (public.is_quiz_admin())
      WITH CHECK (public.is_quiz_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiz_sessions'
      AND policyname = 'Quiz admins pueden leer sesiones'
  ) THEN
    CREATE POLICY "Quiz admins pueden leer sesiones"
      ON public.quiz_sessions
      FOR SELECT
      TO authenticated
      USING (public.is_quiz_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiz_answers'
      AND policyname = 'Quiz admins pueden leer respuestas'
  ) THEN
    CREATE POLICY "Quiz admins pueden leer respuestas"
      ON public.quiz_answers
      FOR SELECT
      TO authenticated
      USING (public.is_quiz_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiz_events'
      AND policyname = 'Quiz admins pueden leer eventos'
  ) THEN
    CREATE POLICY "Quiz admins pueden leer eventos"
      ON public.quiz_events
      FOR SELECT
      TO authenticated
      USING (public.is_quiz_admin());
  END IF;
END $$;
