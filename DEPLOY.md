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
GOOGLE_SITE_VERIFICATION=
BENEFITS_SYNC_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

### Para que sirve cada variable

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publica usada por el cliente.
- `NEXT_PUBLIC_SITE_URL`: dominio final exacto para SEO, `robots.txt`,
  `sitemap.xml`, canonical y Open Graph.
- `GOOGLE_SITE_VERIFICATION`: codigo opcional para Search Console.
- `BENEFITS_SYNC_SECRET`: secreto privado para ejecutar la sincronizacion
  inicial o futuras sincronizaciones de beneficios.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada para actualizar
  `campaign_benefits` desde el servidor.

## Base de Datos

El proyecto usa dos tablas:

- `quiz_participants`
- `campaign_benefits`

### Migraciones que deben aplicarse

Aplicar estas migraciones:

1. `supabase/migrations/20250101000000_create_quiz_participants_table.sql`
2. `supabase/migrations/20260710090000_create_campaign_benefits_table.sql`

### Nota importante

- La migracion duplicada `0001_create_quiz_participants_table.sql` ya fue
  eliminada del repositorio para evitar conflictos de policies duplicadas.
- `quiz_participants` debe permitir `INSERT` para `anon`, porque el formulario
  guarda la informacion desde cliente.

## Flujo de Despliegue Recomendado

### 1. Preparar Supabase

1. Crear el proyecto Supabase de produccion.
2. Ejecutar las migraciones del directorio `supabase/migrations`.
3. Confirmar que existe la tabla `quiz_participants`.
4. Confirmar que existe la tabla `campaign_benefits`.
5. Confirmar que `quiz_participants` permite insercion desde `anon`.

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

### 4. Ejecutar la sincronizacion inicial de beneficios

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

- El formulario inserta en `quiz_participants`
- La recomendacion lee beneficios desde `campaign_benefits`
- La sincronizacion actualiza beneficios activos

### SEO

- `sitemap.xml` responde con el dominio real
- `robots.txt` responde con el dominio real
- Open Graph usa el dominio correcto

## Checklist de Entrega

- Variables de entorno cargadas
- Migraciones aplicadas
- Sync inicial de beneficios ejecutada
- Dominio final configurado en `NEXT_PUBLIC_SITE_URL`
- `npm run lint` exitoso
- `npm run build` exitoso
- Preview validado funcionalmente
- Formulario validado contra Supabase real
- Resultado validado con beneficios reales
- SEO validado

## Riesgos Reales a Vigilar

- `NEXT_PUBLIC_SITE_URL` mal configurado
- Clave publica de Supabase equivocada
- `SUPABASE_SERVICE_ROLE_KEY` ausente
- `BENEFITS_SYNC_SECRET` ausente
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
