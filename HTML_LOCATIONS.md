# Dónde está el "HTML" del proyecto - Guía para Equipos

## Objetivo

Este proyecto está hecho con **Next.js 15 (App Router)**. Por eso **no hay
archivos `.html` manuales** como en un sitio web estático tradicional. En vez de
eso, el HTML final del navegador se genera desde:

1. **Rutas** (`app/**/page.tsx`, `app/**/layout.tsx`)
2. **Componentes React/TSX** (`features/**`, `components/**`)
3. **Templates** dinámicos como Open Graph (`app/og-image.tsx`)

Este documento explica, por pantalla, **dónde tocar** para cambiar el HTML
visible, de forma que el equipo lo encuentre sin tener que revisar todo el
código.

---

## Regla rápida: buscar HTML por ruta URL

En App Router de Next.js, **cada carpeta dentro de `app/` es una ruta**, y el
archivo `page.tsx` es el punto de entrada del HTML de esa página.

Ejemplos de este proyecto:

| URL final          | Archivo principal que genera el HTML        |
|--------------------|----------------------------------------------|
| `/`                | `app/page.tsx` (redirige a `/quiz`)          |
| `/quiz`            | `app/quiz/page.tsx`                          |
| `/admin`           | `app/admin/(dashboard)/page.tsx`             |
| `/admin/analytics` | `app/admin/(dashboard)/analytics/page.tsx`   |
| `/admin/login`     | `app/admin/login/page.tsx`                   |

Y, además, estos archivos especiales generan HTML/XML o contenido navegable:

| Salida navegable          | Archivo que la genera                         |
|---------------------------|-----------------------------------------------|
| `robots.txt`              | `app/robots.ts` (si existe) o metadata API    |
| `sitemap.xml`             | `app/sitemap.ts` o metadata API               |
| Imagen OG `/og-image`     | `app/og-image.tsx`                            |
| Layout raíz de toda la app| `app/layout.tsx`                              |

---

## 1. Ruta `/` — HTML de la raíz

- **Punto de entrada del HTML**: [app/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/page.tsx)
- **Qué hace**: normalmente redirige de forma permanente (`308`) a `/quiz`.
- **Qué editar si quieres cambiar la landing raíz**:
  - `app/page.tsx`
- **Qué editar para cambiar el layout que envuelve esta ruta**:
  - Layout global: [app/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/layout.tsx)

---

## 2. Ruta `/quiz` — HTML de la pantalla pública del test

Esta es la pantalla principal del usuario final (intro → preguntas →
resultado). Todo el HTML visible del quiz pasa por aquí.

- **Punto de entrada del HTML**: [app/quiz/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/quiz/page.tsx)
- **Layouts que envuelven este HTML**:
  - Layout raíz: [app/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/layout.tsx)
  - (Opcionalmente) un layout específico de `/quiz` si existiera
    `app/quiz/layout.tsx`; si no existe, usa el global.

Dentro de `/quiz`, el HTML visible se divide en 3 pantallas. Cada una tiene un
componente TSX que funciona como el "HTML de esa pantalla".

### 2.1 HTML de la intro del quiz

- **Archivo principal**: [features/quiz/IntroScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/IntroScreen.tsx)
- **Qué contiene**:
  - Logos superiores
  - Headline
  - Carrusel de bebidas
  - CTA principal `Descubre tu match`
  - Secciones "Cómo funciona"
  - Pie de página con redes sociales
  - Estilos específicos de mobile y desktop
- **Si quieres cambiar el HTML de esta pantalla**, abre ese archivo y busca
  los bloques JSX/TSX con las clases o el texto visible.

### 2.2 HTML de las preguntas (4 pasos)

- **Archivo principal**: [features/quiz/QuestionScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/QuestionScreen.tsx)
- **Qué contiene**:
  - Barra de progreso
  - Enunciado de la pregunta actual
  - Opciones A/B/C/D (orden barajado visualmente)
  - Navegación entre preguntas
- **Textos de las preguntas y respuestas** NO están en este archivo; vienen de
  las constantes:
  - [constants/quizQuestions.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/constants/quizQuestions.ts)

### 2.3 HTML del resultado final

- **Archivo principal**: [features/quiz/ResultScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/ResultScreen.tsx)
- **Qué contiene**:
  - Personalidad
  - Bebida recomendada
  - Imágenes de lifestyle
  - Sellos y copy de recomendación
  - CTA `Ver en Dunkin'`
  - CTA `Repetir test`
  - CTA `Compartir`
  - Formulario opcional si aplica
- **Textos de personalidad y bebidas** también se alimentan de:
  - [constants/quizQuestions.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/constants/quizQuestions.ts)

---

## 3. HTML de autenticación y dashboard administrativo

### 3.1 `/admin/login`

- **Punto de entrada del HTML**: [app/admin/login/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/login/page.tsx)
- **Componente visual que pinta el formulario real**:
  - [features/admin/components/AdminLoginForm.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/admin/components/AdminLoginForm.tsx)
- **Layout admin envolvente**:
  - [app/admin/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/layout.tsx)

### 3.2 `/admin` — dashboard principal

- **Punto de entrada del HTML**: [app/admin/(dashboard)/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/(dashboard)/page.tsx)
- **Layout del dashboard** (menú, navegación interna):
  - [app/admin/(dashboard)/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/(dashboard)/layout.tsx)
- **Vista visual de KPIs, gráficas y tabla**:
  - `features/admin/components/AdminDashboardView.tsx`

### 3.3 `/admin/analytics` — vista analítica

- **Punto de entrada del HTML**: [app/admin/(dashboard)/analytics/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/(dashboard)/analytics/page.tsx)
- **Componente visual**: mismo dataset, modo analytics:
  - `features/admin/components/AdminDashboardView.tsx` (modo `analytics`)

