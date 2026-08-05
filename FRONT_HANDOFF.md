# Guía Rápida para Equipo de Front - Dunkin' Quiz

## Objetivo

Esta guía está pensada para el equipo de front que va a ajustar, revisar o publicar
la campaña **"Dime qué tomas y te diré quién eres"** de Dunkin' Colombia sin tocar
base de datos, autenticación ni backend.

Regla general:

- **Puedes tocar:** UI, copy, imágenes, tipografías, estilos, order y textos de
  las rutas públicas.
- **No tocar, a menos que sea estrictamente necesario:** APIs, migraciones SQL,
  Supabase, middleware, rutas admin ni configuración privada.

---

## 1. Documentos que sí vale la pena abrir hoy

Si solo tienes 10 minutos, empieza por aquí:

1. [FRONT_HANDOFF.md](FRONT_HANDOFF.md) — este archivo, lo estás leyendo.
2. [ENTREGA_TEST.md](ENTREGA_TEST.md) — checklist operativo rápido.
3. [GUIA_DEPLOY_DOMINIO.md](GUIA_DEPLOY_DOMINIO.md) — cómo publicar y conectar
   dominio o subdominio.
4. [README.md](README.md) — mapa general del proyecto y assets incluidos.

El resto de docs (dashboard, tracking, SQL) se dejan como referencia para el
equipo técnico o cuando decidan activar analytics real.

---

## 2. Qué archivos y carpetas SÍ tocar (flujo público del quiz)

### 2.1 Textos y contenidos del quiz

- **Preguntas, respuestas, personalidades y bebidas**  
  [constants/quizQuestions.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/constants/quizQuestions.ts)
  - Aquí vive el copy visible del test.
  - Si cambias textos, no cambies los `id` ni los `value` internos (rompería
    el scoring).

- **Intro del quiz (hero, copy, CTA, carrusel, logos)**  
  [features/quiz/IntroScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/IntroScreen.tsx)
  - Este archivo controla la primera pantalla que ve el usuario en mobile y
    desktop.

- **Pantalla de preguntas, progreso y animaciones**  
  [features/quiz/QuestionScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/QuestionScreen.tsx)
  - Aquí está la baraja visual de opciones (A/B/C cambian de orden sin romper
    el score).

- **Pantalla final de resultado**  
  [features/quiz/ResultScreen.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/features/quiz/ResultScreen.tsx)
  - Personalidad, bebida, sellos, CTA de `Ver en Dunkin'`, repetir test,
    compartir y copy de recomendación.

### 2.2 Estilos globales y tipografías Dunkin'

- **CSS global, fondos y variables de la campaña**  
  [app/globals.css](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/globals.css)

- **Diseño base, colores y componentes reutilizables**  
  - Botones, inputs y Navbar viven en `components/ui/`.
  - Si cambias algo global de UI, revisa `Button.tsx`, `Input.tsx` y
    `Navbar.tsx` antes de modificar aisladamente.

### 2.3 Rutas públicas que sí se pueden inspeccionar visualmente

- `/` → redirige a `/quiz`  
  [app/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/page.tsx)
- `/quiz` → flujo público completo  
  [app/quiz/page.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/quiz/page.tsx)
- `/og-image` → imagen OG generada en código (si cambian copy, mirar aquí)  
  [app/og-image.tsx](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/app/og-image.tsx)
- `sitemap` y `robots` — los genera Next.js en base a `NEXT_PUBLIC_SITE_URL`.

---

## 3. Qué NO tocar a menos que te lo digan explícitamente

Si tu misión es front/UI, deja quieto esto:

1. **APIs internas**  
   - Todo dentro de `app/api/**`  
   - Incluye session, answer, complete, abandon, event, form submit,
     benefits sync y endpoints del admin.

2. **Middleware y control de acceso**  
   [utils/supabase/middleware.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/utils/supabase/middleware.ts)

3. **Todo lo relacionado con Supabase Auth y backend admin**  
   - `app/admin/**`
   - `features/admin/**`
   - `lib/admin-dashboard/**`
   - Migraciones SQL dentro de `supabase/migrations/**`

4. **Configuración privada**  
   - No crees ni comitees `.env.local`, `.env.production` ni
     `SUPABASE_SERVICE_ROLE_KEY`.
   - Si necesitas variables de ejemplo, usa `.env.example`.

5. **`id` / `value` internos de preguntas y resultados**  
   Dentro de `constants/quizQuestions.ts` puedes cambiar **texto visible**,
   pero no los campos técnicos (`id`, `value`, `resultId`, `scoring`). Si los
   mueves, cambia el cálculo de la personalidad final.

---

## 4. Assets visuales ya incluídos (no hay que subirlos otra vez)

Todas las imágenes del test ya están dentro de `public/assets/` y versionadas
en Git. La cuenta completa está en:

- [public/assets/QUIZ_ASSETS.md](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/QUIZ_ASSETS.md)

Las piezas más frecuentes para reemplazar son:

- **Headline editorial de la intro**  
  [public/assets/quiz-intro/headlines/dime-que-tomas.webp](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-intro/headlines/dime-que-tomas.webp)

- **Logos Dunkin' y YES ALL DAY**  
  [public/assets/quiz-intro/logo/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-intro/logo/)

- **Fondos de intro (mobile y desktop)**  
  [public/assets/quiz-intro/backgrounds/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-intro/backgrounds/)

- **Bebidas del carrusel intro**  
  [public/assets/quiz-intro/drinks/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-intro/drinks/)

- **Fondos y visuales del resultado**  
  - Fondo: [public/assets/quiz-results/backgrounds/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-results/backgrounds/)
  - Lifestyle por bebida: [public/assets/quiz-results/lifestyle/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-results/lifestyle/)
  - Personalidades: [public/assets/quiz-results/personalities/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-results/personalities/)
  - Sellos: [public/assets/quiz-results/stamps/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/assets/quiz-results/stamps/)

