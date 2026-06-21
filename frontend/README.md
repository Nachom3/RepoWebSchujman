# ObraCTRL — Frontend

React 19 + Vite 8 + React Router 7 + Tailwind CSS v4 + shadcn/ui + TypeScript strict.

Construido sobre la skill `react-feature-architecture`: **feature-sliced**, con shadcn/ui como única fuente de primitivos cross-feature.

## Stack

- **React 19** + **Vite 8** + **TypeScript 6** (strict)
- **React Router 7** (library mode)
- **Tailwind CSS v4** (CSS-first via `@theme` + OKLCH)
- **shadcn/ui** sobre Radix UI (`radix-ui` meta-package)
- **React Hook Form** + **Zod** para forms
- **Sonner** para toasts
- **framer-motion** para animaciones
- **lucide-react** para iconos
- **axios** para HTTP

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Dev server con HMR |
| `npm run build` | `tsc --noEmit` + `vite build` (falla si hay type errors) |
| `npm run typecheck` | `tsc --noEmit` standalone |
| `npm run lint` | ESLint flat config (cubre `.ts`/`.tsx`) |
| `npm run lint:fix` | ESLint con `--fix` |
| `npm run preview` | Preview del build de producción |

## Estructura

```
src/
├── components/
│   ├── ui/              # shadcn primitives (FLAT, per skill)
│   ├── ErrorBoundary.tsx
│   └── ProtectedRoute.tsx
├── context/             # Cross-feature React context
│   ├── auth-context.ts
│   └── AuthContext.tsx
├── features/            # Business features (group by feature, not type)
│   ├── auth/
│   │   ├── components/
│   │   │   └── AuthForm/
│   │   │       ├── AuthForm.tsx
│   │   │       └── index.ts
│   │   └── index.ts     # Public barrel
│   ├── landing/
│   │   ├── components/  # 18 componentes, uno por carpeta
│   │   ├── data/landing.ts
│   │   └── index.ts
│   └── dashboard/
│       ├── components/DashboardView/
│       └── index.ts
├── lib/                 # Cross-cutting utilities
│   ├── api.ts
│   ├── animations.ts
│   └── utils.ts         # shadcn's cn (clsx + tailwind-merge)
├── pages/               # Thin route components (delegate to features)
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── App.tsx              # Router
├── main.tsx             # Entry point (Providers: Tooltip, Toaster, Router, Auth, ErrorBoundary)
├── index.css            # Tailwind + shadcn tokens + brand OKLCH
└── vite-env.d.ts
```

## Convenciones

### Reglas duras (de la skill `react-feature-architecture`)

1. **Un componente por archivo**. Subcomponentes viven en su propio archivo.
2. **Agrupar por feature, no por tipo**. `features/<feature>/` no `components/` o `containers/`.
3. **Sin imports cross-feature de internos**. El acceso cross-feature va solo por el barrel público (`features/<feature>/index.ts`).
4. **shadcn/ui es obligatorio** para primitivos cross-feature. Nunca hand-rollear Button/Input/Card/etc.
5. **Named exports** por defecto. Default export solo en convenciones de Next.js (`page`, `layout`, etc.).
6. **Componentes presentacionales por default**. Lógica de fetching en hooks o Server Components.
7. **Co-localizar** `Component.tsx` + `Component.types.ts` + `index.ts` en la misma carpeta.

### TypeScript

- `strict: true` activo
- Preferir `import type` para type-only imports (regla `@typescript-eslint/consistent-type-imports`)
- `readonly` en props de componentes y data

### Estilos

- **Tokens shadcn estándar** (`--background`, `--primary`, `--accent`, `--destructive`, etc.) con valores **OKLCH de marca** en `:root` y `.dark`
- Tokens custom no-shadcn (`--color-night`, `--color-night-foreground`, `--color-night-muted`, `--color-success`, `--color-border-strong`) viven en `@theme {}` adicional
- **Mobile-first**, usar breakpoints de Tailwind (`sm:`, `md:`, `lg:`)
- **No inline styles** salvo para gradientes dinámicos (e.g. Hero bg)

### Forms

- Usar shadcn `Form` + `FormField` + React Hook Form + Zod resolver
- Schema de validación en el mismo archivo que el componente
- `mode: "onBlur"` por default (valida al perder foco)
- Errores del server se manejan con prop separada (`serverError`)

### Toasts

- `import { toast } from "sonner"`
- `toast.success(message)` para éxito, `toast.error(message)` para error
- Configurado globalmente con `position="top-right"` en `main.tsx`

## Path aliases

- `@/*` → `src/*` (configurado en `tsconfig.json` y `vite.config.js`)

## shadcn/ui

Agregar primitivos con:
```bash
npx shadcn@latest add <primitive>
```

Primitivos instalados: `alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `popover`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `switch`, `tabs`, `textarea`, `tooltip`.

### Extensiones de marca (no hand-rolling, sí documentadas)

- **Button**: variantes extra `accent` (naranja de marca) y `nightGhost` (CTA en sección oscura)
- **Card**: variantes extra `surface` (`glass|solid|night`) y `padding` (`none|sm|md|lg`)
- **Alert**: variantes extra `success` e `info`

Estas extensiones están en los archivos `src/components/ui/*.tsx` para que `npx shadcn@latest add` no las pise sin querer (revisar diff después de cada `add`).
