# Design: Landing Page TypeScript Refactor

## Technical Approach

Decompose the 674-line `Landing.jsx` monolith into atomic-design components (2 atoms, 8 molecules, 8 organisms) with a ~50-line orchestrator. Add `tsconfig.json` with strict mode for the React/Vite frontend. Extract hardcoded data into `src/data/landing.ts` and animation helpers into `src/lib/animations.ts`. Fix broken dynamic Tailwind classes with explicit class maps. Migrate all `.jsx` → `.tsx` with `Readonly<T>` prop interfaces and remove `forwardRef` (React 19 passes ref as regular prop).

## Architecture Decisions

### Decision: TypeScript Config Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Mirror backend tsconfig | Over-constrains frontend (commonjs, no JSX emit) | — |
| Vite-native config (noEmit, bundler resolution) | Correct for Vite; type-check only, no compile | **Chosen** |
| Skip tsconfig, rely on editor inference | No `tsc --noEmit` CI gate | — |

**Rationale**: Vite does the building. `tsconfig.json` is for type-checking only. Use `noEmit: true`, `jsx: "react-jsx"`, `module: "ESNext"`, `moduleResolution: "bundler"`. Add `paths: { "@/*": ["./src/*"] }` for clean imports. Reference `@types/react` and `@types/react-dom` already in devDeps.

### Decision: forwardRef Removal

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Keep forwardRef during refactor | Less churn, backward-compat | — |
| Remove forwardRef (React 19 native ref prop) | Modernizes code, no external refs exist | **Chosen** |

**Rationale**: No component in the project is currently `ref`-forwarded to. React 19 passes `ref` as a regular prop. Removing `forwardRef` simplifies the component signature and eliminates an import. Follows the `tailwind-design-system` skill pattern (React 19, no forwardRef).

### Decision: Dynamic Tailwind Fix Approach

| Option | Tradeoff | Decision |
|--------|----------|----------|
| safelist in tailwind config | Still v4 CSS-first, no JS config to safelist | — |
| Static class maps | Explicit, JIT-safe, zero runtime cost | **Chosen** |
| CSS custom properties | More indirection, harder to read | — |

**Rationale**: The pattern `` `bg-${bg}/10` `` (Landing L308) and `` `text-${color}` `` (L328) break Tailwind JIT because the full class name isn't visible at scan time. Replace with explicit `Record<string, string>` maps. Example:

```ts
const metricColorMap: Record<string, { bg: string; text: string }> = {
  'primary': { bg: 'bg-primary/10', text: 'text-primary' },
  'success': { bg: 'bg-success/10', text: 'text-success' },
  'danger':  { bg: 'bg-danger/10',  text: 'text-danger' },
}
```

### Decision: Inline CSS → index.css Extraction

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Keep inline `<style>` tag | Simpler but blocks concurrent rendering | — |
| Move to `@layer components` in index.css | Consistent with existing `.auth-grid-bg` pattern | **Chosen** |

**Rationale**: The project already uses `@layer components` for `.auth-grid-bg`. The landing CSS (`.nav-link::after`, `.dot-pattern`) follows the same pattern. Extract into the same layer.

### Decision: File Rename Cascade Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Rename all .jsx → .tsx atomically | Big-bang, hard to verify | — |
| Incremental: rename per slice | Coexistence works (Vite resolves both), but import paths need updating | **Chosen** |
| Only rename landing-affected files | Leaves inconsistency | — |

**Rationale**: Vite handles `.jsx`/`.tsx` coexistence natively. Rename files incrementally per PR slice. Update import paths as each file is touched. `App.jsx` → `App.tsx`, `main.jsx` → `main.tsx`, etc. in the first slice.

## Data Flow

```
Landing.tsx (orchestrator)
  ├── Navbar.tsx          ← reads navLinks from data/landing.ts
  ├── Hero.tsx            ← reads dashboardMetrics, dashboardRows
  ├── Features.tsx        ← reads problems
  ├── UseCases.tsx        ← reads useCases
  ├── Demo.tsx            ← reads demoNavItems, demoActivityFeed
  ├── Testimonials.tsx    ← reads testimonials, companyLogos
  ├── CTASection.tsx      ← reads nothing (auth-aware only)
  └── Footer.tsx          ← reads footerColumns, socialLinks

data/landing.ts            ← all 12 typed data arrays
lib/animations.ts          ← fadeInUp, stagger()
lib/cn.ts                  ← cn() with ClassValue typing
```

