# Guía de Deploy, Modo Prueba y Conexión a Dominio - Dunkin' Colombia

## Objetivo

Esta guía explica, de forma práctica y sin tecnicismos innecesarios, cómo
publicar el proyecto del quiz **"Dime qué tomas y te diré quién eres"** en un
hosting propio, cómo dejarlo en modo prueba antes de pasarlo a producción real,
y cómo conectar el dominio o subdominio final de Dunkin' Colombia.

Documentos complementarios:

- [DEPLOY.md](DEPLOY.md) — checklist técnico detallado de despliegue.
- [ENTREGA_TEST.md](ENTREGA_TEST.md) — checklist corto para handoff.
- [GUIA_DASHBOARD_RESULTADOS.md](GUIA_DASHBOARD_RESULTADOS.md) — cómo usar el
  panel administrativo después del deploy.

---

## 1. Stack necesario y hosting compatible

### Stack mínimo

- **Node.js 20+** (o la versión LTS más reciente)
- **Next.js 15** (ya incluido en el proyecto)
- **npm** (gestor de dependencias; viene con Node)

### Comandos base

Dentro de la carpeta del proyecto, siempre empiezan por:

```bash
npm install
npm run lint
npm run build
npm start
```

Si el `build` sale exitoso, el proyecto está listo para publicarse en cualquier
hosting compatible con Next.js.

### Hosting compatible (orden alfabético)

Cualquiera de estos sirve; Dunkin' Colombia elige el que prefiera según su
infraestructura:

- **Amazon Web Services (AWS)** con Amplify / ECS / EC2 + dominio personalizado
- **Cloudflare Pages** con build de Next.js y dominio propio
- **Hosting Node.js genérico** (DigitalOcean, Hetzner, VPS...)
- **Netlify** con adaptador Next y dominio propio
- **Vercel** (el usado para las pruebas iniciales)

Ninguno es obligatorio. El proyecto no depende de una plataforma específica.

---

## 2. Modo prueba vs modo real

El proyecto tiene 2 modos de ejecución para el quiz. Se controlan con la
variable de entorno pública:

```env
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview   # Modo prueba
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live      # Modo real
```

### Modo prueba (preview) — RECOMENDADO para entornos de validación

Cuándo usarlo: cuando quieren validar diseño, copy, flujo, pantallas, imágenes
o redirecciones **sin tocar la base de datos real** ni guardar registros.

Qué hace:

- El quiz funciona visualmente igual que el real.
- Las APIs de tracking NO guardan sesiones, respuestas ni eventos.
- El formulario sigue visible, pero no persiste en `quiz_participants`.
- Las recomendaciones se sirven con fuente `live` o `fallback`, sin necesidad de
  Supabase.

Configuración mínima para modo prueba:

```env
NEXT_PUBLIC_SITE_URL=https://preview.tu-dominio.com
NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview
```

No es obligatorio cargar las claves de Supabase en modo prueba.

### Modo real (live) — producción final

Cuándo usarlo: cuando el preview está aprobado y quieren guardar registros,
tracking real, formularios y analítica del dashboard.

Para pasarlo a producción real hay que, como mínimo:

1. Aplicar todas las migraciones de Supabase listadas en
   [ENTREGA_TEST.md](ENTREGA_TEST.md).
2. Cargar estas 3 variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
3. Cambiar el modo:
   ```env
   NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live
   ```
4. Re-deployar el proyecto.

> Regla de seguridad por defecto: si la variable no se define, el proyecto
> arranca en `preview` para evitar escrituras accidentales en entornos nuevos.

---

## 3. Cómo hacer un deploy de prueba rápido (sin Supabase)

Ideal para entregar una primera URL al equipo de marketing y validar UI sin
configurar base de datos.

1. Conecta el repositorio al hosting elegido.
2. Carga solo estas variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://preview.dunkin.co
   NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview
   ```
3. Configura el build del hosting con estos comandos:
   ```bash
   npm install
   npm run build
   ```
4. Publica.
5. Abre la URL del preview:
   - `/` debe redirigir a `/quiz`
   - `/quiz` debe mostrar la intro del test
   - al hacer el quiz, deben aparecer las 4 preguntas
   - al finalizar, debe abrir el resultado con bebida y personalidad
   - el CTA de `Ver en Dunkin'` debe llevar al link oficial de la bebida

Si todo esto pasa, pueden pasar al siguiente nivel: deploy completo con
Supabase.

---

## 4. Cómo hacer un deploy completo con Supabase

