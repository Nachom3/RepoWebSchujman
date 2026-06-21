# Landing TypeScript Refactor Specification

## Purpose

Decompose the 674-line `Landing.jsx` monolith into atomic design components under TypeScript strict mode, extracting data, fixing dynamic Tailwind JIT failures, and eliminating inline CSS.

---

## Component Contracts

### Data Layer — `src/data/landing.ts`

| Export | Type | Description |
|--------|------|-------------|
| `problems` | `ProblemItem[]` | 3 before/after pairs with text |
| `useCases` | `UseCaseItem[]` | 3 numbered cards with title, body, tags |
| `testimonials` | `TestimonialItem[]` | 3 quotes with author metadata |
| `navLinks` | `NavLinkItem[]` | 4 nav entries with label and target |
| `dashboardMetrics` | `MetricItem[]` | Hero mockup stat cards |
| `dashboardRows` | `DashboardRowItem[]` | Hero mockup progress rows |
| `demoActivityFeed` | `ActivityItem[]` | Demo section activity feed |
| `demoNavItems` | `DemoNavItem[]` | Demo sidebar navigation |
| `footerColumns` | `FooterColumnData[]` | Footer link groups |
| `socialLinks` | `SocialLinkItem[]` | LinkedIn, YouTube, Twitter SVG data |
| `companyLogos` | `string[]` | Company names for logo bar |

### Animation Helpers — `src/lib/animations.ts`

| Export | Signature | Returns |
|--------|-----------|---------|
| `fadeInUp` | `() => Variant` | Framer Motion whileInView config |
| `stagger` | `(i: number) => Variant` | fadeInUp with calculated delay |

### New Components (19 total)

| Atom | Props Interface | File |
|------|----------------|------|
| `Stars` | `{ rating: number; size?: number }` | `atoms/Stars.tsx` |
| `SectionHeader` | `{ eyebrow: string; title: string; subtitle?: string }` | `atoms/SectionHeader.tsx` |

| Molecule | Props Interface | File |
|----------|----------------|------|
| `ProblemCard` | `{ item: ProblemItem; index: number }` | `molecules/ProblemCard.tsx` |
| `UseCaseCard` | `{ item: UseCaseItem; index: number }` | `molecules/UseCaseCard.tsx` |
| `TestimonialCard` | `{ item: TestimonialItem }` | `molecules/TestimonialCard.tsx` |
| `DashboardMetric` | `{ item: MetricItem }` | `molecules/DashboardMetric.tsx` |
| `DashboardRow` | `{ item: DashboardRowItem }` | `molecules/DashboardRow.tsx` |
| `NavLink` | `{ item: NavLinkItem }` | `molecules/NavLink.tsx` |
| `SocialIcon` | `{ item: SocialLinkItem }` | `molecules/SocialIcon.tsx` |
| `FooterColumn` | `{ column: FooterColumnData }` | `molecules/FooterColumn.tsx` |

| Organism | Props Interface | File |
|----------|----------------|------|
| `Navbar` | `{ user: PublicUser \| null; onLogin: () => void; onRegister: () => void }` | `organisms/Navbar.tsx` |
| `Hero` | `{ user: PublicUser \| null; onRegister: () => void }` | `organisms/Hero.tsx` |
| `Features` | `{}` | `organisms/Features.tsx` |
| `UseCases` | `{}` | `organisms/UseCases.tsx` |
| `Demo` | `{}` | `organisms/Demo.tsx` |
| `Testimonials` | `{}` | `organisms/Testimonials.tsx` |
| `CTASection` | `{ user: PublicUser \| null; onLogin: () => void; onRegister: () => void }` | `organisms/CTASection.tsx` |
| `Footer` | `{}` | `organisms/Footer.tsx` |

**Existing components** (Button, Input, Label, Alert, Card, FormField, AuthForm, ProtectedRoute) MUST receive `Readonly<T>` prop interfaces and `forwardRef` removal in the rename-to-.tsx pass.

---

## TypeScript Migration Rules

### Requirement: TypeScript Strict Configuration

