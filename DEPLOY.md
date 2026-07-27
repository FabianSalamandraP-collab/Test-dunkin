# Guia de Despliegue

## Objetivo

Este documento deja el proyecto listo para handoff tecnico. Explica que necesita
el equipo que recibira la entrega para desplegar la campana cuando quiera, sin
depender de contexto adicional ni de configuraciones ocultas.

## Stack de Produccion

- Framework: `Next.js 15`
- Runtime: `Node.js 20+`
- Base de datos: `Supabase / PostgreSQL`
- Hosting recomendado: `Vercel`
- Comandos de produccion:

```bash
npm install
npm run lint
npm run build
npm start
```

## Variables de Entorno

Crear `.env.local` para local o cargar estas mismas variables en el hosting:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://tu-dominio-final.com
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview
GOOGLE_SITE_VERIFICATION=
BENEFITS_SYNC_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

### Deploy de prueba recomendado

Para un preview funcional sin escrituras en base de datos:

- Definir `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview`
- No cargar `SUPABASE_SERVICE_ROLE_KEY`
- No cargar `BENEFITS_SYNC_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pueden quedar vacias si el objetivo es un QA aislado

Si `NEXT_PUBLIC_QUIZ_RUNTIME_MODE` no se define, el proyecto ahora entra en
`preview` por seguridad. Para un despliegue real, el equipo que recibe la
entrega debe cambiarla explicitamente a `live`.

### Despliegue sin Supabase

El proyecto ya puede desplegarse sin conectar Supabase. En ese caso:

- La app carga y el quiz funciona normalmente.
- La recomendacion usa fuente `live` o `fallback`.
- El formulario continua, pero no persiste registros en `quiz_participants`.
- La ruta `POST /api/benefits/sync` queda desactivada y responde sin error duro.

### Para que sirve cada variable

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase. Opcional si no se usara base de datos en ese entorno.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publica usada por el cliente. Opcional si no se usara base de datos en ese entorno.
- `NEXT_PUBLIC_SITE_URL`: dominio final exacto para SEO, `robots.txt`,
  `sitemap.xml`, canonical y Open Graph.
- `NEXT_PUBLIC_QUIZ_RUNTIME_MODE`: controla si el quiz corre en `preview`
  (sin escrituras) o `live` (tracking y persistencia reales si el backend esta listo).
- `GOOGLE_SITE_VERIFICATION`: codigo opcional para Search Console.
- `BENEFITS_SYNC_SECRET`: secreto privado para ejecutar la sincronizacion
  inicial o futuras sincronizaciones de beneficios. Opcional si no se hara sync con Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada para actualizar
  `campaign_benefits` desde el servidor. Opcional si no se hara sync con Supabase.

## Base de Datos

El proyecto hoy usa estas piezas de datos:

- `quiz_participants`
- `campaign_benefits`
- `quiz_sessions`
- `quiz_answers`
- `quiz_events`

### Migraciones que deben aplicarse

Aplicar estas migraciones:

1. `supabase/migrations/20250101000000_create_quiz_participants_table.sql`
2. `supabase/migrations/20260710090000_create_campaign_benefits_table.sql`
3. `supabase/migrations/20260724123000_prepare_quiz_tracking_schema.sql`

### Nota importante

- La migracion duplicada `0001_create_quiz_participants_table.sql` ya fue
  eliminada del repositorio para evitar conflictos de policies duplicadas.
- `quiz_participants` debe permitir `INSERT` para `anon`, porque el formulario
  guarda la informacion desde cliente.

## Checklist Exacto de Despliegue

Seguir este orden exacto:

1. Clonar la rama final aprobada.
2. Crear el proyecto Supabase de destino.
3. Cargar variables del entorno en el hosting o en `.env.local` privado.
4. Ejecutar todas las migraciones de `supabase/migrations`.
5. Verificar que existan `quiz_participants`, `campaign_benefits`,
   `quiz_sessions`, `quiz_answers` y `quiz_events`.
6. Ejecutar `npm install`.
7. Ejecutar `npm run lint`.
8. Ejecutar `npm run build`.
9. Desplegar un preview.
10. Ejecutar la sync inicial de beneficios, si aplica.
11. Ejecutar el smoke test del tracking o validar el funnel manualmente.
12. Probar el flujo completo del quiz en preview con Supabase real.
13. Aprobar preview.
14. Conectar dominio final.
15. Confirmar que `NEXT_PUBLIC_SITE_URL` coincide con el dominio final.
16. Revalidar producción.

## Flujo de Despliegue Recomendado

### 1. Preparar Supabase

1. Crear el proyecto Supabase de produccion.
2. Ejecutar las migraciones del directorio `supabase/migrations`.
3. Confirmar que existe la tabla `quiz_participants`.
4. Confirmar que existe la tabla `campaign_benefits`.
5. Confirmar que existen `quiz_sessions`, `quiz_answers` y `quiz_events`.
6. Confirmar que `quiz_participants` permite insercion desde `anon` si se usara
   el flujo legacy desde cliente.

### 2. Preparar el hosting

1. Conectar el repositorio al hosting.
2. Cargar todas las variables de entorno.
3. Confirmar que `NEXT_PUBLIC_SITE_URL` coincide exactamente con el dominio
   que se va a publicar.

### 3. Validar el proyecto antes de publicar

Ejecutar:

```bash
npm install
npm run lint
npm run build
```

El proyecto ya fue validado localmente con `lint` y `build`, pero este paso se
debe repetir en el entorno del equipo que despliega.

### 4. Validar tracking y persistencia

Si el entorno tiene variables reales de Supabase:

```bash
npm run test:tracking:local
```

Este smoke test valida:

- inicio de sesión
- respuestas por pregunta
- finalización
- envío de formulario
- clic en `Ver en Dunkin'`

