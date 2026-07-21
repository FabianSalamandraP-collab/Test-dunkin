# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-es/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2026-07-20

### Added

- Segundo logo de marca `YES_ALL_DAY` integrado en la intro y en preguntas.
- Nuevos assets optimizados en `webp` para logos, bebidas, personalidades, preguntas, resultados, ribbons laterales y fondo desktop de la intro.
- Soporte de resaltado semántico dentro de los títulos de las preguntas mediante `questionHighlight`.
- Ajustes móviles por imagen con `mobileImageScale`, `mobileImageOffsetX` y `mobileImageOffsetY` para mejorar el encaje visual de preguntas y resultados.
- Fondo desktop adicional `hero-desktop-pop-texture.webp` para enriquecer la intro sin perder el degradado base.

### Changed

- Refinada la jerarquía visual de `IntroScreen` en desktop y móvil:
- Reubicado el CTA principal para que aparezca antes en desktop.
- Rediseñado el CTA principal con color de marca `#FF671F`, mejor brillo, sombra y microanimación.
- Ajustados los logos superiores en tamaño, balance, centrado y línea divisoria entre marcas.
- Integrado el nuevo fondo desktop y una mezcla de textura con el fondo degradado en móvil.
- Mejorada la visibilidad de nombres en el carrusel desktop usando cápsulas más cercanas al tratamiento móvil.
- Limitado el carrusel desktop a la bebida principal y las dos laterales cercanas para reducir saturación visual.
- Ajustadas puntas decorativas del marco superior izquierdo en móvil y desktop para corregir el match de color.
- Actualizada la tipografía base para dar una presencia menos genérica y más editorial al sitio.

- Mejorada la experiencia de `QuestionScreen`:
- Nuevas tarjetas de opción con mayor contraste, brillo y estados activos más premium.
- Botones `Anterior`, `Continuar` y `Ver resultado` con una familia visual más sólida y consistente con marca.
- Replanteado el tratamiento de imágenes móviles para que vivan mejor dentro de su caja, sin depender de "Ver grande".
- Resaltadas frases clave de las 4 preguntas en naranja Dunkin para reforzar el ritmo visual del título.

- Mejorada la experiencia de `ResultScreen`:
- Más personalización por personalidad usando color y acento dentro del resultado.
- Tarjetas `Tu match Dunkin` y `La bebida que va contigo` con fondos más intensos y animación tipo humo/halo.
- Tarjeta de recomendación y bloque de compartir alineados visualmente al sistema de color del resultado.
- Botones de recomendación, compartir, copiar enlace y acciones secundarias con un tratamiento más premium.

- Refinado `QuizForm`:
- Reestilado el formulario, estado de éxito, manejo de error y botón principal.
- Ajustado el copy del formulario para que sea más claro y consistente con el tono general.

- Mejorado el copy en intro, resultado y registro:
- Menos repeticiones de "match" y "descubre".
- Frases más cortas y mejor acomodadas en sus cajas.
- Mejor contraste en bloques claros sobre fondos gráficos.

### Fixed

- Corregido el logo `Dunkin` en móvil para que se perciba más grande sin verse estirado.
- Ajustados saltos visuales del carrusel provocados por textos largos en nombres de bebidas.
- Corregidos desbalances de logos y visibilidad de iconos sociales en móvil.
- Mejorado el encaje de imágenes en móvil para evitar recortes visibles en preguntas y resultado.
- Corregidos detalles de contraste donde el fondo reducía legibilidad en intro y resultado.

## [1.0.0] - 2026-07-05

### Added

- 🚀 Configuración inicial del proyecto con Next.js 15 y TypeScript
- 🎨 Integración de TailwindCSS
- 📦 Instalación de dependencias: Framer Motion, React Hook Form, Zustand, Supabase, Lucide React
- 📁 Estructura profesional de directorios
- 🔧 Configuración de ESLint y Prettier para consistencia de código
- 📄 Archivos legales y de seguridad: LICENSE, SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md
- 📚 Documentación: README.md, ARCHITECTURE.md, CHANGELOG.md
- 🎯 SEO optimizado: metaetiquetas, sitemap, robots.txt
- 🛡️ .gitignore completo para proteger información sensible
- 📝 .env.example con instrucciones claras