All organisms receive data via props. The orchestrator reads from `data/landing.ts` and passes slices down. Auth state (`useAuth()`) is consumed only by `Navbar`, `Hero`, `CTASection`, and `Landing.tsx` itself.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/tsconfig.json` | Create | Strict TS config for Vite/React |
| `frontend/src/vite-env.d.ts` | Create | Vite client types reference |
| `frontend/src/data/landing.ts` | Create | 12 typed data arrays + interfaces |
| `frontend/src/lib/animations.ts` | Create | fadeInUp, stagger() helpers |
| `frontend/src/lib/cn.ts` | Rename+Modify | cn.js → cn.ts with ClassValue type |
| `frontend/src/components/atoms/Button.tsx` | Rename+Modify | .jsx → .tsx, remove forwardRef, add ButtonProps |
| `frontend/src/components/atoms/Input.tsx` | Rename+Modify | .jsx → .tsx, remove forwardRef, add InputProps |
| `frontend/src/components/atoms/Label.tsx` | Rename+Modify | .jsx → .tsx, add LabelProps |
| `frontend/src/components/atoms/Alert.tsx` | Rename+Modify | .jsx → .tsx, add AlertProps |
| `frontend/src/components/atoms/Stars.tsx` | Create | 5-star rating from Landing L18-26 |
| `frontend/src/components/atoms/SectionHeader.tsx` | Create | Reusable eyebrow+h2+subtitle |
| `frontend/src/components/molecules/Card.tsx` | Rename+Modify | .jsx → .tsx, add CardProps |
| `frontend/src/components/molecules/FormField.tsx` | Rename+Modify | .jsx → .tsx, add FormFieldProps |
| `frontend/src/components/molecules/ProblemCard.tsx` | Create | Before/after comparison (L370-403) |
| `frontend/src/components/molecules/UseCaseCard.tsx` | Create | Numbered use case card (L420-440) |
| `frontend/src/components/molecules/TestimonialCard.tsx` | Create | Quote + stars + avatar (L543-560) |
| `frontend/src/components/molecules/DashboardMetric.tsx` | Create | Hero stat card (L302-312) |
| `frontend/src/components/molecules/DashboardRow.tsx` | Create | Hero progress row (L318-330) |
| `frontend/src/components/molecules/NavLink.tsx` | Create | Nav button with ::after underline (L137-145) |
| `frontend/src/components/molecules/SocialIcon.tsx` | Create | SVG social icon link (L631-644) |
| `frontend/src/components/molecules/FooterColumn.tsx` | Create | Footer link column (L648-663) |
| `frontend/src/components/organisms/AuthForm.tsx` | Rename+Modify | .jsx → .tsx, add AuthFormProps |
| `frontend/src/components/organisms/Navbar.tsx` | Create | Fixed nav with scroll + mobile menu (L116-214) |
| `frontend/src/components/organisms/Hero.tsx` | Create | Hero with gradient + dashboard mockup (L217-353) |
| `frontend/src/components/organisms/Features.tsx` | Create | Problem vs Solution section (L356-406) |
| `frontend/src/components/organisms/UseCases.tsx` | Create | Use case grid (L409-444) |
| `frontend/src/components/organisms/Demo.tsx` | Create | Interactive demo mockup (L447-529) |
| `frontend/src/components/organisms/Testimonials.tsx` | Create | Testimonials + logos (L532-575) |
| `frontend/src/components/organisms/CTASection.tsx` | Create | Final CTA (L577-612) |
| `frontend/src/components/organisms/Footer.tsx` | Create | Full footer (L614-671) |
| `frontend/src/components/ProtectedRoute.tsx` | Rename+Modify | .jsx → .tsx, add ProtectedRouteProps |
| `frontend/src/pages/Landing.tsx` | Rewrite | ~50-line orchestrator composing organisms |
| `frontend/src/pages/Login.tsx` | Rename | .jsx → .tsx (no logic change) |
| `frontend/src/pages/Register.tsx` | Rename | .jsx → .tsx (no logic change) |
| `frontend/src/pages/Dashboard.tsx` | Rename | .jsx → .tsx (no logic change) |
| `frontend/src/context/auth-context.ts` | Rename | .js → .ts, add AuthContextType |
| `frontend/src/context/AuthContext.tsx` | Rename+Modify | .jsx → .tsx, add AuthProviderProps |
| `frontend/src/App.tsx` | Rename | .jsx → .tsx (no logic change) |
| `frontend/src/main.tsx` | Rename | .jsx → .tsx (no logic change) |
| `frontend/src/index.css` | Modify | Add `.nav-link::after` and `.dot-pattern` to `@layer components` |

## Interfaces / Contracts

### Data Types (`src/data/landing.ts`)

```ts
export interface Problem {
  before: string
  after: string
}

