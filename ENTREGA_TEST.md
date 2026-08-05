# Entrega Del Test

## Objetivo

Esta guia resume que revisar antes de subir el test al dominio final y evita
problemas de despliegue, SEO o base de datos.

> Documento complementario:
> - Ver [DEPLOY.md](DEPLOY.md) para la guia completa de handoff y despliegue.
> - Ver [CHECKLIST_CIERRE_FINAL.md](CHECKLIST_CIERRE_FINAL.md) para la lista de
>   control final antes de entregar.

## Que ya queda listo en el proyecto

- SEO base desacoplado del dominio fijo usando `NEXT_PUBLIC_SITE_URL`
- `robots.txt` y `sitemap.xml` generados con la URL real
- Redireccion permanente de `/` hacia `/quiz`
- `og-image` dinamica para compartir la campaña sin depender de un archivo manual
- Build de produccion y lint validados localmente
- Migracion duplicada de `quiz_participants` eliminada para evitar conflictos
  en Supabase

## Variables de entorno obligatorias

Crear `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://tu-dominio-final.com
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview
GOOGLE_SITE_VERIFICATION=
BENEFITS_SYNC_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

Para un deploy de prueba que no toque base de datos:

- Mantener `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview`
- No cargar `SUPABASE_SERVICE_ROLE_KEY`
- No cargar `BENEFITS_SYNC_SECRET`
- Si solo quieren validar UX y flujo, pueden dejar vacías las variables públicas de Supabase

## Base de datos

Como la base de datos la manejarán ustedes, antes de publicar deben:

1. Crear el proyecto de Supabase productivo.
2. Ejecutar `20250101000000_create_quiz_participants_table.sql`.
3. Ejecutar la migracion de `campaign_benefits`.
4. Ejecutar `20260724123000_prepare_quiz_tracking_schema.sql`.
5. Confirmar que existan `quiz_sessions`, `quiz_answers` y `quiz_events`.
6. Confirmar que `quiz_participants` permita `INSERT` para `anon` si van a usar
   el flujo legacy desde cliente.
7. Validar que la clave pública cargada en Vercel o en el hosting sea la correcta.
8. Cargar `SUPABASE_SERVICE_ROLE_KEY` para sincronizar beneficios y guardar el
   tracking desde el servidor.

## Assets incluidos y versión entregada

Todos los assets del test ya están dentro del repositorio en `public/assets/` y
commitados en Git. No se requiere subir imágenes manualmente.

Inventario visual incluido:

- `public/assets/quiz-intro/backgrounds/` (fondos mobile y desktop)
- `public/assets/quiz-intro/borders/` (piezas laterales si se desean volver a usar)
- `public/assets/quiz-intro/drinks/` (imágenes del carrusel de bebidas)
- `public/assets/quiz-intro/headlines/` (headline editorial de la intro)
- `public/assets/quiz-intro/logo/` (Dunkin' y YES ALL DAY)
- `public/assets/quiz-questions/backgrounds/` (fondos para preguntas)
- `public/assets/quiz-results/backgrounds/` (fondo del resultado)
- `public/assets/quiz-results/lifestyle/` (imágenes por bebida)
- `public/assets/quiz-results/personalities/` (iconos de personalidad)
- `public/assets/quiz-results/stamps/` (sellos del resultado)
- `public/assets/quiz-benefits/gift-icon.svg`

Si algún hosting requiere validación rápida, el inventario detallado está en:
- `public/assets/QUIZ_ASSETS.md`

> Importante: la referencia a `gift-icon.png` de versiones anteriores ya fue
> reemplazada por `gift-icon.svg` en el código actual. No hace falta añadir PNG.

## Flujo de entrega recomendado

1. Congelar cambios de UI para no mover layout mientras preparan deploy.
2. Subir assets finales faltantes.
3. Configurar `.env.local` o variables del hosting.
4. Ejecutar:

```bash
npm install
npm run lint
npm run build
```

5. Ejecutar una sincronización inicial de beneficios:

```bash
curl -X POST "https://tu-preview.com/api/benefits/sync" \
  -H "Authorization: Bearer TU_BENEFITS_SYNC_SECRET"
```

6. Revisar en preview:
   - Home redirige a `/quiz`
   - Intro carga fondo, carrusel y bordes
   - Preguntas muestran visuales finales
   - Resultado muestra bebida y beneficio dinamico con link oficial
   - Tracking crea sesión, respuestas, finalización y clic final
   - Formulario guarda en Supabase
- Consentimientos y política de datos funcionan correctamente
   - Footer abre redes correctas
   - Compartir muestra preview con imagen

7. Cuando el preview esté aprobado, conectar dominio final.
8. Confirmar que `NEXT_PUBLIC_SITE_URL` coincida exactamente con el dominio publicado.
9. Enviar URL final para validación funcional y visual.

## Checklist final de handoff

- Dominio final definido
- Variables de entorno cargadas
- Migracion de base de datos aplicada
- Migracion de tracking aplicada
- `quiz_participants` creado desde `20250101000000_create_quiz_participants_table.sql`
- `quiz_sessions`, `quiz_answers` y `quiz_events` creados
- Sincronizacion inicial de beneficios ejecutada
- Assets finales subidos
- Build exitoso
- Preview aprobado
- SEO validado
- Enlaces de redes validados
- Formulario validado contra base de datos real

## Riesgos que debes vigilar

- Dominio mal configurado en variables
- Clave publica de Supabase equivocada
- Assets faltantes en preguntas o resultados
- Diferencias entre entorno preview y produccion
- Falta de revision del flujo completo con base de datos real
