# Guía del Dashboard de Resultados - Dunkin' Colombia

## Objetivo

Esta guía explica cómo habilitar y usar el panel administrativo del quiz
("Dime qué tomas y te diré quién eres") para consultar resultados, analizar la
participación y exportar los datos de la campaña.

Rutas principales del proyecto:

- `/admin/login` — pantalla de ingreso administrativo
- `/admin` — dashboard principal con KPIs, tabla, gráficos y exportación
- `/admin/analytics` — vista extendida de analítica sobre el mismo dataset

> Complemento: toda la descripción técnica del panel y de sus endpoints está en
> [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md).

---

## 1. Requisitos previos antes de usar el dashboard

Antes de permitir ingreso a `/admin`, debe existir un entorno de Supabase
configurado con estas migraciones aplicadas:

1. `supabase/migrations/20250101000000_create_quiz_participants_table.sql`
2. `supabase/migrations/20260710090000_create_campaign_benefits_table.sql`
3. `supabase/migrations/20260724123000_prepare_quiz_tracking_schema.sql`
4. `supabase/migrations/20260724150000_create_admin_users_table.sql`

En la base de datos deben existir, al menos, estas tablas:

- `quiz_participants`
- `campaign_benefits`
- `quiz_sessions`
- `quiz_answers`
- `quiz_events`
- `admin_users`

---

## 2. Crear la primera cuenta administrativa

El dashboard usa **Supabase Auth** (correo + contraseña) combinado con una
lista blanca en la tabla `public.admin_users`. Solo los correos que estén
activos en `admin_users` pueden entrar a `/admin`.

### Paso 1. Crear el usuario en Supabase Auth (consola web)

1. Abre el proyecto de Supabase.
2. Entra en **Authentication → Users**.
3. Haz clic en **Add user → Create new user**.
4. Ingresa:
   - Email: `admin@dunkin.co` (o el correo oficial del equipo)
   - Password: una contraseña fuerte, diferente al resto de entornos.
5. Activa la opción **Auto confirm** (o confirma el link por email si lo
   prefieres).

### Paso 2. Autorizar el correo en la tabla admin_users

Abre **SQL Editor** en la consola de Supabase y ejecuta:

```sql
insert into public.admin_users (email, full_name, is_active)
values ('admin@dunkin.co', 'Equipo Administrativo Dunkin', true);
```

Puedes añadir más cuentas si hace falta:

```sql
insert into public.admin_users (email, full_name, is_active)
values
  ('marketing@dunkin.co', 'Equipo Marketing Dunkin', true),
  ('analytics@dunkin.co', 'Equipo Analítica Dunkin', true);
```

Para deshabilitar una cuenta sin borrarla:

```sql
update public.admin_users
set is_active = false
where email = 'correo@dominio.com';
```

### Paso 3. Variables de entorno para el hosting

El dashboard requiere estas 3 variables (públicas o privadas) cargadas en el
hosting:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=XXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=XXXXXXXX
```

- Las 2 públicas se usan para el login desde el navegador.
- `SUPABASE_SERVICE_ROLE_KEY` es privada (nunca exponerla al frontend) y se usa
  desde el servidor para leer las tablas administrativas.

---

## 3. Ingresar al dashboard

1. Abre la URL del deploy, seguida de `/admin/login`:
   - `https://tu-dominio.com/admin/login`
   - o en preview: `https://preview.example.com/admin/login`
2. Escribe el correo y la contraseña creada en Supabase Auth.
3. Pulsa **Entrar al dashboard**.

Si el correo existe en Auth pero **no** aparece en `admin_users`, redirige a:

```
/admin/login?error=unauthorized
```

y muestra un mensaje: *"Tu cuenta no está autorizada para entrar al dashboard
administrativo."*. En ese caso, repite el **Paso 2** de la sección anterior.

---

## 4. Qué muestra el dashboard principal (`/admin`)

La vista principal incluye, de forma inmediata:

### KPIs superiores

- Participantes Totales
- Tests Completados
- Formularios Enviados
- Conversión
- Tiempo Promedio del quiz
- Tasa de Abandono
- Clics en `Ver en Dunkin'`
- CTR del botón
- Bebida con más clics

### Distribuciones importantes

- Resultados por bebida recomendada
- Resultados por personalidad (Aventurero, Curioso, Explorador, Optimista)
- Participación por día y por hora
- Distribución por dispositivo, navegador y fuente de tráfico
- Abandono por pregunta (para detectar puntos de fricción)

