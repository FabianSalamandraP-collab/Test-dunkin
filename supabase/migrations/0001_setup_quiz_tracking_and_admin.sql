-- Tablas core del tracking del quiz Dunkin' Colombia + admin_users.
-- Aplica esto en Supabase > SQL Editor antes de encender NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live.

-- ============================================================
-- Extensiones
-- ============================================================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================================
-- Dominios / ayudas
-- ============================================================
do $$
begin
  create type quiz_session_status as enum ('started', 'completed', 'abandoned');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type quiz_event_type as enum (
    'session_started',
    'question_answered',
    'session_completed',
    'session_abandoned',
    'view_in_dunkin',
    'share',
    'benefit_claim'
  );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 1) Participantes (registro único del usuario del quiz)
-- ============================================================
create table if not exists public.quiz_participants (
  id uuid primary key default uuid_generate_v4(),
  external_id text null,
  full_name text null,
  email text null,
  phone text null,
  document_type text null,
  document_number text null,
  birth_date date null,
  city text null,
  accept_terms boolean not null default false,
  accept_marketing_optin boolean not null default false,
  metadata jsonb null,
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint participants_email_uniq unique (email),
  constraint participants_external_id_uniq unique (external_id)
);

create index if not exists idx_quiz_participants_registered_at
  on public.quiz_participants (registered_at desc);

-- ============================================================
-- 2) Sesiones del quiz (cada intento del usuario)
-- ============================================================
create table if not exists public.quiz_sessions (
  id uuid primary key default uuid_generate_v4(),
  participant_id uuid null references public.quiz_participants(id) on delete set null,
  status quiz_session_status not null default 'started',
  personality_key text null,
  personality_label text null,
  recommended_drink_key text null,
  recommended_drink_label text null,
  answers_count int not null default 0,
  total_duration_seconds numeric(10,2) null,
  device_type text null,
  os_name text null,
  browser_name text null,
  screen_width int null,
  screen_height int null,
  ip_address text null,
  user_agent text null,
  referrer text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_content text null,
  utm_term text null,
  locale text null,
  timezone text null,
  country text null,
  city text null,
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  abandoned_at timestamptz null,
  abandoned_question_key text null,
  abandoned_question_order int null,
  metadata jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quiz_sessions_started_at
  on public.quiz_sessions (started_at desc);
create index if not exists idx_quiz_sessions_status
  on public.quiz_sessions (status);
create index if not exists idx_quiz_sessions_participant_id
  on public.quiz_sessions (participant_id);
create index if not exists idx_quiz_sessions_personality_key
  on public.quiz_sessions (personality_key);
create index if not exists idx_quiz_sessions_recommended_drink_key
  on public.quiz_sessions (recommended_drink_key);
create index if not exists idx_quiz_sessions_utm_campaign
  on public.quiz_sessions (utm_campaign);
create index if not exists idx_quiz_sessions_utm_source
  on public.quiz_sessions (utm_source);

-- ============================================================
-- 3) Respuestas por pregunta
-- ============================================================
create table if not exists public.quiz_answers (
  session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  question_key text not null,
  question_order int not null default 0,
  answer_key text not null,
  answer_label text null,
  answered_at timestamptz not null default now(),
  metadata jsonb null,
  primary key (session_id, question_key)
);

create index if not exists idx_quiz_answers_answered_at
  on public.quiz_answers (answered_at desc);
create index if not exists idx_quiz_answers_question_key
  on public.quiz_answers (question_key);

-- ============================================================
-- 4) Eventos (tracking granular: share, click en CTA, etc)
-- ============================================================
create table if not exists public.quiz_events (
  id uuid primary key default uuid_generate_v4(),
  event_type quiz_event_type not null,
  session_id uuid null references public.quiz_sessions(id) on delete set null,
  participant_id uuid null references public.quiz_participants(id) on delete set null,
  result_personality_key text null,
  recommended_drink_key text null,
  recommended_drink_label text null,
  clicked_drink_key text null,
  clicked_drink_label text null,
  target_url text null,
  device_type text null,
  os_name text null,
  browser_name text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  referrer text null,
  country text null,
  city text null,
  client_timestamp timestamptz null,
  created_at timestamptz not null default now(),
  metadata jsonb null
);

