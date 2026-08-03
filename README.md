# Campaña Dunkin' Colombia - Dime qué tomas y te diré quién eres

Aplicación profesional de Next.js para la campaña oficial de Dunkin' Colombia.

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
- `public/`: Archivos estáticos

## Instalación

1. Copia el archivo de ejemplo de variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

2. Llena las variables de entorno en el archivo `.env.local`

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

La aplicación está preparada para desplegarse en cualquier hosting compatible
con Next.js. El flujo recomendado y documentado para handoff técnico está en:

- [DEPLOY.md](DEPLOY.md) para la guía completa de despliegue
- [ENTREGA_TEST.md](ENTREGA_TEST.md) para el checklist corto de entrega

### Variables de Entorno

Ver [.env.example](.env.example) para la lista completa de variables
necesarias. Nunca subas `.env.local` al repositorio.

### Vercel (Recomendado)

1. Conecta tu repositorio GitHub a Vercel
2. Configura las variables de entorno en Vercel
3. Ejecuta las migraciones de Supabase
4. Ejecuta la sincronizacion inicial de beneficios
5. Despliega y valida preview antes de publicar el dominio final

## Importante

- Nunca subas credenciales al repositorio
- Usa siempre variables de entorno para información sensible
- El proyecto depende de Supabase real para formulario y beneficios
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
