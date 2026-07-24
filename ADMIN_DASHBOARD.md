# Dashboard Administrativo

## Objetivo

Este módulo agrega un backoffice interno para la campaña de Dunkin Colombia en
la ruta `/admin`, separado del flujo público `/quiz`.

## Rutas

- `/admin/login`: acceso administrativo con Supabase Auth
- `/admin`: dashboard principal con KPIs, gráficas, tabla y exportación
- `/admin/analytics`: vista extendida del mismo dataset para lectura analítica

## Requisitos de Base de Datos

Antes de usar el dashboard, deben estar aplicadas estas migraciones:

1. `20250101000000_create_quiz_participants_table.sql`
2. `20260710090000_create_campaign_benefits_table.sql`
3. `20260724123000_prepare_quiz_tracking_schema.sql`
4. `20260724150000_create_admin_users_table.sql`

## Tabla de Acceso Administrativo

El dashboard usa la tabla `public.admin_users` para decidir qué cuentas de
Supabase pueden entrar.

Columnas principales:

- `email`
- `full_name`
- `is_active`

### Ejemplo de alta manual

```sql
insert into public.admin_users (email, full_name, is_active)
values ('admin@tu-dominio.com', 'Equipo Marketing', true);
```

## Autenticación

- El login usa `Supabase Auth`
- El acceso a datos administrativos se valida en backend
- Solo usuarios autenticados y presentes en `admin_users` pueden usar `/admin`

## Variables necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Exportaciones

El dashboard expone:

- `GET /api/admin/dashboard/export/csv`
- `GET /api/admin/dashboard/export/xlsx`

Ambas exportaciones respetan los filtros activos del dashboard.

## Endpoints internos

- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/charts`
- `GET /api/admin/dashboard/participants`

## Qué muestra

- Participantes Totales
- Tests Completados
- Formularios Enviados
- Conversión
- Tiempo Promedio
- Tasa de Abandono
- Clics en `Ver en Dunkin`
- CTR del botón
- Bebida con más clics

Además:

- resultados por bebida
- resultados por personalidad
- participación por día
- participación por hora
- dispositivos
- navegadores
- fuentes de tráfico
- abandono por pregunta

## Notas de despliegue

- El equipo de despliegue debe crear o cargar las cuentas en Supabase Auth
- Después debe registrar esos correos en `admin_users`
- `SUPABASE_SERVICE_ROLE_KEY` nunca se expone al frontend
- El dashboard depende de datos del quiz ya almacenados en `quiz_sessions`,
  `quiz_answers` y `quiz_events`

## Estado actual

- UI admin implementada
- autenticación administrativa implementada
- endpoints agregados implementados
- exportación CSV/XLSX implementada
- layout desktop-first implementado
