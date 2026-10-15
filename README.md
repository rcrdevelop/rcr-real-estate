# rcr-real-estate

Real Estate System — demo del proyecto **02-real-estate-system.md**.

- **Demo**: https://inmobiliaria.rcrdevelop.com
- **Plan de acción**: [docs/PLAN_ACCION.md](docs/PLAN_ACCION.md)

## Stack

- Quasar v2 (Vue 3, `<script setup>`, Composition API)
- Vite via `@quasar/app-vite`, TypeScript estricto
- Pinia + Vue Router (hash mode, filename-based routing)
- Firebase (Hosting + Firestore + Storage)
- Lint/format: `oxfmt` + `oxlint`

## Comandos

```bash
pnpm install        # instalar dependencias
pnpm dev            # servidor de desarrollo
pnpm build          # build de producción -> dist/spa
pnpm lint:check     # verificar formato y lint
pnpm lint           # auto-fix formato y lint
pnpm typecheck      # vue-tsc --noEmit
pnpm deploy         # build + firebase deploy (producción)
pnpm deploy:preview # build + firebase hosting preview channel
```

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com) (un proyecto por app).
2. Edita `.firebaserc` y reemplaza `<project-id>` por el ID del proyecto.
3. Copia `.env.example` a `.env` y rellena las credenciales web del proyecto (`VITE_FIREBASE_*`).
4. Opcional: `firebase use <project-id>` para fijar el proyecto activo.
5. Despliega con `pnpm deploy` (requiere `firebase login` previo).

Las reglas de `firestore.rules` y `storage.rules` son deny-all por defecto; ajústalas según el plan.

## Estructura

- `src/pages/` — rutas (filename-based routing)
- `src/boot/firebase.ts` — inicialización de Firebase (se omite si no hay credenciales)
- `src/css/quasar.variables.scss` — paleta de marca
- `docs/PLAN_ACCION.md` — plan de acción del proyecto
