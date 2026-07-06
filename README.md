# Campaña Dunkin Colombia - Dime qué tomas y te diré quién eres

Aplicación profesional de Next.js para la campaña oficial de Dunkin Colombia.

## Tecnologías

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- React Hook Form
- Zustand
- Supabase / PostgreSQL
- Lucide React

## Estructura del Proyecto

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

La aplicación está lista para ser desplegada en cualquier hosting compatible con Next.js (Vercel, Netlify, hosting propio, etc.).

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las variables necesarias (ej: credenciales de Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Vercel (Recomendado)

1. Conecta tu repositorio GitHub a Vercel
2. Configura las variables de entorno en Vercel
3. ¡Despliega automáticamente!

## Licencia

Propiedad de Dunkin Colombia.