### Tabla de participantes

Al final del dashboard hay una tabla con los registros disponibles:

- Correo del participante
- Personalidad y bebida
- Fecha/hora del test
- Estado: test iniciado, completado, formulario enviado
- Acciones rápidas para abrir detalle o exportar

---

## 5. Vista extendida de analítica (`/admin/analytics`)

La ruta `/admin/analytics` usa el mismo dataset que el dashboard principal
pero organiza la información en bloques más amplios para lectura analítica:

- Evolución temporal de participaciones
- Heatmap de entradas por hora y día
- Comparativa entre bebidas y personalidades
- Detalle de abandono por pregunta, con porcentaje de salida
- Fuentes de tráfico con mayor conversión

Sirve para compartir pantalla en reuniones o profundizar sin salir de la misma
aplicación.

---

## 6. Filtros del dashboard

Tanto en `/admin` como en `/admin/analytics` se puede filtrar por:

- Rango de fechas (fecha inicio / fecha fin)
- Bebida recomendada
- Personalidad
- Estado de finalización
- Dispositivo
- Fuente de tráfico

Los filtros se aplican por query string. Eso significa que:

- Puedes guardar un link directo con los filtros activos y compartírselo a otro
  administrador.
- Las exportaciones de CSV y XLSX usan los mismos filtros que haya activos en
  ese momento.

---

## 7. Exportar datos (CSV y Excel)

El dashboard expone 2 rutas de exportación:

### CSV
```
GET https://tu-dominio.com/api/admin/dashboard/export/csv
```

### Excel (.xlsx)
```
GET https://tu-dominio.com/api/admin/dashboard/export/xlsx
```

#### Cómo usarlas

- Opción A (recomendada): navega al dashboard, aplica los filtros que quieras
  y pulsa uno de los botones de exportación: **Descargar CSV** o **Descargar
  Excel**.
- Opción B (por URL): si necesitas entregar datos sin entrar al panel, usa la
  URL directa desde una sesión autenticada.

Ambos archivos respetan los filtros activos. Si no hay filtro, exportan el
dataset completo que pueda leer el administrador.

---

## 8. Endpoints internos del panel (para soporte técnico)

Estas rutas consumen datos el dashboard. No son públicas; requieren sesión
admin válida desde el servidor.

- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/charts`
- `GET /api/admin/dashboard/participants`

Si el panel "se queda blanco" al cargar, lo primero es revisar si estas 3
rutas responden con `200` desde la pestaña Network del navegador.

---

## 9. Problemas comunes y solución rápida

### 9.1 "No hay configuración pública de Supabase disponible"

Causa: faltan `NEXT_PUBLIC_SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
en el entorno del deploy.

Solución: añade las 2 variables y re-deploya.

### 9.2 Ingreso correo + contraseña correctos, pero no entra

Causa más probable: el correo no está dado de alta en `public.admin_users`.

Solución:
```sql
select * from public.admin_users where email = 'tu-correo@dominio.com';
```

Si no aparece, insértalo con la instrucción del **Paso 2**.

### 9.3 Dashboard cargar pero no muestra datos

Causa típica: no se aplicó la migración de tracking o no hay registros aún.

Solución:
1. Confirma que existan tablas `quiz_sessions`, `quiz_answers`, `quiz_events`.
2. Haz 1 prueba del quiz para generar 1 sesión y 1 finalización.
3. Refresca `/admin`.

### 9.4 Exportación falla o devuelve archivo vacío

Causa: `SUPABASE_SERVICE_ROLE_KEY` no está cargada, o no hay registros que
coincidan con los filtros actuales.

Solución:
1. Quita filtros y prueba otra vez.
2. Confirma que `SUPABASE_SERVICE_ROLE_KEY` esté en el hosting.
3. Valida que la tabla `quiz_participants` tenga al menos 1 registro.

---

## 10. Recomendaciones de seguridad

- No compartas credenciales de admin por mensajería instantánea.
- Usa 1 cuenta por persona, no una cuenta compartida genérica.
- Desactiva cuentas con `is_active = false` cuando alguien salga del equipo.
- Nunca subas `.env.local` ni `SUPABASE_SERVICE_ROLE_KEY` al repositorio.
- Si tienes dudas, usa primero un deploy en preview antes de tocar el
  dashboard de producción.
