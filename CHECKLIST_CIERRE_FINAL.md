# Checklist de Cierre Final

## Objetivo

Este documento sirve como lista de control final antes de entregar el proyecto
al equipo que hara el despliegue. Se usa al final del trabajo, incluso si antes
se hicieron mas cambios locales, ajustes de UI o deploys de prueba.

## 1. Cierre de Producto

- Confirmar que ya no quedan cambios visuales pendientes en intro, preguntas,
  resultado, formulario y consentimientos.
- Confirmar que los textos finales estan aprobados.
- Confirmar que logos, fondos, carruseles y assets finales son los correctos.
- Confirmar que no hay placeholders, imagenes temporales ni versiones viejas de
  assets en uso.

## 2. Validacion Tecnica

Ejecutar:

```bash
npm install
npm run lint
npm run build
```

Validar:

- El proyecto compila sin errores.
- No hay errores de lint bloqueantes.
- La navegacion principal funciona correctamente.
- La landing redirige a `/quiz`.
- El flujo completo del quiz termina sin romperse.

## 3. Base de Datos y Supabase

- Confirmar que existen estas migraciones en el repo:
  - `supabase/migrations/20250101000000_create_quiz_participants_table.sql`
  - `supabase/migrations/20260710090000_create_campaign_benefits_table.sql`
- Confirmar que ambas migraciones estan versionadas en Git.
- Confirmar que el proyecto Supabase de destino esta creado.
- Confirmar que `quiz_participants` permite `INSERT` para `anon`.
- Confirmar que `campaign_benefits` existe y puede poblarse desde el servidor.

## 4. Variables de Entorno

Confirmar que el equipo que desplegara tiene estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
GOOGLE_SITE_VERIFICATION=
BENEFITS_SYNC_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

Validar:

- `NEXT_PUBLIC_SITE_URL` apunta al dominio final correcto.
- La URL de Supabase corresponde al proyecto correcto.
- La publishable key corresponde al mismo proyecto.
- `SUPABASE_SERVICE_ROLE_KEY` existe en el hosting.
- `BENEFITS_SYNC_SECRET` existe en el hosting.

## 5. Pruebas Funcionales Reales

Revisar en preview o entorno candidato:

- Intro carga correctamente.
- Preguntas muestran imagenes y opciones finales.
- Resultado muestra personalidad, bebida y beneficio.
- Formulario guarda en Supabase.
- Consentimiento obligatorio funciona correctamente.
- Consentimiento opcional de promociones funciona por separado.
- Enlace de politica de tratamiento de datos abre correctamente.
- Compartir y copiar enlace funcionan.
- Footer y redes abren enlaces correctos.

## 6. Sync Inicial de Beneficios

Ejecutar despues del deploy:

```bash
curl -X POST "https://tu-preview-o-dominio.com/api/benefits/sync" \
  -H "Authorization: Bearer TU_BENEFITS_SYNC_SECRET"
```

Validar:

- La ruta responde correctamente.
- Los beneficios quedan disponibles en la app.
- El resultado ya no depende solo de fallback.

## 7. Limpieza Antes de Entregar

Confirmar que no se entrega:

- `.env.local`
- `.next/`
- `.next-dev/`
- `.vercel/`
- `node_modules/`
- logs locales
- archivos temporales
- backups o dumps

Confirmar tambien:

- No hay secretos hardcodeados.
- No hay rutas locales personales en documentacion o codigo.
- No hay archivos de prueba que no deban vivir en el repo.

## 8. Git y Versionado

Antes de entregar:

- Hacer `git status`.
- Confirmar que los archivos importantes si estan incluidos.
- Confirmar que docs y migraciones nuevas no quedaron fuera del commit.
- Confirmar que el commit final describe correctamente la entrega.
- Hacer push del estado final que se va a entregar.

## 9. Documentacion Minima Que Debe Viajar

- `README.md`
- `DEPLOY.md`
- `ENTREGA_TEST.md`
- `CHECKLIST_CIERRE_FINAL.md`
- `CHANGELOG.md`
- `supabase/migrations/`

## 10. Ultimo OK de Entrega

El proyecto queda listo para handoff cuando se cumple todo esto:

- Build validado
- Deploy de prueba validado
- Base de datos validada
- Variables confirmadas
- Sync inicial documentada
- Documentacion completa
- Repo limpio para entrega

## Nota Operativa

Mientras sigas trabajando en local, pueden volver a aparecer artefactos como
`.next`, `.next-dev`, logs o caches. Eso es normal. Este checklist se usa al
final, justo antes de entregar o de hacer el commit/push definitivo para
handoff.