---

## 4. HTML/imagen especial de Open Graph (`/og-image`)

Este proyecto genera **la imagen OG** (la miniatura de compartir en redes)
mediante un template TSX especial de Next, **no mediante un archivo PNG
manual**.

- **Template HTML/imagen OG**: [app/og-image.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/og-image.tsx)
- **Dónde se ve esta salida**:
  - `https://tu-dominio.com/og-image`
- **Qué tocar si quieres cambiar el diseño del compartir**:
  - Edita directamente los bloques dentro de `OgImage()` en ese archivo.
- **Importante**: el texto del OG no debe quedar con acentos crudos sin
  revisar; se recomienda usar escapes Unicode cuando se cambia copy en ese
  archivo para evitar fallos de build en entornos con codificaciones
  diferentes.

---

## 5. SEO y metadata (HTML head de cada página)

En Next.js App Router, **no hay un único `index.html` con `<head>` fijo**. El
`<title>`, `<meta description>`, canonical, Open Graph y demás se generan
por ruta desde estos 3 sitios:

1. **Layout global** (`<html>`, `<body>`, metadata compartido):
   - [app/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/layout.tsx)
2. **Cada ruta específica** (`export const metadata = ...` o `generateMetadata`
   dentro del `page.tsx` correspondiente).
3. **Sitemap y robots** (si existen archivos `app/sitemap.ts` y
   `app/robots.ts`).

Si quieres cambiar:

- **Title / description general del sitio** → empieza por `app/layout.tsx`
- **Title / description de `/quiz`** → empieza por `app/quiz/page.tsx`
- **Title / description de `/admin/login`** → empieza por
  `app/admin/login/page.tsx`
- **Sitemap** → buscar `app/sitemap.ts` o referencia al generador sitemap
- **Robots.txt** → buscar `app/robots.ts` o metadata `robots`

---

## 6. Estilos que "forman el HTML visual" (CSS global)

Aunque no es HTML puro, gran parte del aspecto visual del DOM sale de:

- **CSS global**: [app/globals.css](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/globals.css)
- **Tailwind + clases utilitarias** en cada componente TSX
- **Componentes UI base** en `components/ui/` (botones, inputs, navbar, etc.)

Si cambias una clase y no ves reflejo, siempre revisa:

1. El TSX del componente real que pinta esa zona
2. `app/globals.css`
3. Layouts (`layout.tsx`) que lo envuelven

---

## 7. Resumen práctico por trabajo común

### 7.1 "Quiero cambiar el HTML de la intro del quiz"

Abre:
- [app/quiz/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/quiz/page.tsx)
- [features/quiz/IntroScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/IntroScreen.tsx)

### 7.2 "Quiero cambiar el HTML de las preguntas"

Abre:
- [features/quiz/QuestionScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/QuestionScreen.tsx)
- Textos y opciones: [constants/quizQuestions.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/constants/quizQuestions.ts)

### 7.3 "Quiero cambiar el HTML del resultado"

Abre:
- [features/quiz/ResultScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/ResultScreen.tsx)
- Nombres de personalidad / bebida:
  [constants/quizQuestions.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/constants/quizQuestions.ts)

### 7.4 "Quiero cambiar el HTML del login admin"

Abre:
- [app/admin/login/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/admin/login/page.tsx)
- [features/admin/components/AdminLoginForm.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/admin/components/AdminLoginForm.tsx)

### 7.5 "Quiero cambiar el HTML compartido en redes (miniatura)"

Abre:
- [app/og-image.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/og-image.tsx)
- Y revisa metadata en `app/layout.tsx` y en los `page.tsx` de cada ruta.

### 7.6 "Necesito cambiar `<head>` global"

Abre:
- [app/layout.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/layout.tsx)

---

## 8. Cómo validar que el HTML realmente coincide con lo que editaste

1. **En local**:
   ```bash
   npm install
   npm run dev
   ```
   Abre la URL que te dé Next.js y navega a la página que tocaste.

2. **Inspeccionar HTML generado** (para confirmar la ruta correcta):
   - En Chrome/Edge: `Ver código fuente de la página` o pestaña Network.
   - Si la ruta `/quiz` no te devuelve los cambios que esperas, seguramente
     estás editando el archivo equivocado. Vuelve al mapa de arriba y sigue
     el hilo: `app/quiz/page.tsx` → componente de feature.

3. **Antes de dar OK**:
   ```bash
   npm run build
   ```
   Si builda, Next.js no tiene conflictos de rutas ni errores en los componentes
   que generan el HTML final.

---

## 9. Qué NO confundir con el HTML

Estos archivos **no son HTML de la parte pública visible** del quiz:

- `app/api/**` → APIs internas JSON
- `features/admin/components/**` → backoffice, no el test público
- `supabase/migrations/**` → SQL, no HTML
- `lib/**` ni `store/**` ni `utils/**` → lógica y helpers, no HTML directo

---

## 10. Mapa ultra corto (copiar/pegar a quien pregunte por HTML)

- **HTML de `/quiz`** → `app/quiz/page.tsx`
- **Intro** → `features/quiz/IntroScreen.tsx`
- **Preguntas** → `features/quiz/QuestionScreen.tsx`
- **Resultado** → `features/quiz/ResultScreen.tsx`
- **Copy/preguntas/bebidas** → `constants/quizQuestions.ts`
- **OG image compartir** → `app/og-image.tsx`
- **`<head>` / metadata global** → `app/layout.tsx`
- **CSS global** → `app/globals.css`
- **Admin login** → `app/admin/login/page.tsx`
- **Admin dashboard** → `app/admin/(dashboard)/page.tsx`
