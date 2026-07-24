# 📚 Índice de Documentación - Dunkin Colombia

**Campaña oficial: "Dime qué tomas y te diré quién eres"**

---

## 📑 Archivos Principales

1. **[README.md](README.md)** - Guía general del proyecto
2. **[DEPLOY.md](DEPLOY.md)** - Guía completa de despliegue y handoff técnico
3. **[ENTREGA_TEST.md](ENTREGA_TEST.md)** - Checklist corto de entrega y publicación
4. **[CHECKLIST_CIERRE_FINAL.md](CHECKLIST_CIERRE_FINAL.md)** - Lista final antes de entregar el proyecto
5. **[USER_FLOW.md](USER_FLOW.md)** - Experiencia de usuario y flujo completo
6. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Sistema de diseño y tokens
7. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura del proyecto
8. **[SUPABASE_QUIZ_DATABASE.md](SUPABASE_QUIZ_DATABASE.md)** - Arquitectura de datos, SQL, RLS y dashboard del quiz
9. **[QUIZ_TRACKING_API.md](QUIZ_TRACKING_API.md)** - Endpoints de tracking y smoke test local
10. **[ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)** - Acceso, rutas, migraciones y operación del dashboard administrativo

---

## 🔒 Seguridad y Legal

11. **[LICENSE](LICENSE)** - Licencia de propiedad exclusiva
12. **[SECURITY.md](SECURITY.md)** - Políticas de seguridad
13. **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Código de conducta
14. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Cómo contribuir

---

## 🚀 Guía Rápida

### Estructura del Proyecto

- Arquitectura empresarial escalable
- Next.js 15 + TypeScript
- Mobile First

### Componentes Reutilizables

Todos los componentes están en la carpeta `components/ui/`:

- Botones, Inputs, Checkboxes
- Loaders, Toast (notificaciones)
- Cards, Modal, Navbar, Footer
- ProgressBar, QuestionCard, Hero, Container

### Diseño

- Colores oficiales de Dunkin (Naranja + Rojo)
- Minimalista, mucho espacio en blanco
- Bordes redondeados
- Microinteracciones con Framer Motion
- Sombras suaves

### Flujo de Usuario

Home → Introducción → Preguntas (1-4) → Loader → Resultado → Formulario → Beneficio → Portafolio → Fin

---

## 🎯 Cómo Empezar

1. Instalar dependencias: `npm install`
2. Copiar `.env.example` a `.env.local` y configurar
3. Ejecutar: `npm run dev`
4. Abrir el navegador: `http://localhost:3000`

### Entrega y Deploy

- Para despliegue paso a paso: `DEPLOY.md`
- Para checklist corto de publicacion: `ENTREGA_TEST.md`
- Para cierre final antes del handoff: `CHECKLIST_CIERRE_FINAL.md`

---

_Todo el proyecto está documentado en español._
