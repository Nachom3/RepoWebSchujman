# Tasks: Landing Page TypeScript Refactor

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1450 (15 renamed + 20 new files) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 → PR 5 (stacked-to-main) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | TS config + rename existing .jsx→.tsx + prop interfaces + forwardRef removal + cn.ts | PR 1 (~370 lines) | Foundation; no new UI. Must pass `tsc --noEmit`. |
| 2 | Data layer + animation helpers | PR 2 (~220 lines) | Purely additive, no UI changes. Depends on PR 1 types. |
| 3 | New atoms + molecules (10 components) | PR 3 (~650 lines) | Depends on PR 2 data imports. |
| 4 | New organisms (8 components) | PR 4 (~800 lines) | Depends on PR 3 atoms/molecules. |
| 5 | Landing orchestrator + CSS extraction + Tailwind fix | PR 5 (~150 lines) | Final integration. Depends on PR 3+4. |

---

## Phase 1: TypeScript Foundation (PR 1)

- [ ] 1.1 Create `frontend/tsconfig.json` — `strict: true`, `jsx: "react-jsx"`, `module: "ESNext"`, `moduleResolution: "bundler"`, `noEmit: true`, `paths: { "@/*": ["./src/*"] }`, `include: ["src"]`, `types: ["vite/client"]`
- [ ] 1.2 Create `frontend/src/vite-env.d.ts` — `/// <reference types="vite/client" />`
- [ ] 1.3 Rename `frontend/src/lib/cn.js` → `cn.ts`, add `import { type ClassValue } from 'clsx'`, type `cn` params as `ClassValue[]`, return `string`
- [ ] 1.4 Rename `frontend/src/components/atoms/Button.jsx` → `.tsx` — add `Readonly<ButtonProps>` interface with `variant`, `size`, `className`, `children`, `ref?`; remove `forwardRef`
- [ ] 1.5 Rename `frontend/src/components/atoms/Input.jsx` → `.tsx` — add `Readonly<InputProps>` with `type`, `error`, `className`, `ref?`; remove `forwardRef`
- [ ] 1.6 Rename `frontend/src/components/atoms/Label.jsx` → `.tsx` — add `Readonly<LabelProps>` with `className`, `children`
- [ ] 1.7 Rename `frontend/src/components/atoms/Alert.jsx` → `.tsx` — add `Readonly<AlertProps>` with `variant`, `className`, `children`
- [ ] 1.8 Rename `frontend/src/components/molecules/Card.jsx` → `.tsx` — add `Readonly<CardProps>` with `surface`, `className`, `children`
- [ ] 1.9 Rename `frontend/src/components/molecules/FormField.jsx` → `.tsx` — add `Readonly<FormFieldProps>` with `label`, `error`, `className`, `children`
- [ ] 1.10 Rename `frontend/src/components/organisms/AuthForm.jsx` → `.tsx` — add `Readonly<AuthFormProps>` with `accent`, `onSubmit`
- [ ] 1.11 Rename `frontend/src/components/ProtectedRoute.jsx` → `.tsx` — add `Readonly<ProtectedRouteProps>` with `children`
- [ ] 1.12 Rename `frontend/src/context/AuthContext.jsx` → `.tsx` — add `Readonly<AuthProviderProps>` with `children`
- [ ] 1.13 Rename `frontend/src/context/auth-context.js` → `auth-context.ts` — add `AuthContextType` interface with `user`, `isAuthenticated`, `loading`, `login`, `register`, `logout`
- [ ] 1.14 Rename `frontend/src/pages/Login.jsx` → `.tsx`, `Register.jsx` → `.tsx`, `Dashboard.jsx` → `.tsx` — add minimal prop types
- [ ] 1.15 Rename `frontend/src/App.jsx` → `.tsx`, `main.jsx` → `.tsx` — add route component types
- [ ] 1.16 Run `npx tsc --noEmit` from `frontend/` — verify zero errors
- [ ] 1.17 Run `npm run build` from `frontend/` — verify build succeeds

## Phase 2: Data Layer + Animations (PR 2)

- [ ] 2.1 Create `frontend/src/data/landing.ts` — export interfaces: `Problem`, `UseCase`, `Testimonial`, `NavLink`, `MetricColor`, `DashboardRowData`, `ActivityItem`, `SocialLink`, `FooterColumnData`, `MetricItem`, `DemoNavItem`, `CompanyLogo`
- [ ] 2.2 Populate `landing.ts` with all 12 typed data arrays extracted from `Landing.jsx` lines 18-110 (problems, useCases, testimonials, navLinks, dashboardMetrics, dashboardRows, demoActivityFeed, demoNavItems, footerColumns, socialLinks, companyLogos, metricColorMap)
- [ ] 2.3 Create `frontend/src/lib/animations.ts` — export `fadeInUp(): Variant` and `stagger(i: number): Variant` using framer-motion `Variants`
- [ ] 2.4 Verify: `npx tsc --noEmit` passes with zero errors

## Phase 3: Atoms + Molecules (PR 3)

