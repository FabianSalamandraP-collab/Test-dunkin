# Arquitectura de Base de Datos para el Quiz de Dunkin Colombia

## Objetivo

Diseñar una base de datos simple, escalable y fácil de consultar para un test
interactivo en Next.js 15 con Supabase.

La propuesta prioriza:

- consultas directas para dashboard
- trazabilidad completa del intento del usuario
- privacidad de datos personales
- baja complejidad operativa

## Estado en el repositorio

Esta propuesta ya quedó aterrizada en una migración lista para correr:

- `supabase/migrations/20260724123000_prepare_quiz_tracking_schema.sql`

Esa migración fue diseñada para despliegue por fases:

- conserva la tabla legacy `quiz_participants`
- agrega `registered_at` para mejorar reporting
- crea `quiz_sessions`, `quiz_answers` y `quiz_events`
- deja las tablas nuevas cerradas para escritura pública
- no rompe el formulario actual mientras el otro equipo integra la capa nueva

## Estrategia de compatibilidad

El repo hoy todavía tiene una integración frontend que inserta directamente en la
tabla legacy `quiz_participants`.

Por eso la migración implementada no renombra ni elimina esa tabla.

La idea es que el equipo de despliegue pueda:

1. correr la migración
2. validar el esquema nuevo en Supabase
3. conectar gradualmente la app a `quiz_sessions`, `quiz_answers` y
   `quiz_events`
4. retirar la dependencia del modelo legacy cuando toda la captura esté migrada
5. retirar la dependencia del modelo legacy cuando toda la captura esté migrada

## Enfoque recomendado

La unidad principal del sistema debe ser el intento del test, no el usuario.

Eso significa que la tabla más importante es `quiz_sessions`, porque:

- una persona puede hacer el test más de una vez
- el formulario puede enviarse solo al final
- el abandono ocurre antes de que exista un registro completo del usuario
- casi toda la analítica se consulta por sesión, no por contacto

## Modelo propuesto

La propuesta usa 4 tablas principales:

1. `quiz_participants`
   Guarda los datos personales y consentimientos.

2. `quiz_sessions`
   Guarda cada intento del test, su resultado, estado, UTM y contexto técnico.

3. `quiz_answers`
   Guarda una fila por respuesta seleccionada en cada sesión.

4. `quiz_events`
   Guarda eventos de tracking para auditoría y analítica de funnel.

## Por qué este modelo es simple y escalable

- separa datos personales de analítica
- permite abandono sin requerir formulario
- evita poner todo en un solo `jsonb`
- mantiene consultas de dashboard rápidas
- deja `answers` normalizado para análisis por pregunta
- deja `events` append-only para auditoría y tracking

## Relaciones

```text
quiz_participants 1 --- n quiz_sessions
quiz_sessions     1 --- n quiz_answers
quiz_sessions     1 --- n quiz_events
quiz_participants 1 --- n quiz_events
```

## Diseño lógico

### 1. `quiz_participants`

Guarda únicamente información de contacto y consentimiento.

Campos:

- `id`
- `created_at`
- `registered_at`
- `full_name`
- `email`
- `phone`
- `accept_data_processing`
- `accept_promotions`

Notas:

- `email` debe ser único para facilitar deduplicación
- `phone` es opcional
- `registered_at` representa la fecha real de envío del formulario

### 2. `quiz_sessions`

Guarda cada intento del test, incluso si el usuario nunca envía el formulario.

Campos:

