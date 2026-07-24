# API de Tracking del Quiz

## Objetivo

Dejar una capa mínima de endpoints lista para pruebas locales y para handoff al
equipo de despliegue.

## Dependencias

Estas rutas requieren:

- migración `supabase/migrations/20260724123000_prepare_quiz_tracking_schema.sql`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Manejo de credenciales

- `SUPABASE_SERVICE_ROLE_KEY` no se guarda en la repo
- el frontend nunca consume esa key directamente
- las rutas `app/api/quiz/**` leen esa variable solo en backend
- el equipo de despliegue es quien debe cargarla en Vercel/Supabase o en su
  `.env.local` privado
- la repo solo debe contener `.env.example` y documentación

## Endpoints incluidos

### `POST /api/quiz/session/start`

Inicia una sesión de quiz y registra el evento `test_started`.

Body ejemplo:

```json
{
  "deviceType": "desktop",
  "browserName": "chrome",
  "osName": "windows",
  "language": "es-CO",
  "screenWidth": 1440,
  "screenHeight": 900,
  "referrer": "http://localhost:3000/",
  "utmSource": "meta",
  "utmMedium": "paid",
  "utmCampaign": "quiz-julio"
}
```

### `POST /api/quiz/session/answer`

Guarda o actualiza una respuesta y registra `question_answered`.

Body ejemplo:

```json
{
  "sessionId": "uuid",
  "questionKey": "q1",
  "questionOrder": 1,
  "selectedOptionKey": "q1a1",
  "selectedOptionLabel": "En cinco minutos mandas opciones, ubicación y hasta horario.",
  "selectedValue": "creative",
  "deviceType": "desktop",
  "browserName": "chrome"
}
```

### `POST /api/quiz/session/complete`

Marca la sesión como completada y registra `test_completed`.

Body ejemplo:

```json
{
  "sessionId": "uuid",
  "personalityKey": "creative",
  "personalityLabel": "Curioso Aventurero",
  "recommendedDrinkKey": "iced-latte",
  "recommendedDrinkLabel": "Iced Latte",
  "score": 4,
  "totalDurationSeconds": 51,
  "deviceType": "desktop",
  "browserName": "chrome"
}
```

### `POST /api/quiz/session/abandon`

Marca abandono y registra `test_abandoned`.

Body ejemplo:

```json
{
  "sessionId": "uuid",
  "questionKey": "q3",
  "questionOrder": 3,
  "deviceType": "mobile",
  "browserName": "safari"
}
```

### `POST /api/quiz/form/submit`

Inserta participante legacy, lo vincula a la sesión y registra
`form_submitted`.

Body ejemplo:

```json
{
  "sessionId": "uuid",
  "fullName": "Nombre Apellido",
  "email": "correo@ejemplo.com",
  "phone": "+57 300 123 4567",
  "acceptDataProcessing": true,
  "acceptPromotions": false,
  "deviceType": "desktop",
  "browserName": "chrome"
}
```

### `POST /api/quiz/event/view-in-dunkin`

Registra el clic final en el CTA.

Body ejemplo:

```json
{
  "sessionId": "uuid",
  "targetUrl": "https://www.dunkincolombia.com/pedir",
  "deviceType": "desktop",
  "browserName": "chrome"
}
```

## Smoke test local

Con el servidor local corriendo:

```bash
npm run dev
```

En otra terminal:

```bash
npm run test:tracking:local
```

## Qué valida el smoke test

- inicio de sesión
- registro de 4 respuestas
- finalización del resultado
- envío de formulario
- clic final en `Ver en Dunkin'`

## Observaciones de handoff

- la app actual ya consume estas rutas desde la experiencia real del quiz
- si `SUPABASE_SERVICE_ROLE_KEY` no existe, el tracking no persiste y el flujo
  de UI no se rompe
- la escritura usa `service_role` desde backend
- el formulario legacy actual no se rompe con esta capa nueva
