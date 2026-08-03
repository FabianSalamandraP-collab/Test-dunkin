# Arquitectura del Proyecto

## Descripción General

Este proyecto es una aplicación web moderna desarrollada con Next.js 15 (App Router) para la campaña "Dime qué tomas y te diré quién eres" de Dunkin' Colombia.

## Stack Tecnológico

| Tecnología               | Versión       | Propósito                                      |
|--------------------------|---------------|------------------------------------------------|
| Next.js                  | 15.x          | Framework React para producción                |
| React                    | 19.x          | Librería de UI                                 |
| TypeScript               | 5.x           | Tipado estático                                |
| TailwindCSS              | 3.4.x         | Framework CSS utility-first                    |
| Framer Motion            | 12.x          | Animaciones                                    |
| React Hook Form          | 7.x           | Manejo de formularios                          |
| Zustand                  | 5.x           | Estado global                                  |
| Supabase                 | 2.x           | Backend como servicio (BD + Auth)              |
| Lucide React             | 0.x           | Íconos                                         |

## Estructura de Directorios

```
TEST DUNKIN/
├── app/                          # Next.js App Router
│   ├── globals.css               # Estilos globales (Tailwind)
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página de inicio
│   ├── robots.ts                 # Generador de robots.txt
│   └── sitemap.ts                # Generador de sitemap.xml
├── animations/                   # Presets y configuraciones de animaciones
├── components/                   # Componentes UI reutilizables
├── features/                     # Módulos organizados por funcionalidad (Feature-Sliced Design)
├── hooks/                        # Hooks personalizados de React
├── lib/                          # Configuración de bibliotecas y utilidades compartidas
├── public/                       # Archivos estáticos (imágenes, fuentes, etc.)
├── services/                     # Integración con APIs y servicios externos
├── store/                        # Estado global (Zustand)
├── styles/                       # Estilos adicionales (CSS modules, etc.)
├── supabase/                     # Migraciones y configuración de Supabase
├── types/                        # Tipos TypeScript compartidos
├── utils/                        # Funciones auxiliares y helpers
├── .env.example                  # Ejemplo de variables de entorno
├── .eslintrc.json                # Configuración ESLint
├── .gitignore                    # Archivos a ignorar por Git
├── .prettierrc                   # Configuración Prettier
├── LICENSE                       # Licencia del proyecto
├── next.config.ts                # Configuración Next.js
├── package.json                  # Dependencies y scripts
├── postcss.config.mjs            # Configuración PostCSS
├── README.md                     # Documentación principal
├── SECURITY.md                   # Políticas de seguridad
├── tailwind.config.ts            # Configuración TailwindCSS
└── tsconfig.json                 # Configuración TypeScript
```

## Principios Arquitectónicos

### 1. Feature-Sliced Design (Organización por funcionalidades)

Las funcionalidades principales se organizan dentro de la carpeta `features/`, donde cada subcarpeta representa una característica completa de la aplicación y contiene su propia estructura:

```
features/
├── quiz/                         # Módulo del cuestionario
│   ├── components/               # Componentes específicos del quiz
│   ├── hooks/                    # Hooks específicos del quiz
│   ├── types/                    # Tipos específicos del quiz
│   ├── utils/                    # Utils específicos del quiz
│   └── index.ts                  # Exportaciones públicas del módulo
└── results/                      # Módulo de resultados
    └── ... (misma estructura)
```

### 2. Separación de Responsabilidades

- **Componentes**: Solo UI y lógica de presentación
- **Hooks**: Lógica de estado reutilizable
- **Services**: Lógica de integración con APIs
- **Lib**: Configuración de bibliotecas externas
- **Utils**: Funciones puras y helpers
- **Store**: Estado global de la aplicación

### 3. Import Aliases

Para importaciones más limpias, se usa el alias `@/` que apunta a la raíz del proyecto:

```typescript
// Mal
import Button from '../../components/ui/Button';
import useAuth from '../../hooks/useAuth';

// Bueno
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
```

## SEO y Accesibilidad

- **Metaetiquetas dinámicas**: Usando `generateMetadata` de Next.js
- **Sitemap XML**: Generado automáticamente en `app/sitemap.ts`
- **Robots.txt**: Generado automáticamente en `app/robots.ts`
- **Open Graph y Twitter Cards**: Para previsualizaciones en redes sociales
- **Idioma**: Español (Colombia) - `es-CO`

## Despliegue

La aplicación es compatible con cualquier hosting que soporte Next.js:

1. **Vercel**: Despliegue automático al push a la rama principal
2. **Netlify**: Similar a Vercel
3. **Hosting propio**: Con Node.js y `npm run build && npm start`

## Próximos Pasos

- [ ] Implementar las pantallas del flujo completo
- [ ] Configurar Supabase con tablas reales
- [ ] Agregar pruebas unitarias y de integración
- [ ] Configurar CI/CD (GitHub Actions, etc.)