- `id`
- `created_at`
- `started_at`
- `completed_at`
- `abandoned_at`
- `participant_id`
- `status`
- `is_completed`
- `is_abandoned`
- `abandoned_question_key`
- `abandoned_question_order`
- `personality_key`
- `personality_label`
- `recommended_drink_key`
- `recommended_drink_label`
- `score`
- `total_duration_seconds`
- `answers_count`
- `device_type`
- `browser_name`
- `os_name`
- `language`
- `screen_width`
- `screen_height`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`

Notas:

- aquí vive casi toda la información del dashboard
- `participant_id` es nullable porque la sesión puede abandonar antes del form
- `personality_label` y `recommended_drink_label` quedan denormalizados para
  consultas rápidas
- no hace falta guardar columnas separadas de fecha y hora; salen de
  `started_at`

### 3. `quiz_answers`

Una fila por respuesta.

Campos:

- `id`
- `session_id`
- `question_key`
- `question_order`
- `selected_option_key`
- `selected_option_label`
- `selected_value`
- `answered_at`

Notas:

- esto reemplaza el uso de `answers jsonb`
- facilita análisis por pregunta, opción y personalidad
- un índice único por `session_id + question_key` evita duplicados

### 4. `quiz_events`

Tabla append-only para eventos del funnel.

Eventos mínimos:

- `test_started`
- `question_answered`
- `test_completed`
- `form_submitted`
- `view_in_dunkin_clicked`

Evento recomendado adicional:

- `test_abandoned`

Campos:

- `id`
- `created_at`
- `event_type`
- `session_id`
- `participant_id`
- `result_personality_key`
- `recommended_drink_key`
- `recommended_drink_label`
- `question_key`
- `question_order`
- `selected_option_key`
- `device_type`
- `browser_name`
- `metadata`

Notas:

- la tabla de eventos no reemplaza a `quiz_sessions`; la complementa
- sirve para auditoría, embudos y debugging de tracking
- `metadata` permite crecer sin romper el esquema

## SQL base propuesto

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.quiz_session_status as enum (
  'started',
  'completed',
  'abandoned'
);

create type public.quiz_event_type as enum (
  'test_started',
  'question_answered',
  'test_completed',
  'form_submitted',
  'view_in_dunkin_clicked',
  'test_abandoned'
);

create table if not exists public.quiz_participants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  registered_at timestamptz not null default timezone('utc', now()),
  full_name text not null,
  email citext not null,
  phone text null,
  accept_data_processing boolean not null,
  accept_promotions boolean not null default false,
  constraint quiz_participants_email_unique unique (email)
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz null,
  abandoned_at timestamptz null,
  participant_id uuid null references public.quiz_participants(id) on delete set null,
  status public.quiz_session_status not null default 'started',
  is_completed boolean not null default false,
  is_abandoned boolean not null default false,
  abandoned_question_key text null,
  abandoned_question_order smallint null,
  personality_key text null,
  personality_label text null,
  recommended_drink_key text null,
  recommended_drink_label text null,
  score integer null,
  total_duration_seconds integer null,
  answers_count smallint not null default 0,
  device_type text null,
  browser_name text null,
  os_name text null,
  language text null,
  screen_width integer null,
  screen_height integer null,
  referrer text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  constraint quiz_sessions_score_check check (score is null or score >= 0),
  constraint quiz_sessions_duration_check check (
    total_duration_seconds is null or total_duration_seconds >= 0
  ),
  constraint quiz_sessions_abandonment_check check (
    not (is_completed = true and is_abandoned = true)
  )
);

create table if not exists public.quiz_answers (
  id bigserial primary key,
  created_at timestamptz not null default timezone('utc', now()),
  session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  question_key text not null,
  question_order smallint not null,
  selected_option_key text not null,
  selected_option_label text not null,
  selected_value text null,
  answered_at timestamptz not null default timezone('utc', now()),
  constraint quiz_answers_unique_question_per_session
    unique (session_id, question_key)
);

create table if not exists public.quiz_events (
  id bigserial primary key,
  created_at timestamptz not null default timezone('utc', now()),
  event_type public.quiz_event_type not null,
  session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  participant_id uuid null references public.quiz_participants(id) on delete set null,
  result_personality_key text null,
  recommended_drink_key text null,
  recommended_drink_label text null,
  question_key text null,
  question_order smallint null,
  selected_option_key text null,
  device_type text null,
  browser_name text null,
  metadata jsonb not null default '{}'::jsonb
);
```

## Índices recomendados

```sql
create index if not exists idx_quiz_participants_registered_at
  on public.quiz_participants (registered_at desc);

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

create index if not exists idx_quiz_sessions_utm_source
  on public.quiz_sessions (utm_source);

create index if not exists idx_quiz_sessions_device_browser
  on public.quiz_sessions (device_type, browser_name);

create index if not exists idx_quiz_answers_session_order
  on public.quiz_answers (session_id, question_order);

create index if not exists idx_quiz_answers_question_key
  on public.quiz_answers (question_key);

create index if not exists idx_quiz_answers_selected_value
  on public.quiz_answers (selected_value);

create index if not exists idx_quiz_events_type_created_at
  on public.quiz_events (event_type, created_at desc);

create index if not exists idx_quiz_events_session_id
  on public.quiz_events (session_id);

create index if not exists idx_quiz_events_participant_id
  on public.quiz_events (participant_id);

create index if not exists idx_quiz_events_question_key
  on public.quiz_events (question_key);
```

