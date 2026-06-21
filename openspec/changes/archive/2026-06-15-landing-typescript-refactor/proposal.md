# Proposal: Landing Page TypeScript Refactor

## Intent

`Landing.jsx` is a 674-line monolith: 8 sections, inline sub-components, hardcoded data, dynamic Tailwind classes that break JIT, and inline `<style>` tags — all in zero-TypeScript frontend. Decompose into atomic design, add TS strict mode, fix Tailwind correctness.

## Scope

### In Scope
- Create `frontend/tsconfig.json` (strict, react-jsx, bundler resolution)
- Rename `.jsx` → `.tsx` (App, main, pages, components)
- Add `Readonly<T>` prop interfaces, remove `forwardRef` (React 19)
- Extract 12 data arrays → `src/data/landing.ts`
- Extract animation helpers → `src/lib/animations.ts`
- Extract 8 organisms, 9 molecules, 2 atoms from Landing
- Move inline CSS → `index.css` `@layer components`
- Fix dynamic Tailwind classes (`bg-${bg}/10`) with explicit class maps
- Add `vite-env.d.ts`

### Out of Scope
- Test runner addition (verification stays manual)
- Login/Register/Dashboard page refactoring
- Dark mode, API/backend changes, performance optimization

## Capabilities

### New Capabilities
- `landing-page-typescript`: TS-strict atomic decomposition with typed prop interfaces and data extraction
- `tailwind-jit-fix`: Explicit class maps replacing dynamic string interpolation that breaks JIT

### Modified Capabilities
None — no existing specs.

## Approach

**5 chained PRs** (each ≤400 lines):

| Slice | Content | ~Lines |
|-------|---------|--------|
| 1 | `tsconfig.json` + `vite-env.d.ts` + rename existing to `.tsx` + prop interfaces + remove `forwardRef` + `cn.ts` | 350 |
| 2 | `src/data/landing.ts` + `src/lib/animations.ts` (data + helpers, no UI) | 200 |
| 3 | New atoms (Stars, SectionHeader) + molecules (ProblemCard, UseCaseCard, TestimonialCard, DashboardMetric, DashboardRow, NavLink, SocialIcon, FooterColumn) | 350 |
| 4 | New organisms (Navbar, Hero, Features, UseCases, Demo, Testimonials, CTASection, Footer) | 400 |
| 5 | Slim `Landing.tsx` orchestrator (~50 lines) + CSS extraction + Tailwind fix | 150 |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/tsconfig.json` | New | Strict TS config |
| `frontend/src/data/landing.ts` | New | Data arrays + types |
| `frontend/src/lib/animations.ts` | New | fadeInUp, stagger |
| `frontend/src/lib/cn.ts` | Modified | cn.js → cn.ts, typed |
| `frontend/src/components/{atoms,molecules,organisms}/*` | Modified | .tsx, prop interfaces, no forwardRef |
| `frontend/src/pages/Landing.jsx` | Modified | ~50-line orchestrator |
| `frontend/src/index.css` | Modified | Landing CSS added |
| `frontend/src/App.jsx`, `main.jsx` | Modified | Rename to .tsx |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Visual regression (no test runner) | Medium | Manual visual diff each slice |
| Dynamic Tailwind fix bugs | Low | Explicit maps are strictly more correct |
| tsconfig misconfiguration | Low | Reference backend config |
| forwardRef removal breaks refs | Low | No current refs exist |

## Rollback Plan

Git revert per PR slice. Each slice is autonomous — reverting one doesn't break others. Worst case: revert entire branch, Landing.jsx unchanged.

## Dependencies

- `@types/react`, `@types/react-dom` already in devDeps ✓
- Vite supports .tsx natively ✓

## Success Criteria

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] Landing renders identically to current version
- [ ] All components have `Readonly<T>` prop interfaces
- [ ] Zero `forwardRef` usage, zero dynamic Tailwind interpolation, zero inline `<style>` tags
- [ ] `Landing.tsx` under 60 lines

## Proposal question round

Non-interactive run — assumptions needing user review:

1. **Scope**: Login/Register/Dashboard NOT migrated to TS. Acceptable?
2. **forwardRef removal**: React 19 passes ref as prop. No external refs exist — safe to remove?
3. **Data extraction**: All hardcoded data moves to `landing.ts`. Acceptable?
4. **No visual testing**: Manual verification per slice. Acceptable risk?