1. **Preparar Supabase de producción**
   - Crea un proyecto nuevo de Supabase para Dunkin' Colombia (o usa uno ya
     existente con autorización escrita).
   - Aplica todas las migraciones de `supabase/migrations/` en orden.
   - Confirma que existan estas tablas:
     - `quiz_participants`
     - `campaign_benefits`
     - `quiz_sessions`
     - `quiz_answers`
     - `quiz_events`
     - `admin_users`

2. **Cargar variables en el hosting**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_SITE_URL=https://quiz.dunkin.co
   NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live
   BENEFITS_SYNC_SECRET=
   SUPABASE_SERVICE_ROLE_KEY=
   GOOGLE_SITE_VERIFICATION=
   ```

3. **Build y publicación**
   ```bash
   npm install
   npm run lint
   npm run build
   npm start
   ```

4. **Sync inicial de beneficios (opcional pero recomendado)**
   Después del deploy, ejecutan una sola vez:
   ```bash
   curl -X POST "https://quiz.dunkin.co/api/benefits/sync" \
     -H "Authorization: Bearer TU_BENEFITS_SYNC_SECRET"
   ```
   Esto popula `campaign_benefits` con el catálogo de Dunkin' Colombia.

5. **Primeras pruebas en vivo**
   - Hacer 1 quiz completo y validar que guarde formulario.
   - Entrar a `/admin/login` con la cuenta creada en Supabase Auth.
   - Validar que el dashboard muestre el primer registro.

---

## 5. Conectar un dominio o subdominio final

En cualquier hosting, los pasos son siempre los mismos conceptualmente:

1. **Decide URL final**
   - Dominio: `https://dunkin-quiz.co`
   - Subdominio: `https://quiz.dunkin.co` (opción más usada en campañas)

2. **Configura NEXT_PUBLIC_SITE_URL**
   Esta variable **debe** coincidir exactamente con la URL final publicada,
   porque de ella dependen:
   - `robots.txt`
   - `sitemap.xml`
   - canonical SEO
   - Open Graph y la OG image dinámica (`/og-image`)
   - Links de compartir

   Ejemplo para subdominio:
   ```env
   NEXT_PUBLIC_SITE_URL=https://quiz.dunkin.co
   ```
   Importante: NO dejar barra al final.

3. **Agrega el dominio o subdominio en el hosting**
   Cada hosting tiene una sección tipo:
   - Vercel: **Settings → Domains → Add**
   - Netlify: **Site settings → Domain management**
   - Cloudflare Pages: **Custom domains**
   - Otros: panel de dominios del servicio.

4. **Configura los registros DNS en el proveedor del dominio**

   Si es **subdominio** (recomendado):
   ```
   Tipo: CNAME
   Nombre: quiz
   Valor: el hostname que te entrega el hosting
   TTL: automático o 300
   ```

   Si es **dominio raíz**:
   ```
   Tipo: A
   Nombre: @
   Valor: IP que entrega el hosting
   TTL: automático o 300
   ```
   A veces, en vez de un registro A, el hosting pide un **Apex alias**
   (CNAME flattening o ALIAS) para el dominio raíz. Si tu proveedor DNS lo
   soporta, úsalo; es más estable.

5. **Activa SSL/TLS**
   Todos los hostings modernos dan HTTPS gratis. Asegúrate de:
   - Activar certificado SSL
   - Redirigir `http` → `https`
   - (Opcional pero recomendado) Forzar `www` o quitar `www`, según la URL
     elegida.

6. **Espera propagación DNS**
   Puede tardar desde 5 minutos hasta 24 horas. En la práctica, para
   subdominios suele estar listo en menos de 1 hora.

---

## 6. Qué rutas probar después del deploy

Cuando el dominio ya resuelva por HTTPS, valida estas rutas:

| Ruta                          | Qué debe mostrar                                                   |
|-------------------------------|--------------------------------------------------------------------|
| `/`                           | Redirige permanentemente (`308`) a `/quiz`                         |
| `/quiz`                       | Intro del quiz: logos, headline, carrusel, CTA principal          |
| `/quiz` (hacer quiz)          | 4 preguntas barajadas visualmente, avance correcto, resultado     |
| `/admin/login`                | Pantalla de ingreso administrativo                                 |
| `/admin`                      | Dashboard (solo si la sesión admin está autorizada)                |
| `/robots.txt`                 | Bloques permitidos y `Sitemap:` apuntando al dominio correcto      |
| `/sitemap.xml`                | URLs base del quiz con el dominio correcto                         |
| `/og-image`                   | PNG de Open Graph con la campaña visible                          |

---

## 7. Cómo ingresar a la app cuando ya está publicada

### Para usuarios finales

Solo necesitan la URL pública:

- Producción: `https://quiz.dunkin.co/quiz`
- Preview: `https://preview.dunkin.co/quiz`

Al entrar, la app lleva directamente a la intro y empieza el flujo normal.

### Para administradores (dashboard)

Usan la ruta separada:

```
https://quiz.dunkin.co/admin/login
```

Allí ingresan con el correo y contraseña creados en Supabase Auth y autorizados
en la tabla `admin_users`. La guía paso a paso del panel está en
[GUIA_DASHBOARD_RESULTADOS.md](GUIA_DASHBOARD_RESULTADOS.md).

---

## 8. Smoke test rápido de producción (5 minutos)

Antes de darle "visto bueno" definitivo a un deploy, haz estas pruebas en
menos de 5 minutos:

1. **Home**
   - Abre la raíz: debe redirigir a `/quiz`.

2. **Intro mobile y desktop**
   - Logos visibles.
   - Headline `Dime qué tomas...` nítido.
   - Botón CTA principal bien posicionado.

3. **4 preguntas**
   - Todas las opciones aparecen.
   - Cambian de orden visualmente por sesión.
   - Al avanzar no se ve scroll en blanco ni saltos raros.

4. **Resultado**
   - Muestra personalidad correcta y bebida.
   - Sello visible.
   - CTA `Ver en Dunkin'` abre link oficial.
   - CTA `Repetir test` funciona.
   - Formulario se guarda sin error (si está en `live`).

5. **Admin**
   - `/admin/login` pide correo + contraseña.
   - Con una cuenta autorizada, entra al dashboard y muestra KPIs.
   - Botones de exportación responden (aunque al principio estén vacíos).

6. **SEO básico**
   - `/robots.txt` no devuelve error.
   - `/sitemap.xml` no devuelve error.
   - Compartir la URL `/quiz` en WhatsApp/Facebook muestra miniatura.

Si esto pasa, el deploy está listo para producción.

---

## 9. Problemas comunes y solución rápida

### 9.1 "Abre el dominio pero no ve el quiz"

Causa típica: la URL base visitada no es `/quiz` y la redirección `/` →
`/quiz` no está activa.

Solución:
- Prueba directamente `https://tu-dominio.com/quiz`.
- Si ahí sí funciona, revisa en el hosting si la ruta raíz está pasando por
  Next.js (no por un HTML estático ni un CDN que la cachee).

### 9.2 "El dominio resuelve pero todo sale en blanco"

Causa: falta `NEXT_PUBLIC_SITE_URL`, o hay un error de build anterior.

Solución:
1. Añade `NEXT_PUBLIC_SITE_URL` exacta.
2. Haz un nuevo build.
3. Si el build falla, revisa el log del hosting y pásalo al equipo técnico.

### 9.3 "El modo live no guarda formularios"

Causa típica: `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=preview` o falta
`SUPABASE_SERVICE_ROLE_KEY`.

Solución:
1. Cambia a `NEXT_PUBLIC_QUIZ_RUNTIME_MODE=live`.
2. Asegúrate de que `SUPABASE_SERVICE_ROLE_KEY` esté cargada.
3. Asegúrate de que la tabla `quiz_participants` tenga `INSERT` para la
   política correcta.

### 9.4 "El dashboard sale sin datos"

Causa: no hay registros, o falta `SUPABASE_SERVICE_ROLE_KEY`.

Solución:
1. Haz 1 quiz completo para generar datos.
2. Confirma que la clave privada esté en el hosting.
3. Refresca `/admin`.

### 9.5 "No me deja entrar al admin con la contraseña correcta"

Causa: el correo no está en `public.admin_users`.

Solución:
```sql
select email, is_active from public.admin_users;
```
Si no aparece, insértalo como indica la
[GUIA_DASHBOARD_RESULTADOS.md](GUIA_DASHBOARD_RESULTADOS.md).

---

## 10. Checklist final de dominio antes de salir a producción

- [ ] Dominio o subdominio final definido por Dunkin' Colombia
- [ ] `NEXT_PUBLIC_SITE_URL` coincide exactamente con la URL final (sin `/` al final)
- [ ] HTTPS activo y certificado SSL funcionando
- [ ] DNS propagado
- [ ] `robots.txt` y `sitemap.xml` responden con el dominio correcto
- [ ] Redirección `/` → `/quiz` activa
- [ ] Share de redes muestra OG image correcta
- [ ] Modo runtime pasado a `live` si ya es producción real
- [ ] Supabase productivo conectado y migraciones aplicadas
- [ ] Sync inicial de beneficios ejecutada (si aplica)
- [ ] Cuenta admin autorizada en `admin_users`
- [ ] Smoke test de 5 minutos aprobado