## Políticas RLS recomendadas

## Principio de seguridad

La recomendación es no escribir directamente desde el cliente a estas tablas con
la key pública.

Lo ideal en Next.js 15 es:

- capturar eventos desde Route Handlers o Server Actions
- escribir en Supabase con `service_role`
- dejar RLS cerrada al público

Esto simplifica seguridad y evita políticas complejas para `anon`.

### Función helper para admins del dashboard

```sql
create or replace function public.is_quiz_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;
```

### Activación de RLS

```sql
alter table public.quiz_participants enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_events enable row level security;
```

### Políticas recomendadas

```sql
create policy "quiz admins can read participants"
on public.quiz_participants
for select
to authenticated
using (public.is_quiz_admin());

create policy "quiz admins can read sessions"
on public.quiz_sessions
for select
to authenticated
using (public.is_quiz_admin());

create policy "quiz admins can read answers"
on public.quiz_answers
for select
to authenticated
using (public.is_quiz_admin());

create policy "quiz admins can read events"
on public.quiz_events
for select
to authenticated
using (public.is_quiz_admin());

create policy "quiz admins can update participants"
on public.quiz_participants
for update
to authenticated
using (public.is_quiz_admin())
with check (public.is_quiz_admin());

create policy "quiz admins can update sessions"
on public.quiz_sessions
for update
to authenticated
using (public.is_quiz_admin())
with check (public.is_quiz_admin());
```

## Importante sobre inserciones

Si la app escribe mediante backend con `service_role`, no hace falta abrir
políticas `INSERT` para `anon`.

Eso es preferible porque:

- protege PII
- evita escritura arbitraria desde el navegador
- permite validar UTM, referrer y device antes de guardar
- centraliza el tracking

## Flujo recomendado de escritura

### 1. Inicio del test

Cuando el usuario pulsa `Haz el test`:

- crear una fila en `quiz_sessions`
- guardar contexto técnico y UTM
- insertar un evento `test_started`

### 2. Respuesta por pregunta

Cuando responde una pregunta:

- hacer `upsert` en `quiz_answers`
- actualizar `answers_count` en `quiz_sessions`
- insertar evento `question_answered`

### 3. Finalización del test

Al terminar:

- actualizar `quiz_sessions` con:
  - `status = 'completed'`
  - `is_completed = true`
  - `completed_at`
  - `personality_key`
  - `personality_label`
  - `recommended_drink_key`
  - `recommended_drink_label`
  - `score`
  - `total_duration_seconds`
- insertar evento `test_completed`

### 4. Abandono

Si el usuario sale del flujo:

- actualizar `quiz_sessions` con:
  - `status = 'abandoned'`
  - `is_abandoned = true`
  - `abandoned_at`
  - `abandoned_question_key`
  - `abandoned_question_order`
- insertar evento `test_abandoned`

### 5. Envío del formulario

Cuando el usuario envía nombre y correo:

- hacer `upsert` en `quiz_participants` por `email`
- actualizar `quiz_sessions.participant_id`
- insertar evento `form_submitted`

### 6. Clic en "Ver en Dunkin'"

Cuando el usuario hace clic:

- insertar evento `view_in_dunkin_clicked`

## Consultas para dashboard

Las siguientes consultas están pensadas para ejecutarse directo sobre PostgreSQL
o exponerse mediante vistas SQL en Supabase.

### 1. Participantes

```sql
select count(*) as participantes
from public.quiz_participants;
```

### 2. Tests completados

```sql
select count(*) as tests_completados
from public.quiz_sessions
where is_completed = true;
```

### 3. Formularios enviados

```sql
select count(*) as formularios_enviados
from public.quiz_sessions
where participant_id is not null;
```

### 4. Conversión

Conversión principal sobre tests completados.

```sql
select
  count(*) filter (where participant_id is not null)::numeric
  / nullif(count(*) filter (where is_completed = true), 0) * 100
  as conversion_pct
from public.quiz_sessions;
```

