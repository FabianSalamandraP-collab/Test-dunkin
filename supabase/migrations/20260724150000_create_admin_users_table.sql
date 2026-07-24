-- Tabla de acceso administrativo para el dashboard interno.
-- Esta tabla define qué correos autenticados en Supabase pueden entrar a /admin.

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email
  ON public.admin_users(email);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.admin_users TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_users'
      AND policyname = 'Admin users pueden leerse a si mismos'
  ) THEN
    CREATE POLICY "Admin users pueden leerse a si mismos"
      ON public.admin_users
      FOR SELECT
      TO authenticated
      USING (LOWER(email::text) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));
  END IF;
END $$;
