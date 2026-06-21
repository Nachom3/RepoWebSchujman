# Component PR Review Checklist

Run this before approving any PR that touches `components/` or `features/`.

## File layout

- [ ] Component is in its own folder, not lumped with siblings.
- [ ] No two React components defined in the same `.tsx` file.
- [ ] Co-located: `Component.test.tsx` and `Component.types.ts` are in the same folder.
- [ ] Folder lives under `features/<feature>/components/` or `components/ui/`.

## Imports

- [ ] No cross-feature import of internal files. Cross-feature code goes through the feature's public `index.ts` barrel.
- [ ] No `import` from `features/X/components/Y/...` deep paths across features.
- [ ] No wildcard re-export (`export *`) inside a feature's internals.
- [ ] No `components/index.ts` barrel that re-exports the entire design system.

## Component shape

- [ ] Named export, not default (unless it is a Next.js file convention).
- [ ] Props interface is in a `.types.ts` file, not inline in the component file when the file is long.
- [ ] Props fit on one screen. If not, the component does too much — split.
- [ ] One component, one responsibility. No unrelated `useState` calls in the same component.
- [ ] Container vs presentational split is respected: data fetching in a hook or Server Component, not in JSX.

## Server vs Client

- [ ] Server Component by default. `'use client'` only at the leaves that need it.
- [ ] No `useEffect` for data fetching. Use a hook (React Query, SWR) or a Server Component.
- [ ] No browser-only API (`window`, `localStorage`) at the top of a Server Component.

## SOLID

- [ ] **S** — Single responsibility. The component does one job.
- [ ] **O** — Extension via props/composition, not by editing the source for each variant.
- [ ] **L** — No `variant: 'a' | 'b' | 'c' | ...` mega-prop. Expose composable subcomponents.
- [ ] **I** — Focused prop interfaces. Split into siblings when one prop block grows.
- [ ] **D** — Depends on a hook abstraction (`{ data, isLoading, error }`), not a concrete fetch.

## Quality

- [ ] No inline `style` object with business logic (move to `Component.styles.ts` or use `cva`).
- [ ] No `dangerouslySetInnerHTML` without explicit sanitization.
- [ ] Accessibility: interactive elements are `<button>` / `<a>`, not `<div onClick>`.
- [ ] Test covers the rendered output and at least one behavior, not just a render snapshot.
- [ ] No barrel re-export of internals from the feature's `index.ts` (only the public surface).

## shadcn/ui (mandatory primitives)

- [ ] Cross-feature primitive needed (Button, Input, Select, Dialog, Form, etc.) is installed via `npx shadcn@latest add <primitive>` before writing any custom code.
- [ ] No hand-rolled Button, Input, Select, Dialog, Form, Toast, Dropdown, Tabs, Tooltip, Card, Sheet, Popover, Checkbox, RadioGroup, Switch, Slider, Calendar, Command, Accordion, Collapsible, Separator, Skeleton, Progress, Avatar, Badge, Alert, Label, or Textarea in the codebase.
- [ ] `components/ui/` follows shadcn's flat layout (one primitive per file, no folder-per-primitive).
- [ ] Feature components import shadcn primitives by their installed path (`@/components/ui/button`), not through a re-export wrapper.
- [ ] If a custom primitive is needed because shadcn cannot satisfy the requirement, the reason is documented in the file or PR.
