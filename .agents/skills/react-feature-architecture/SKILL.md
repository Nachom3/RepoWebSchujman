---
name: react-feature-architecture
description: "Trigger: modularizar frontend, components folder, feature-sliced, SOLID React, estructura de componentes, refactor componentes. Enforce strict feature-sliced React/Next.js architecture: one component per file, SOLID, feature folders."
---

# React Feature Architecture

Strict rules for organizing React/Next.js code. Use when creating, refactoring, or reviewing components, features, or pages.

## Before You Start

1. **Survey the codebase first.** Run `grep`/glob across `components/ui/` and `features/` to find components that already do what you need. Do not duplicate.
2. **List what you have to build.** Before writing code, write down every new component, hook, and type the task requires.
3. **Classify each one as `shared` or `feature`.** Ask: *will another feature use this?* If yes → `components/ui/`. If no → `features/<feature>/components/`. Decide before placing the file; do not move it later.
4. **Reuse, do not rewrite.** Cross-feature primitives come from shadcn/ui (see Hard Rule #10). If a shadcn primitive exists (Button, Input, Modal, etc.), compose it. Wrap it locally only when the wrapper carries feature logic that does not belong in the primitive.
5. **Promote on second use, not first.** If a feature component is needed by a second feature, move it to `components/ui/` and import it from there. Do not pre-emptively generalize.

## Hard Rules

1. **One component per file.** Subcomponents live in their own file under the same folder. No `Card.tsx` exporting `Card`, `CardHeader`, `CardBody` together.
2. **Group by feature, not by type.** `features/appointments/` not `components/`, `containers/`, `hooks/`.
3. **No cross-feature imports of internals.** Cross-feature access goes only through the feature's public `index.ts` barrel.
4. **One responsibility per component.** Two unrelated `useState` calls → split the component.
5. **No god-props.** Props fit on one screen; if they do not, the component is doing too much.
6. **Co-locate.** `Component.tsx` + `Component.test.tsx` + `Component.types.ts` in the same folder.
7. **Named exports** for components. Default exports only for Next.js file conventions (`page`, `layout`, `error`, `loading`, `not-found`).
8. **Server Components by default.** Add `'use client'` only at the leaves that need state, effects, browser APIs, or event handlers.
9. **Data layer lives in hooks or Server Components.** JSX owns no fetching or mutation logic.
10. **shadcn/ui is the mandatory source of cross-feature primitives.** All components in `components/ui/` MUST come from shadcn/ui (`npx shadcn@latest add <primitive>`). Never hand-roll a Button, Input, Select, Dialog, Toast, Dropdown, Form, Tabs, Tooltip, Card, Sheet, Popover, Checkbox, RadioGroup, Switch, Slider, Calendar, Command, Accordion, Collapsible, Separator, Skeleton, Progress, Avatar, Badge, Alert, Label, Textarea, or any other primitive that shadcn provides. When a new primitive is needed, install it from shadcn first; only build a custom one when shadcn cannot satisfy the requirement, and document why.

## Folder Layout

```
src/
├── app/                        # Routes only (page, layout, loading, error)
├── components/ui/              # shadcn/ui primitives (flat layout)
│   ├── button.tsx              # Installed via `npx shadcn@latest add button`
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...                     # One primitive per file, flat under components/ui/
├── features/<feature>/         # Business capability
│   ├── components/<Component>/ # One component per folder
│   │   ├── <Component>.tsx
│   │   ├── <Component>.test.tsx
│   │   ├── <Component>.types.ts
│   │   └── index.ts
│   ├── hooks/                  # Feature hooks
│   ├── services/               # API calls, data layer
│   ├── types.ts
│   ├── schemas.ts              # Zod / validation
│   └── index.ts                # Public barrel
└── lib/                        # Cross-cutting utilities
```

## Decision Table

| Need | Location |
|------|----------|
| Used by 1 feature | `features/<feature>/components/` |
| Used by 2+ features, no business logic | `components/ui/` (shadcn/ui primitive, see Hard Rule #10) |
| Hook with business logic | `features/<feature>/hooks/` |
| Hook used across features | `lib/hooks/` |
| API call for one feature | `features/<feature>/services/` |
| Type used by many features | `lib/types/` |
| Page route | `app/.../page.tsx` (thin, delegates to feature) |

## SOLID for React

- **S** — `LoginForm` does not also render the user's last 5 orders. One job per component.
- **O** — Extend via composition and props, not by editing source. If a variant needs new behavior, compose with children or wrap it.
- **L** — Subcomponents must be substitutable. Avoid `variant: 'a' | 'b' | 'c' | ...`; expose composable pieces.
- **I** — Small focused prop interfaces. Split mega-components into focused siblings under a shared parent.
- **D** — Depend on a hook returning `{ data, isLoading, error }`, not on a concrete fetch. Swap the data source in tests with a hook mock.

## Anti-Patterns to Reject

- `components/appointments/...` (no feature grouping)
- `Card.tsx` exporting `Card`, `CardHeader`, `CardBody` (multiple per file)
- `components/index.ts` re-exporting everything (kills tree-shaking)
- Page that fetches AND renders a 200-line JSX tree (split: container + presentational)
- Prop interface with 15+ fields (split the component)
- `'use client'` at the top of a tree that does not need it (push to leaves)
- Inline styles or classnames string-concatenated with logic (use a `styles` file or `cva`)
- Hand-rolling a Button, Input, Modal, Select, Dialog, Form, or any other primitive that shadcn/ui already provides (see Hard Rule #10)
- Wrapping a shadcn primitive in `components/ui/` to re-export it with a new name (re-export it from the feature instead, or import shadcn directly)

## References

- `assets/feature-example.md` — full worked example
- `assets/component-checklist.md` — PR review checklist