create index if not exists idx_quiz_events_created_at
  on public.quiz_events (created_at desc);
create index if not exists idx_quiz_events_event_type
  on public.quiz_events (event_type);
create index if not exists idx_quiz_events_session_id
  on public.quiz_events (session_id);
create index if not exists idx_quiz_events_participant_id
  on public.quiz_events (participant_id);
create index if not exists idx_quiz_events_recommended_drink_key
  on public.quiz_events (recommended_drink_key);
create index if not exists idx_quiz_events_clicked_drink_key
  on public.quiz_events (clicked_drink_key);

-- ============================================================
-- 5) Admin users / whitelist de correos autorizados
-- ============================================================
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  full_name text null,
  role text not null default 'viewer' check (role in ('owner','admin','viewer','analyst')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_email_uniq unique (email)
);

create index if not exists idx_admin_users_email_active
  on public.admin_users (email, is_active);

-- ============================================================
-- 6) Trigger de updated_at
-- ============================================================
create or replace function public.set_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_quiz_participants_updated_at
  on public.quiz_participants;
create trigger trg_quiz_participants_updated_at
before update on public.quiz_participants
for each row
execute function public.set_updated_at_column();

drop trigger if exists trg_quiz_sessions_updated_at
  on public.quiz_sessions;
create trigger trg_quiz_sessions_updated_at
before update on public.quiz_sessions
for each row
execute function public.set_updated_at_column();

drop trigger if exists trg_admin_users_updated_at
  on public.admin_users;
create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_updated_at_column();

-- ============================================================
-- 7) Policies (RLS) — las tablas empiezan con SECURITY ON.
--    El dashboard las lee vía service_role, así que le damos
--    permiso full a la service_key solo cuando el request llega
--    por server. Los usuarios anónimos NO escriben ni leen
--    directamente (lo hacen vía endpoints API de /api/quiz/*).
-- ============================================================
alter table public.quiz_participants enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_events enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "quiz_participants_service_role_all"
  on public.quiz_participants;
create policy "quiz_participants_service_role_all"
  on public.quiz_participants
  for all
  to postgres, anon, authenticated
  using (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'))
  with check (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'));

drop policy if exists "quiz_sessions_service_role_all"
  on public.quiz_sessions;
create policy "quiz_sessions_service_role_all"
  on public.quiz_sessions
  for all
  to postgres, anon, authenticated
  using (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'))
  with check (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'));

drop policy if exists "quiz_answers_service_role_all"
  on public.quiz_answers;
create policy "quiz_answers_service_role_all"
  on public.quiz_answers
  for all
  to postgres, anon, authenticated
  using (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'))
  with check (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'));

drop policy if exists "quiz_events_service_role_all"
  on public.quiz_events;
create policy "quiz_events_service_role_all"
  on public.quiz_events
  for all
  to postgres, anon, authenticated
  using (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'))
  with check (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'));

drop policy if exists "admin_users_service_role_all"
  on public.admin_users;
create policy "admin_users_service_role_all"
  on public.admin_users
  for all
  to postgres, anon, authenticated
  using (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'))
  with check (current_setting('request.jwt.claim.role', true) in ('service_role', 'postgres'));

-- ============================================================
-- 8) Inicializa tu correo admin (ajusta el email real).
--    Puedes correr esta línea manualmente con tu usuario.
-- ============================================================
-- insert into public.admin_users (email, full_name, role, is_active)
-- values ('tu-correo@dunkincolombia.com', 'Admin Dunkin', 'owner', true)
-- on conflict (email) do nothing;