- [ ] 3.1 Create `frontend/src/components/atoms/Stars.tsx` — `Readonly<StarsProps>` with `rating: number; size?: number`; renders 5 star SVGs using lucide-react `Star` icon
- [ ] 3.2 Create `frontend/src/components/atoms/SectionHeader.tsx` — `Readonly<SectionHeaderProps>` with `eyebrow: string; title: string; subtitle?: string`; reusable eyebrow+h2+subtitle block
- [ ] 3.3 Create `frontend/src/components/molecules/ProblemCard.tsx` — `Readonly<ProblemCardProps>` with `item: Problem; index: number`; before/after comparison card from Landing L370-403
- [ ] 3.4 Create `frontend/src/components/molecules/UseCaseCard.tsx` — `Readonly<UseCaseCardProps>` with `item: UseCase; index: number`; numbered use case card from Landing L420-440
- [ ] 3.5 Create `frontend/src/components/molecules/TestimonialCard.tsx` — `Readonly<TestimonialCardProps>` with `item: Testimonial`; quote + stars + avatar from Landing L543-560
- [ ] 3.6 Create `frontend/src/components/molecules/DashboardMetric.tsx` — `Readonly<DashboardMetricProps>` with `item: MetricItem`; hero stat card from Landing L302-312. Use `metricColorMap` from data/landing.ts (no dynamic Tailwind interpolation)
- [ ] 3.7 Create `frontend/src/components/molecules/DashboardRow.tsx` — `Readonly<DashboardRowProps>` with `item: DashboardRowData`; hero progress row from Landing L318-330. Use explicit class map from data/landing.ts
- [ ] 3.8 Create `frontend/src/components/molecules/NavLink.tsx` — `Readonly<NavLinkProps>` with `item: NavLinkItem`; nav button with CSS `::after` underline animation
- [ ] 3.9 Create `frontend/src/components/molecules/SocialIcon.tsx` — `Readonly<SocialIconProps>` with `item: SocialLink`; SVG social icon link from Landing L631-644
- [ ] 3.10 Create `frontend/src/components/molecules/FooterColumn.tsx` — `Readonly<FooterColumnProps>` with `column: FooterColumnData`; footer link column from Landing L648-663
- [ ] 3.11 Verify: `npx tsc --noEmit` passes, `npm run build` succeeds

## Phase 4: Organisms (PR 4)

- [ ] 4.1 Create `frontend/src/components/organisms/Navbar.tsx` — `Readonly<NavbarProps>` with `user: PublicUser | null; onLogin; onRegister`; fixed nav + mobile menu from Landing L116-214. Compose `NavLink` molecule
- [ ] 4.2 Create `frontend/src/components/organisms/Hero.tsx` — `Readonly<HeroProps>` with `user; onRegister`; hero + dashboard mockup from Landing L217-353. Compose `DashboardMetric`, `DashboardRow` molecules. Use `fadeInUp`, `stagger` from animations.ts
- [ ] 4.3 Create `frontend/src/components/organisms/Features.tsx` — `Readonly<FeaturesProps>` with `{}`; Problem vs Solution section from Landing L356-406. Compose `SectionHeader`, `ProblemCard`
- [ ] 4.4 Create `frontend/src/components/organisms/UseCases.tsx` — `Readonly<UseCasesProps>` with `{}`; use case grid from Landing L409-444. Compose `SectionHeader`, `UseCaseCard`
- [ ] 4.5 Create `frontend/src/components/organisms/Demo.tsx` — `Readonly<DemoProps>` with `{}`; interactive demo mockup from Landing L447-529. Use explicit class maps for sidebar nav items (no dynamic interpolation)
- [ ] 4.6 Create `frontend/src/components/organisms/Testimonials.tsx` — `Readonly<TestimonialsProps>` with `{}`; testimonials + logos from Landing L532-575. Compose `SectionHeader`, `TestimonialCard`
- [ ] 4.7 Create `frontend/src/components/organisms/CTASection.tsx` — `Readonly<CTASectionProps>` with `user; onLogin; onRegister`; final CTA from Landing L577-612
- [ ] 4.8 Create `frontend/src/components/organisms/Footer.tsx` — `Readonly<FooterProps>` with `{}`; full footer from Landing L614-671. Compose `FooterColumn`, `SocialIcon`
- [ ] 4.9 Verify: `npx tsc --noEmit` passes, `npm run build` succeeds

## Phase 5: Integration + Cleanup (PR 5)

- [ ] 5.1 Rewrite `frontend/src/pages/Landing.tsx` as ~50-line orchestrator — import and compose all 8 organisms (Navbar, Hero, Features, UseCases, Demo, Testimonials, CTASection, Footer). Pass `user` and auth callbacks from `useAuth()`
- [ ] 5.2 Extract inline CSS from Landing: move `.nav-link::after`, `.nav-link:hover::after`, `.dot-pattern` to `frontend/src/index.css` inside `@layer components`
- [ ] 5.3 Audit all new components for dynamic Tailwind interpolation — replace any remaining `bg-${x}/10` or `text-${x}` with explicit class maps from `data/landing.ts`
- [ ] 5.4 Verify: `npx tsc --noEmit` passes, `npm run build` succeeds
- [ ] 5.5 Visual verification: `npm run dev` — landing renders identically to current version. Check each section: nav, hero, features, use cases, demo, testimonials, CTA, footer