export interface UseCase {
  num: number
  numClass: string
  title: string
  body: string
  tags: string[]
  tagClass: string
}

export interface Testimonial {
  quote: string
  initials: string
  name: string
  role: string
  avatarBg: string
}

export interface NavLink {
  label: string
  target: string
}

export interface MetricColor {
  bg: string
  text: string
}

export interface DashboardRowData {
  name: string
  pct: string
  margin: string
  color: string
}

export interface ActivityItem {
  dot: string
  text: string
  time: string
}

export interface SocialLink {
  d: string
  label: string
}

export interface FooterColumnData {
  title: string
  links: string[]
}
```

### Component Props Pattern

Every component follows this pattern (no `forwardRef`):

```ts
interface ComponentNameProps {
  // explicit props with Readonly
  className?: string
}

export function ComponentName({ className, ...props }: Readonly<ComponentNameProps>) {
  return <div className={cn('...', className)} {...props} />
}
```

### Animation Types (`src/lib/animations.ts`)

```ts
import type { HTMLMotionProps } from 'framer-motion'

type FadeInUpProps = HTMLMotionProps<'div'>

export const fadeInUp: FadeInUpProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, ease: 'easeOut' },
}

export function stagger(i: number): FadeInUpProps {
  return { ...fadeInUp, transition: { ...fadeInUp.transition, delay: i * 0.1 } }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Type Check | `tsc --noEmit` zero errors | CLI after each slice |
| Build | `npm run build` succeeds | CLI after each slice |
| Visual | Landing renders identically | Manual visual diff before/after each slice |
| Component | Each extracted organism renders | Manual: open localhost, navigate to `/`, verify each section |

No test runner (project convention: "NO hay tests — verificación = lint + smoke manual").

## Migration / Rollout

### Chained PR Strategy (5 slices, each ≤400 lines)

| PR | Scope | Verification |
|----|-------|-------------|
| 1 | `tsconfig.json` + `vite-env.d.ts` + rename existing `.jsx` → `.tsx` + prop interfaces + remove `forwardRef` + `cn.ts` | `tsc --noEmit` + `npm run build` |
| 2 | `src/data/landing.ts` + `src/lib/animations.ts` | `tsc --noEmit` (data only, no UI change) |
| 3 | New atoms (Stars, SectionHeader) + molecules (ProblemCard, UseCaseCard, TestimonialCard, DashboardMetric, DashboardRow, NavLink, SocialIcon, FooterColumn) | `tsc --noEmit` + components render |
| 4 | New organisms (Navbar, Hero, Features, UseCases, Demo, Testimonials, CTASection, Footer) | Visual diff each section |
| 5 | Slim `Landing.tsx` orchestrator + CSS extraction + Tailwind fix | Full visual diff, `npm run build` |

### Rollback Plan

Git revert per PR slice. Each slice is autonomous — reverting one doesn't break others. Worst case: revert entire branch, Landing.jsx unchanged.

No data migration required. No feature flags needed.

## Open Questions

- [ ] None — all decisions resolved from exploration and proposal analysis.