The frontend MUST have a `tsconfig.json` with `strict: true`, `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `noEmit: true`, and path alias `@/* → ./src/*`.

#### Scenario: tsc passes with zero errors

- GIVEN the `tsconfig.json` exists in `frontend/`
- WHEN `tsc --noEmit` runs from the frontend directory
- THEN it exits with code 0 and no type errors

#### Scenario: Vite resolves .tsx natively

- GIVEN `vite.config.js` has `@vitejs/plugin-react`
- WHEN a `.tsx` file is imported from another `.tsx` file
- THEN Vite resolves and compiles it without config changes

### Requirement: Prop Interface Convention

Every component MUST export a `Readonly<{ComponentName}Props>` interface. React 19 ref is passed as a regular prop — `forwardRef` MUST NOT be used.

#### Scenario: Component has typed props

- GIVEN a component `Stars.tsx`
- WHEN `tsc --noEmit` runs
- THEN the file exports `Readonly<StarsProps>` with `{ rating: number; size?: number }`
- AND no `forwardRef` call exists in the file

#### Scenario: Existing atoms updated

- GIVEN `Button.tsx` currently uses `forwardRef`
- WHEN it is renamed to `.tsx` with prop types
- THEN `forwardRef` is removed and ref is a regular prop
- AND the component still renders correctly with `variant` and `size` props

---

## Atomic Design Structure

Components follow `components/{atoms,molecules,organisms}/`. Each file exports a single named component. No barrel `index.ts` files.

---

## Data Extraction Format

All hardcoded arrays and objects move to `src/data/landing.ts`. Each array has a corresponding TypeScript interface. Components import data via `import { problems } from '@/data/landing'`.

---

## CSS Extraction Rules

Inline `<style>` tags from Landing MUST move to `src/index.css` inside `@layer components`. Specifically:
- `.nav-link::after` and `.nav-link:hover::after` (animated underline)
- `.dot-pattern` (CTA background)

---

## Dynamic Tailwind Class Fix Rules

**Problem**: Patterns like `` `bg-${bg}/10` `` and `` `text-${color}` `` break Tailwind JIT because the full class name is invisible at scan time.

**Solution**: Replace ALL dynamic class interpolation with explicit class maps.

| Location | Dynamic Pattern | Replacement |
|----------|----------------|-------------|
| Hero metrics | `` `bg-${metric.bg}/10` `` | Class map keyed by metric name |
| Hero rows | `` `text-${row.color}` `` | Class map keyed by row label |
| Demo sidebar | Dynamic nav class | Static class per item type |

---

## Acceptance Criteria Per Slice

### Slice 1: TS Config + Rename Existing
- [ ] `tsconfig.json` exists with strict mode
- [ ] `vite-env.d.ts` references Vite client types
- [ ] All existing `.jsx` files renamed to `.tsx`
- [ ] All existing components have `Readonly<T>` props
- [ ] `forwardRef` removed from all atoms
- [ ] `cn.js` → `cn.ts` with `ClassValue` typing
- [ ] `tsc --noEmit` passes, `npm run build` succeeds

### Slice 2: Data + Animations
- [ ] `src/data/landing.ts` exists with all 12 data arrays typed
- [ ] `src/lib/animations.ts` exports `fadeInUp` and `stagger`
- [ ] No UI changes — purely additive data layer

### Slice 3: Atoms + Molecules (10 components)
- [ ] 2 atoms + 8 molecules created with typed props
- [ ] Each component is ≤80 lines
- [ ] Each has at least one Given/When/Then testable scenario

### Slice 4: Organisms (8 components)
- [ ] 8 organisms created, each composing atoms/molecules
- [ ] Each organism is ≤120 lines
- [ ] Data imports from `@/data/landing`

### Slice 5: Landing Orchestrator + CSS + Tailwind Fix
- [ ] `Landing.tsx` is ≤60 lines
- [ ] Zero inline `<style>` tags in any component
- [ ] Zero dynamic Tailwind class interpolation
- [ ] `.nav-link::after` and `.dot-pattern` in `index.css` `@layer components`
- [ ] `tsc --noEmit` passes, `npm run build` succeeds
- [ ] Landing renders identically to original

---

## Global Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| TypeScript strict | `tsc --noEmit` exits 0 |
| Build | `npm run build` succeeds |
| Visual parity | Landing renders identically |
| Prop interfaces | 100% components have `Readonly<T>` |
| No forwardRef | Zero usage across codebase |
| No dynamic interpolation | Zero `bg-${x}` or `text-${x}` patterns |
| Landing size | `Landing.tsx` ≤ 60 lines |