### 5. Ejecutar la sincronizacion inicial de beneficios

Este paso solo aplica si el entorno tiene Supabase configurado.

Despues de desplegar el preview o el entorno productivo, ejecutar:

```bash
curl -X POST "https://tu-dominio-o-preview.com/api/benefits/sync" \
  -H "Authorization: Bearer TU_BENEFITS_SYNC_SECRET"
```

### Recomendacion de seguridad

- Usar siempre el header `Authorization: Bearer ...`
- No enviar el secreto por query string

## Que valida cada parte

### Frontend

- `/` redirige a `/quiz`
- Intro carga correctamente
- Preguntas muestran imagenes, opciones y progreso
- Resultado muestra la personalidad y la bebida
- Formulario legal y de registro funciona correctamente

### Base de datos

- El formulario inserta en `quiz_participants` solo si Supabase esta configurado
- El tracking guarda sesión, respuestas, finalización, abandono y clic final si
  `SUPABASE_SERVICE_ROLE_KEY` está configurada
- La recomendacion lee beneficios desde `campaign_benefits` o degrada a `live/fallback`
- La sincronizacion actualiza beneficios activos solo si Supabase esta configurado

### SEO

- `sitemap.xml` responde con el dominio real
- `robots.txt` responde con el dominio real
- Open Graph usa el dominio correcto

## Checklist de Entrega

- Variables de entorno cargadas
- Migraciones aplicadas
- Tracking validado en preview o por smoke test
- Sync inicial de beneficios ejecutada, si aplica
- Dominio final configurado en `NEXT_PUBLIC_SITE_URL`
- `npm run lint` exitoso
- `npm run build` exitoso
- Preview validado funcionalmente
- Formulario validado contra Supabase real, si aplica
- Resultado validado con beneficios reales, si aplica
- SEO validado

## Riesgos Reales a Vigilar

- `NEXT_PUBLIC_SITE_URL` mal configurado
- Clave publica de Supabase equivocada
- `SUPABASE_SERVICE_ROLE_KEY` ausente
- `BENEFITS_SYNC_SECRET` ausente
- no ejecutar la migracion `20260724123000_prepare_quiz_tracking_schema.sql`
- No ejecutar la sync inicial de beneficios
- Diferencias entre preview y produccion
- Assets faltantes en `public/assets/quiz-questions/`,
  `public/assets/quiz-results/` o `public/assets/quiz-benefits/`

## Handoff Tecnico

Si otro equipo recibe este proyecto, necesita como minimo:

1. Acceso al repositorio
2. Acceso al proyecto Supabase o credenciales nuevas de produccion
3. Variables de entorno completas
4. Esta guia de despliegue
5. `ENTREGA_TEST.md` como checklist operativo corto

Con eso, el proyecto queda listo para ser desplegado sin depender de contexto
adicional del equipo original.
