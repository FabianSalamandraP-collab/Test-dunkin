# Campaña Dunkin' Colombia - Dime qué tomas y te diré quién eres

Aplicación profesional de Next.js para la campaña oficial de Dunkin' Colombia.
Proyecto listo para handoff técnico al equipo que publique la campaña en el
dominio o subdominio final.

## 📌 Documentación rápida para entrega

Antes de tocar nada, abre estos 3 archivos en orden:

1. [ENTREGA_TEST.md](ENTREGA_TEST.md) — checklist corto y operativo de handoff
2. [GUIA_DEPLOY_DOMINIO.md](GUIA_DEPLOY_DOMINIO.md) — cómo publicar, modo
   prueba, modo real y conexión de dominio/subdominio
3. [GUIA_DASHBOARD_RESULTADOS.md](GUIA_DASHBOARD_RESULTADOS.md) — cómo habilitar
   e ingresar al dashboard administrativo con los resultados del quiz

Documentación técnica complementaria:

- [DEPLOY.md](DEPLOY.md) — guía completa de despliegue
- [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md) — arquitectura del backoffice
- [SUPABASE_QUIZ_DATABASE.md](SUPABASE_QUIZ_DATABASE.md) — esquema SQL y
  tracking del quiz
- [QUIZ_TRACKING_API.md](QUIZ_TRACKING_API.md) — APIs de tracking y smoke test
- [SECURITY.md](SECURITY.md) — políticas de seguridad

## 🛡️ Seguridad y Legal

- **Licencia**: Propiedad exclusiva de Dunkin' Colombia (ver [LICENSE](LICENSE))
- **Seguridad**: Leer [SECURITY.md](SECURITY.md) para conocer las políticas de seguridad
- **Código de Conducta**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Cómo Contribuir**: [CONTRIBUTING.md](CONTRIBUTING.md) (solo personal autorizado)

## 🚀 Tecnologías

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- React Hook Form
- Zustand
- Supabase / PostgreSQL
- Lucide React

## 📁 Estructura del Proyecto

- `app/`: Rutas y layouts de Next.js
- `components/`: Componentes UI reutilizables
- `features/`: Módulos organizados por funcionalidad
- `hooks/`: Hooks personalizados
- `lib/`: Configuración de bibliotecas
- `services/`: Integración con APIs
- `store/`: Estado global (Zustand)
- `types/`: Tipos TypeScript
- `styles/`: Estilos adicionales
- `animations/`: Presets de Framer Motion
- `utils/`: Funciones auxiliares
- `supabase/`: Migraciones de base de datos
- `public/`: Archivos estáticos (todos los assets de la campaña ya incluidos)

## ✅ Assets incluidos en el repositorio

Todas las imágenes y piezas visuales del test ya están subidas dentro de
`public/assets/` y versionadas en Git. No hace falta subir nada adicional para
publicar la campaña.

Incluye, entre otros:

- Fondos de intro y resultado (`quiz-intro`, `quiz-results`)
- Headline de la campaña
- Logos y sello de Dunkin' + YES ALL DAY
- Bebidas visuales del carrusel intro
- Lifestyle, personalidades y sellos del resultado
- Iconografía de beneficios

Inventario rápido:

- `public/assets/quiz-intro/`
- `public/assets/quiz-questions/`
- `public/assets/quiz-results/`
- `public/assets/quiz-benefits/`
- `public/assets/QUIZ_ASSETS.md`

## 🔍 Confirmación rápida antes de publicar

- Modo **prueba** activado por defecto si no se define lo contrario:
  - `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview`
  - Esto es útil para entornos nuevos; NO guarda registros en base de datos.
- Para **producción real**:
  - `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live`
  - Más detalles en [GUIA_DEPLOY_DOMINIO.md](GUIA_DEPLOY_DOMINIO.md)

## Instalación

1. Copia el archivo de ejemplo de variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

2. Llena las variables de entorno en el archivo `.env.local` (guía completa en
   [GUIA_DEPLOY_DOMINIO.md](GUIA_DEPLOY_DOMINIO.md))

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución en Desarrollo

```bash
npm run dev
```

## Build para Producción

```bash
npm run build
npm start
```

## SEO

- Metaetiquetas optimizadas (Open Graph, Twitter Cards)
- Sitemap XML
- Robots.txt
- Idioma: Español (Colombia) - `es-CO`

## Despliegue

La aplicación está preparada para desplegarse en **cualquier hosting
compatible con Next.js**. No depende de un proveedor concreto.

Opciones habituales (ninguna obligatoria):

- Vercel
- Netlify
- Cloudflare Pages
- AWS (Amplify, ECS, EC2...)
- Cualquier hosting Node.js 20+ con build de Next.js

El flujo recomendado y documentado para handoff técnico está en:

- [DEPLOY.md](DEPLOY.md) — guía completa de despliegue
- [GUIA_DEPLOY_DOMINIO.md](GUIA_DEPLOY_DOMINIO.md) — modo prueba, modo real y
  conexión de dominio o subdominio
- [ENTREGA_TEST.md](ENTREGA_TEST.md) — checklist corto de entrega

### Variables de Entorno

Ver [.env.example](.env.example) para la lista completa de variables
necesarias. Nunca subas `.env.local` al repositorio.

## Rutas útiles después del deploy

| Ruta            | Función                                                        |
|-----------------|----------------------------------------------------------------|
| `/`             | Redirige a `/quiz`                                             |
| `/quiz`         | Flujo público completo del test (intro → preguntas → resultado)|
| `/admin/login`  | Pantalla de ingreso al backoffice                              |
| `/admin`        | Dashboard de resultados (requiere cuenta autorizada)          |
| `/robots.txt`   | SEO base                                                       |
| `/sitemap.xml`  | Sitemap del dominio publicado                                  |
| `/og-image`     | Imagen OG dinámica de la campaña                               |

## Importante

- Nunca subas credenciales al repositorio
- Usa siempre variables de entorno para información sensible
- El modo `preview` evita escrituras accidentales en entornos nuevos
- El proyecto puede publicarse sin Supabase para validar UI; solo pasa a
  `live` cuando la base de datos esté confirmada
- La arquitectura SQL y de tracking del quiz está documentada en
  `SUPABASE_QUIZ_DATABASE.md`
- La API de tracking y su smoke test local están documentados en
  `QUIZ_TRACKING_API.md`
- La migración preparada para analytics y eventos del quiz es
  `20260724123000_prepare_quiz_tracking_schema.sql`
- La migración válida de `quiz_participants` es
  `20250101000000_create_quiz_participants_table.sql`
- Cumplimiento con la Ley de Protección de Datos Personales de Colombia
  (Ley 1581 de 2012)

## Licencia

Propiedad exclusiva de Dunkin' Colombia. Todos los derechos reservados.