- **Fuentes Dunkin'**  
  [public/fonts/dunkin/](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/public/fonts/dunkin/)
  - DunkinSans-Medium.otf
  - DunkinSans-ExtraBold.otf

### Regla de reemplazo seguro

Si vas a sustituir una imagen:

- Usa el **mismo nombre de archivo** y la **misma extensión**.
- Si cambias resolución o proporción, revisa el wrapper/layout en el archivo
  TSX correspondiente para evitar CLS o cortes raros.
- Si creas nombres nuevos (no recomendado), actualiza todos los imports y
  referencias manualmente.

---

## 5. Branding de Dunkin' (reglas de copy)

Antes de comitear, revisa estos detalles:

- **Siempre `Dunkin'` con apóstrofe**. No usar:
  - `Dunkin` sin apóstrofe
  - `Dunkins`
  - Variantes con acentos incorrectos.
- Idioma: `es-CO` (español Colombia).
- Tildes y eñes en todos los textos visibles (UI, alt, placeholders, títulos).
- Mantén consistencia entre mobile y desktop. No ajustes solo una vista.

---

## 6. Comandos mínimos que necesitas saber

Dentro de la carpeta raíz del proyecto:

```bash
# 1. Instalar dependencias (solo la primera vez o tras cambios en package.json)
npm install

# 2. Arrancar localmente para ver cambios en vivo
npm run dev

# 3. Validar que el proyecto compila bien (antes de pedir deploy)
npm run build

# 4. (Opcional) Pasar lint y tipos para evitar fallos en el hosting
npm run lint
```

Si `npm run build` pasa, el código está listo para que el equipo de deploy lo
publique.

---

## 7. Modo prueba vs modo real (por qué no verás escrituras en base de datos)

El proyecto arranca por defecto en **modo `preview`** para proteger entornos
nuevos. Eso significa:

- El quiz se ve y funciona igual visualmente.
- Las APIs **no** guardan sesiones, respuestas ni formularios en base de datos.
- Los beneficios se sirven con fuentes `live` o `fallback`.

Si en algún momento quieren pasar a analytics real, el equipo técnico cambia:

```env
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live
```

y conecta Supabase. Para trabajo de front, puedes dejarlo siempre en
`preview` sin ningún problema.

> Definición oficial del runtime:
> [lib/quiz-runtime-mode.ts](file:///c:/Users/Sebastian/Desktop/TEST%20DUNKIN/lib/quiz-runtime-mode.ts#L1-L29)

---

## 8. Smoke test visual de front (antes de dar OK)

Antes de enviar cualquier cambio de UI, revisa estas 10 cosas en mobile y
desktop:

1. **Home** → `/` redirige a `/quiz` sin lag ni pantallas intermedias raras.
2. **Intro**
   - Logos Dunkin' + YES ALL DAY visibles y centrados (desktop).
   - Headline principal nítido, no cortado.
   - Botón CTA principal visible y alineado en ambas vistas.
   - Carrusel de bebidas avanza correctamente.
3. **Preguntas**
   - 4 preguntas completas.
   - Orden de A/B/C cambia visualmente, pero las elecciones siguen funcionando.
   - No hay saltos de layout ni scroll en blanco.
4. **Resultado**
   - Aparece personalidad y bebida correcta.
   - Sellos visibles.
   - CTA `Ver en Dunkin'` abre el link oficial.
   - CTA `Repetir test` vuelve a la intro sin romper estado.
5. **Compartir / Open Graph**
   - Al pegar la URL `/quiz` en WhatsApp o Facebook se ve una imagen, no un
     link roto.
6. **Branding**
   - Donde dice `Dunkin` debe ser `Dunkin'`.
   - Revisa Navbar, CTAs y textos de sello/recomendación.
7. **Mobile específicamente**
   - No haya scroll en blanco al final ni contenido cortado.
   - El botón CTA de intro no quede demasiado abajo ni “pegado” mal.
8. **Imágenes**
   - Ninguna imagen rota (404) en intro, preguntas ni resultado.
   - Si sustituiste assets, revisa que se vean en ambos breakpoints.
9. **Fuentes**
   - El headline y copy corporativo respetan las fuentes Dunkin' cuando
     corresponden.
10. **Build**
    - `npm run build` termina exitoso. Si no, no des por bueno el cambio.

---

## 9. Checklist de cambios seguros para front

Cada vez que hagas un ajuste pequeño, sigue esta lista mental:

- [ ] Cambié solo archivos de UI, copy, estilos o assets.
- [ ] No modifiqué IDs internos de preguntas ni resultados.
- [ ] Probé mobile y desktop.
- [ ] Revisé branding `Dunkin'` con apóstrofe.
- [ ] `npm run build` pasa.
- [ ] Si cambié una imagen, revisé alt y proporciones.
- [ ] Si cambié copy visible, actualicé tanto mobile como desktop en el mismo
      cambio.

---

## 10. Si algo se rompe y no sabes por dónde empezar

1. Revisa primero [README.md](README.md#L1-L185) y la ruta/archivo que tocaste.
2. Mira si el error aparece solo en build (`npm run build`) o también en
   desarrollo (`npm run dev`).
3. Si cambiaste una imagen, valida que el nombre/extensión coincida exactamente
   con la referencia en el TSX.
4. Si cambiaste copy y falla lint/format, revisa el error exacto y mantén el
   estilo del proyecto (comillas, finales de línea, apóstrofes escapados en
   JSX cuando el linter lo pida).
5. Si tomaste alguna ruta de `app/api/**` o `app/admin/**` por error y no
   sabes por qué, deshaz ese archivo antes de pedir deploy.
