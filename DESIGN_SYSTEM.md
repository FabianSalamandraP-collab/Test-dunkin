# Dunkin Colombia Design System

> Inspirado en Dunkin Chile, Apple, Spotify Wrapped y Duolingo  
> Características clave: Mucho espacio en blanco, diseño minimalista, bordes redondeados, fotografías grandes, colores oficiales de Dunkin, sombras suaves y Mobile First.

---

## 📋 Tabla de Contenidos

1. [Principios de Diseño](#1-principios-de-diseño)
2. [Paleta de Colores](#2-paleta-de-colores)
3. [Tipografía](#3-tipografía)
4. [Espaciados](#4-espaciados)
5. [Border Radius](#5-border-radius)
6. [Elevaciones (Sombras)](#6-elevaciones-sombras)
7. [Tamaños](#7-tamaños)
8. [Grid](#8-grid)
9. [Breakpoints](#9-breakpoints)
10. [Tokens](#10-tokens)
11. [Uso en el Código](#11-uso-en-el-código)

---

## 1. Principios de Diseño

### 1.1 Minimalismo y Espacio en Blanco (Apple-style)
- **Mucho aire**: Los elementos tienen amplio respiro visual
- **Foco en el contenido**: Eliminar ruido visual innecesario
- **Simplicidad**: Menos es más

### 1.2 Bordes Redondeados (Duolingo)
- Bordes suaves y acogedores
- Refleja la personalidad amigable de Dunkin

### 1.3 Fotografías Grandes (Spotify Wrapped)
- Imágenes impactantes y de alta calidad
- Ocupan la mayor parte del espacio disponible

### 1.4 Colores Oficiales de Dunkin
- Fidelidad a la identidad de marca
- Uso moderado para no saturar

### 1.5 Sombras Suaves (Apple)
- Sombras sutiles y difusas
- No llaman la atención, pero dan profundidad

### 1.6 Mobile First
- Diseñar primero para móviles
- Escalar hacia arriba para dispositivos más grandes

---

## 2. Paleta de Colores

### 2.1 Naranja de Dunkin (Principal)
| Tono | Código HEX | Uso |
|------|------------|-----|
| 50 | #FFF7F0 | Background suave |
| 100 | #FFEBD8 | Background hover |
| 200 | #FFD3AD | Accent ligero |
| 300 | #FFB575 | Accent |
| 400 | #FF8F3A | Accent hover |
| 500 | #FF671F | **Color principal**, CTAs, enlaces |
| 600 | #F04A07 | Hover principal |
| 700 | #C73807 | Active principal |
| 800 | #9E2E0E | Texto sobre fondo claro |
| 900 | #80290F | Texto sobre fondo claro |
| 950 | #451106 | Texto sobre fondo claro |

```css
/* Ejemplo de uso en CSS Custom Property */
--color-primary-500: #FF671F;
```

```tsx
// Ejemplo de uso en Tailwind
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  ¡Ordena ahora!
</button>
```

### 2.2 Rojo de Dunkin (Secundario)
| Tono | Código HEX | Uso |
|------|------------|-----|
| 50 | #FFECEC | Background suave |
| 100 | #FFD9D9 | Background hover |
| 200 | #FFB8B8 | Accent ligero |
| 300 | #FF8888 | Accent |
| 400 | #FF5454 | Accent hover |
| 500 | #FF2D2D | **Color secundario**, énfasis |
| 600 | #F21414 | Hover secundario |
| 700 | #CC0D0D | Active secundario |
| 800 | #A50E0E | Texto sobre fondo claro |
| 900 | #881212 | Texto sobre fondo claro |
| 950 | #4B0404 | Texto sobre fondo claro |

### 2.3 Colores de Marca (Directos)
| Nombre | Código HEX | Uso |
|--------|------------|-----|
| Orange | #FF671F | Marca principal |
| Red | #FF2D2D | Marca secundaria |
| Brown | #8B4513 | Café / Accent |
| Cream | #FFF5E6 | Fondo cálido |
| White | #FFFFFF | Fondo principal |
| Black | #222222 | Texto principal |

### 2.4 Neutros
| Tono | Código HEX | Uso |
|------|------------|-----|
| 50 | #F8F8F8 | Fondo alternativo |
| 100 | #F0F0F0 | Líneas divisorias |
| 200 | #E6E6E6 | Bordes |
| 300 | #D4D4D4 | Bordes hover |
| 400 | #A3A3A3 | Texto secundario |
| 500 | #737373 | Texto terciario |
| 600 | #525252 | Texto |
| 700 | #3F3F3F | Texto principal |
| 800 | #262626 | Texto |
| 900 | #171717 | Texto fuerte |
| 950 | #0A0A0A | Texto máximo |

---

## 3. Tipografía

### 3.1 Familia de Fuentes
| Tipo | Variables | Fallback |
|------|-----------|----------|
| Sans | `--font-sans` | `system-ui, sans-serif` |
| Display | `--font-display` | `system-ui, sans-serif` |

**Recomendación**: Usar **Inter** para Sans y una fuente impactante (como Poppins ExtraBold) para Display.

### 3.2 Tamaños de Fuente
| Clase Tailwind | Tamaño (px) | Line Height | Uso |
|-----------------|--------------|-------------|-----|
| `text-xs` | 12 | 20 | Etiquetas pequeñas |
| `text-sm` | 14 | 24 | Texto secundario |
| `text-base` | 16 | 28 | Texto principal |
| `text-lg` | 18 | 28 | Texto destacado |
| `text-xl` | 20 | 32 | Subtítulos pequeños |
| `text-2xl` | 24 | 36 | Subtítulos |
| `text-3xl` | 30 | 40 | Títulos pequeños |
| `text-4xl` | 36 | 44 | Títulos |
| `text-5xl` | 48 | 56 | Títulos grandes (Mobile) |
| `text-6xl` | 60 | 68 | Títulos grandes (Desktop) |
| `text-7xl` | 72 | 80 | Display |
| `text-8xl` | 96 | 104 | Display Hero |
| `text-9xl` | 128 | 136 | Display Hero (XL) |

### 3.3 Textos Display (Personalizados)
Usa estas utilidades para títulos impactantes (Spotify Wrapped-style):
- `.text-display-xs`
- `.text-display-sm`
- `.text-display-md`
- `.text-display-lg`
- `.text-display-xl`

```tsx
<h1 className="text-display-sm md:text-display-lg text-dunkin-orange">
  Dime qué tomas<br />y te diré quién eres
</h1>
```

### 3.4 Line Height
| Propiedad | Valor | Uso |
|-----------|-------|-----|
| `tight` | 1.25 | Títulos grandes |
| `snug` | 1.375 | Títulos |
| `normal` | 1.5 | Texto principal |
| `relaxed` | 1.625 | Texto largo |
| `loose` | 2 | Texto muy largo |

### 3.5 Letter Spacing
| Propiedad | Valor | Uso |
|-----------|-------|-----|
| `tighter` | -0.05em | Display grandes |
| `tight` | -0.025em | Títulos |
| `normal` | 0 | Texto normal |
| `wide` | 0.025em | Etiquetas |
| `wider` | 0.05em | Etiquetas grandes |
| `widest` | 0.1em | All caps |

---

## 4. Espaciados

Sistema de espaciado de 4px (Mobile First, Apple-style)

| Clase Tailwind | Valor (px) | Uso común |
|-----------------|-------------|-----------|
| `space-0` | 0 | Sin espaciado |
| `space-px` | 1 | Borde |
| `space-0.5` | 2 | Ajuste fino |
| `space-1` | 4 | Muy pequeño |
| `space-2` | 8 | Pequeño |
| `space-3` | 12 | Mediano |
| `space-4` | 16 | Elementos cercanos |
| `space-5` | 20 | Normal |
| `space-6` | 24 | Espaciado de sección (Mobile) |
| `space-8` | 32 | Espaciado de sección |
| `space-10` | 40 | Espaciado amplio |
| `space-12` | 48 | Espaciado de sección (Desktop) |
| `space-16` | 64 | Muy amplio |
| `space-20` | 80 | Hero |
| `space-24` | 96 | Máximo |

```tsx
// Ejemplo de uso
<section className="py-12 md:py-20 container-padding">
  {/* Contenido */}
</section>
```

---

## 5. Border Radius

| Clase Tailwind | Valor (px) | Uso |
|-----------------|-------------|-----|
| `rounded-none` | 0 | Cuadrados perfectos |
| `rounded-sm` | 4 | Elementos pequeños |
| `rounded-md` | 8 | Botones, inputs |
| `rounded-lg` | 12 | Cards |
| `rounded-xl` | 16 | Contenedores |
| `rounded-2xl` | 24 | Imágenes grandes |
| `rounded-3xl` | 32 | Hero images |
| `rounded-full` | 9999 | Circulos, avatares |

```tsx
// Ejemplo de imagen grande (Spotify Wrapped-style)
<img
  src="/hero-dunkin.jpg"
  alt="Café Dunkin"
  className="w-full h-80 object-cover rounded-2xl md:rounded-3xl"
/>
```

---

## 6. Elevaciones (Sombras)

Sombras suaves y sutiles (Apple-style)

| Clase Tailwind | Uso |
|-----------------|-----|
| `shadow-none` | Sin sombra |
| `shadow-sm` | Elementos pequeños (inputs) |
| `shadow-md` | Elementos normales (botones) |
| `shadow-lg` | Cards |
| `shadow-xl` | Tarjetas destacadas |
| `shadow-2xl` | Modales |
| `shadow-soft` | Sombras ultra suaves |
| `shadow-card` | Sombras para cards |

```tsx
// Ejemplo de card con sombra
<div className="bg-white rounded-2xl p-8 shadow-card">
  <h3 className="text-2xl font-bold">¡Tu personalidad es única!</h3>
</div>
```

---

## 7. Tamaños

### 7.1 Max Width
| Clase Tailwind | Valor (px) | Uso |
|-----------------|-------------|-----|
| `max-w-xs` | 320 | Contenedores pequeños |
| `max-w-sm` | 384 | Cards |
| `max-w-md` | 448 | Contenedores |
| `max-w-lg` | 512 | Contenedores amplios |
| `max-w-xl` | 576 | Contenedores grandes |
| `max-w-2xl` | 672 | Contenido de texto |
| `max-w-3xl` | 768 | Artículos |
| `max-w-4xl` | 896 | Secciones |
| `max-w-5xl` | 1024 | Contenedor principal |
| `max-w-6xl` | 1152 | Contenedor principal (XL) |
| `max-w-7xl` | 1280 | Máximo |
| `max-w-8xl` | 1536 | Ultra ancho |

---

## 8. Grid

### 8.1 Sistema de Grid
Usamos el sistema de Grid de Tailwind. Recomendamos:
- Mobile: 1-2 columnas
- Tablet: 2-3 columnas
- Desktop: 3-4 columnas

### 8.2 Aspect Ratios Personalizados
| Clase Tailwind | Proporción | Uso |
|-----------------|-------------|-----|
| `aspect-4/5` | 4:5 | Retrato (Duolingo-style) |
| `aspect-5/4` | 5:4 | Paisaje corto |
| `aspect-16/10` | 16:10 | Hero images |

---

## 9. Breakpoints

Mobile First!

| Clase Tailwind | Ancho (px) | Dispositivo |
|-----------------|-------------|-------------|
| `xs:` | 360 | Móviles pequeños |
| `sm:` | 480 | Móviles |
| `md:` | 768 | Tablets |
| `lg:` | 1024 | Laptops |
| `xl:` | 1280 | Desktops |
| `2xl:` | 1536 | Desktops XL |

```tsx
// Ejemplo de Mobile First
<div className="text-3xl md:text-5xl lg:text-6xl">
  Título responsive
</div>
```

---

## 10. Tokens

Todos los tokens están disponibles como:
1. **CSS Custom Properties** (en `:root` de `app/globals.css`)
2. **Tailwind Config** (en `tailwind.config.ts`)

### 10.1 Ejemplos de Tokens
```css
/* CSS Custom Properties */
:root {
  --color-primary-500: #FF671F;
  --spacing-8: 2rem;
  --radius-2xl: 1.5rem;
  --shadow-card: 0 4px 20px 0px rgba(0, 0, 0, 0.06), ...;
}
```

---

## 11. Uso en el Código

### 11.1 Ejemplo de Página Hero
```tsx
import Image from "next/image";

export default function Hero() {
  return (
    <section className="py-20 md:py-32 container-padding">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div className="space-y-8">
          <h1 className="text-display-sm md:text-display-lg text-dunkin-orange">
            Dime qué tomas<br />y te diré quién eres
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-lg">
            Descubre tu personalidad Dunkin con este divertido quiz. ¡Es gratis!
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-12 py-5 rounded-2xl text-xl font-bold shadow-lg transition-colors">
            ¡Comenzar quiz!
          </button>
        </div>

        {/* Imagen Grande */}
        <div className="aspect-4/5">
          <Image
            src="/images/hero-dunkin.jpg"
            alt="Café Dunkin con donas"
            fill
            className="object-cover rounded-3xl shadow-card"
          />
        </div>
      </div>
    </section>
  );
}
```

### 11.2 Ejemplo de Card
```tsx
export default function ResultCard({ title, description, image }: ResultCardProps) {
  return (
    <div className="bg-dunkin-cream rounded-3xl p-8 md:p-12 shadow-card border border-neutral-100">
      <div className="aspect-video mb-8">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold text-dunkin-black mb-4">
        {title}
      </h3>
      <p className="text-lg text-neutral-600">
        {description}
      </p>
    </div>
  );
}
```

---

## 🎨 Recursos Visuales de Referencia

- **Dunkin Chile**: [Sitio web](https://www.dunkin.cl)
- **Apple Human Interface Guidelines**: [Documentación](https://developer.apple.com/design/human-interface-guidelines)
- **Spotify Wrapped**: [Ejemplos](https://newsroom.spotify.com/us/wrapped)
- **Duolingo Design**: [Dribbble](https://dribbble.com/search/duolingo)

---

## 📌 Notas Importantes

1. **Espacio en blanco**: No tengas miedo a dejar mucho espacio entre elementos
2. **Mobile First**: Siempre empieza diseñando para móviles
3. **Consistencia**: Usa siempre los tokens, nunca valores hardcodeados
4. **Imágenes**: Usa fotografías de alta calidad, bien iluminadas y apetitosas
5. **Animaciones**: Usa `framer-motion` para animaciones suaves (300ms)

---

¡Listo para diseñar! 🚀☕