### 5. Tiempo promedio del test

```sql
select round(avg(total_duration_seconds)) as tiempo_promedio_segundos
from public.quiz_sessions
where is_completed = true
  and total_duration_seconds is not null;
```

### 6. Abandono total

```sql
select count(*) as abandonos
from public.quiz_sessions
where is_abandoned = true;
```

### 7. Abandono por pregunta

```sql
select
  abandoned_question_key,
  abandoned_question_order,
  count(*) as abandonos
from public.quiz_sessions
where is_abandoned = true
group by abandoned_question_key, abandoned_question_order
order by abandoned_question_order nulls last;
```

### 8. Bebida más obtenida

```sql
select
  recommended_drink_label,
  count(*) as total
from public.quiz_sessions
where is_completed = true
group by recommended_drink_label
order by total desc;
```

### 9. Personalidades

```sql
select
  personality_label,
  count(*) as total
from public.quiz_sessions
where is_completed = true
group by personality_label
order by total desc;
```

### 10. Participación diaria

```sql
select
  date(started_at at time zone 'America/Bogota') as fecha,
  count(*) as sesiones
from public.quiz_sessions
group by fecha
order by fecha desc;
```

### 11. Participación por hora

```sql
select
  extract(hour from started_at at time zone 'America/Bogota') as hora,
  count(*) as sesiones
from public.quiz_sessions
group by hora
order by hora;
```

### 12. Dispositivos

```sql
select
  coalesce(device_type, 'desconocido') as dispositivo,
  count(*) as sesiones
from public.quiz_sessions
group by dispositivo
order by sesiones desc;
```

### 13. Navegadores

```sql
select
  coalesce(browser_name, 'desconocido') as navegador,
  count(*) as sesiones
from public.quiz_sessions
group by navegador
order by sesiones desc;
```

### 14. Fuentes de tráfico

```sql
select
  coalesce(utm_source, 'direct') as utm_source,
  coalesce(utm_medium, 'none') as utm_medium,
  coalesce(utm_campaign, 'none') as utm_campaign,
  count(*) as sesiones
from public.quiz_sessions
group by 1, 2, 3
order by sesiones desc;
```

### 15. Clics en "Ver en Dunkin'"

```sql
select count(*) as clics_ver_en_dunkin
from public.quiz_events
where event_type = 'view_in_dunkin_clicked';
```

### 16. Embudo básico

```sql
select
  count(*) filter (where status = 'started') as iniciados,
  count(*) filter (where is_completed = true) as completados,
  count(*) filter (where participant_id is not null) as formularios,
  count(*) filter (
    where id in (
      select session_id
      from public.quiz_events
      where event_type = 'view_in_dunkin_clicked'
    )
  ) as clic_ver_en_dunkin
from public.quiz_sessions;
```

## Recomendación de implementación en Next.js 15

### Backend

Crear endpoints o server actions para:

- `POST /api/quiz/session/start`
- `POST /api/quiz/session/answer`
- `POST /api/quiz/session/complete`
- `POST /api/quiz/session/abandon`
- `POST /api/quiz/form/submit`
- `POST /api/quiz/event/view-in-dunkin`

### Frontend

Mantener en Zustand:

- `sessionId`
- timestamp de inicio
- answers seleccionadas en memoria
- utm capturados al cargar la landing

## Migración recomendada desde la tabla actual

Actualmente existe una tabla `quiz_participants` plana con:

- `name`
- `email`
- `phone`
- `accept_data_processing`
- `accept_promotions`
- `quiz_result`
- `answers`

Esa versión sirve para captura básica, pero se queda corta para:

- abandono
- eventos
- tiempo del test
- dispositivo y navegador
- UTM
- consultas de dashboard por sesión

La recomendación es evolucionar a este modelo `v2` y dejar la tabla actual solo
como referencia histórica si ya contiene datos.

## Resumen ejecutivo

La arquitectura recomendada es:

- `quiz_participants` para PII y consentimientos
- `quiz_sessions` como tabla central del negocio
- `quiz_answers` para análisis por pregunta
- `quiz_events` para tracking del funnel

Con este esquema se cubren:

- registro
- resultado
- analítica
- abandono
- eventos
- dashboard
- seguridad con RLS

sin volver el modelo innecesariamente complejo.
