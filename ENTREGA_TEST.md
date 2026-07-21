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
GOOGLE_SITE_VERIFICATION=
BENEFITS_SYNC_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

## Base de datos

Como la base de datos la manejaran ustedes, antes de publicar deben:

1. Crear el proyecto de Supabase productivo.
2. Ejecutar `20250101000000_create_quiz_participants_table.sql`.
3. Ejecutar la migracion de `campaign_benefits`.
4. Confirmar que `quiz_participants` permita `INSERT` para `anon`.
5. Validar que la clave publica cargada en Vercel o en el hosting sea la correcta.
6. Cargar `SUPABASE_SERVICE_ROLE_KEY` para sincronizar beneficios desde el servidor.

## Assets obligatorios antes de publicar

Todavia faltan assets finales del quiz. Antes de entrega revisar:

1. `public/assets/quiz-questions/`
2. `public/assets/quiz-results/`
3. `public/assets/quiz-benefits/gift-icon.png`

Si esos archivos no existen, el sitio no se rompe, pero mostrara fallbacks visuales en preguntas y resultados.

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

5. Ejecutar una sincronizacion inicial de beneficios:

```bash
curl -X POST "https://tu-preview.com/api/benefits/sync" \
  -H "Authorization: Bearer TU_BENEFITS_SYNC_SECRET"
```

6. Revisar en preview:
   - Home redirige a `/quiz`
   - Intro carga fondo, carrusel y bordes
   - Preguntas muestran visuales finales
   - Resultado muestra bebida y beneficio dinamico con link oficial
   - Formulario guarda en Supabase
   - Consentimientos y politica de datos funcionan correctamente
   - Footer abre redes correctas
   - Compartir muestra preview con imagen

7. Cuando el preview este aprobado, conectar dominio final.
8. Confirmar que `NEXT_PUBLIC_SITE_URL` coincida exactamente con el dominio publicado.
9. Enviar URL final para validacion funcional y visual.

## Checklist final de handoff

- Dominio final definido
- Variables de entorno cargadas
- Migracion de base de datos aplicada
- `quiz_participants` creado desde `20250101000000_create_quiz_participants_table.sql`
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
