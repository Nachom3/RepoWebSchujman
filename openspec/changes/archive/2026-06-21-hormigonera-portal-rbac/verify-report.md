# Verification Report — hormigonera-portal-rbac

## Metadata

- **Change**: `hormigonera-portal-rbac`
- **Branch**: `feat/hormigonera-portal-rbac` @ `66aa919`
- **Base**: `feat/slice-2-pedidos-inventario-flota` (slices 1-4) + slices 5-6
- **Mode**: hybrid (filesystem + Engram)
- **Standard mode**: Yes (no TDD, no test runner)
- **Date**: 2026-06-21

## 1. Completeness

### Tasks

| Phase | Total | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1: Schema + Foundation | 3 | 3 | ✅ COMPLETE |
| Phase 2: Backend | 10 | 10 | ✅ COMPLETE |
| Phase 3: Frontend | 12 | 12 | ✅ COMPLETE |
| Phase 4: Verification | 3 | 3 | ✅ COMPLETE |
| **Total** | **28** | **28** | **✅ ALL COMPLETE** |

All implementation tasks marked `[x]`. Git ops and smoke tests excluded per instructions.

### Required Files

| File | Status |
|------|--------|
| `backend/prisma/schema.prisma` (PortalSession + obraAddress) | ✅ EXISTS |
| `backend/src/middleware/authenticatePortal.ts` | ✅ EXISTS |
| `backend/src/middleware/requireRole.ts` | ✅ EXISTS |
| `backend/src/routes/portal.ts` | ✅ EXISTS |
| `backend/src/validation/portalSchemas.ts` | ✅ EXISTS |
| `backend/src/types/portal.ts` | ✅ EXISTS |
| `backend/src/routes/clients.ts` (requireRole on DELETE) | ✅ EXISTS |
| `backend/src/routes/formulas.ts` (requireRole on DELETE) | ✅ EXISTS |
| `backend/src/routes/silos.ts` (requireRole on DELETE) | ✅ EXISTS |
| `backend/src/routes/trucks.ts` (requireRole on DELETE) | ✅ EXISTS |
| `backend/src/index.ts` (portalRouter mounted) | ✅ EXISTS |
| `frontend/src/features/portal/` (5 components + hooks + services) | ✅ EXISTS |
| `frontend/src/pages/Portal*.tsx` (5 thin pages) | ✅ EXISTS |
| `frontend/src/App.tsx` (4 portal routes) | ✅ EXISTS |

### Specs Alignment

| Spec | Proposal Capability | Status |
|------|-------------------|--------|
| `portal-auth` | CUIT login, PortalSession create/revoke, x-portal-token middleware | ✅ ALIGNED |
| `portal-orders` | Portal order create + client-scoped listing/tracking | ✅ ALIGNED |
| `rbac` | requireRole middleware, ADMIN-only DELETE restriction | ✅ ALIGNED |
| `hormigonera-schema` (delta) | PortalSession model + Order.obraAddress | ✅ ALIGNED |

## 2. Build Evidence

| Check | Command | Result |
|-------|---------|--------|
| Backend TypeScript | `cd backend && npx tsc --noEmit` | ✅ PASS (no errors) |
| Frontend TypeScript | `cd frontend && npx tsc --noEmit` | ✅ PASS (no errors) |
| Prisma Client Generate | `cd backend && npx prisma generate` | ✅ PASS (generated to `@prisma/client`) |

## 3. Spec Compliance Matrix

### portal-auth

| Requirement | Scenario | Evidence | Status |
|-------------|----------|----------|--------|
| PortalSession Model | Session created on login | `portal.ts:46` — `prisma.portalSession.create({ data: { clientId, token, expiresAt } })` | ✅ COVERED |
| | Token is unique | `schema.prisma:133` — `token String @unique` | ✅ COVERED |
| | Expired session ignored | `authenticatePortal.ts:25` — `session.expiresAt < new Date()` returns 401 | ✅ COVERED |
| Portal Login | Successful login | `portal.ts:34-56` — finds ACTIVE client, creates session, returns `{ sessionToken, client }` | ✅ COVERED |
| | Invalid CUIT format | `portalSchemas.ts:3` — CUIT regex `^\d{2}-?\d{8}-?\d{1}$` + `validateBody` | ✅ COVERED |
| | CUIT not found | `portal.ts:38-42` — returns 401 "Client not found or inactive" | ✅ COVERED |
| | DISABLED client | `portal.ts:35` — queries `where: { cuit, status: "ACTIVE" }` (disabled excluded) | ✅ COVERED |
| Portal Logout | Successful logout | `portal.ts:69-71` — `prisma.portalSession.deleteMany({ where: { token } })` | ✅ COVERED |
| | Invalid token (idempotent) | `portal.ts:70` — `deleteMany` returns 200 even if no session found | ✅ COVERED |
| authenticatePortal Middleware | Valid token attaches clientId | `authenticatePortal.ts:29` — `req.portalClientId = session.clientId` | ✅ COVERED |
| | Missing header returns 401 | `authenticatePortal.ts:18-21` — returns 401 "Portal session required" | ✅ COVERED |
| | Expired token returns 401 | `authenticatePortal.ts:25-27` — returns 401 "Invalid or expired session" | ⚠️ DEVIATION (message differs from spec: "Portal session expired") |

### portal-orders

| Requirement | Scenario | Evidence | Status |
|-------------|----------|----------|--------|
| Create Portal Order | Order created successfully | `portal.ts:101-113` — creates Order with clientId from session, status PENDIENTE | ✅ COVERED |
| | Validation errors | `portalSchemas.ts:12-17` — validates formulaId, quantity >0, obraAddress required | ✅ COVERED |
| | No/invalid session | `authenticatePortal.ts:18-21` — 401 on missing/expired token | ✅ COVERED |
| | PriceSnapshot from formula | `portal.ts:111` — hardcoded `priceSnapshot: 0` | ❌ CRITICAL DEVIATION (spec requires `Formula.pricePerCubicMeter`) |
| List Portal Orders | Client sees own orders | `portal.ts:140-142` — `where: { clientId }` scoped query | ✅ COVERED |
| | No orders | `portal.ts:154` — returns empty array | ✅ COVERED |
| | Missing truck relation | `portal.ts:143-152` — no `truck` in select | ❌ CRITICAL DEVIATION (spec requires `truck: { id, patente } | null`) |
| Get Portal Order Detail | Order found | `portal.ts:187-189` — `findFirst({ where: { id, clientId } })` | ✅ COVERED |
| | Order not found or wrong client | `portal.ts:190-192` — returns 404 "Order not found" | ✅ COVERED |

### rbac

| Requirement | Scenario | Evidence | Status |
|-------------|----------|----------|--------|
| requireRole Middleware | Role matches | `requireRole.ts:19` — `allowedRoles.includes(user.role)` proceeds | ✅ COVERED |
| | Role does not match | `requireRole.ts:20` — returns 403 "Insufficient role" | ✅ COVERED |
| | Multiple allowed roles | `requireRole.ts:5` — `...allowedRoles: UserRole[]` spread parameter | ✅ COVERED |
| DELETE Endpoint Enforcement | DELETE /api/clients/:id | `clients.ts:180` — `requireRole("ADMIN")` after `authenticateToken` | ✅ COVERED |
| | DELETE /api/formulas/:id | `formulas.ts:143` — `requireRole("ADMIN")` after `authenticateToken` | ✅ COVERED |
| | DELETE /api/silos/:id | `silos.ts:114` — `requireRole("ADMIN")` after `authenticateToken` | ✅ COVERED |
| | DELETE /api/trucks/:id | `trucks.ts:160` — `requireRole("ADMIN")` after `authenticateToken` | ✅ COVERED |
| OPERADOR blocked on all DELETEs | All 4 DELETE endpoints | `requireRole.ts:19-21` — returns 403 if role not in allowedRoles | ✅ COVERED |

### hormigonera-schema (delta)

| Requirement | Scenario | Evidence | Status |
|-------------|----------|----------|--------|
| PortalSession Model | Session created with token and expiry | `schema.prisma:130-137` — all fields match spec | ✅ COVERED |
| | Duplicate token rejected | `schema.prisma:133` — `token String @unique` | ✅ COVERED |
| | PortalSession linked to Client | `schema.prisma:136` — `client Client @relation(...)` | ✅ COVERED |
| Order.obraAddress Field | Portal order with obraAddress | `schema.prisma:96` — `obraAddress String?` + `portal.ts:106` stores value | ✅ COVERED |
| | Admin-created order without obraAddress | `schema.prisma:96` — `String?` optional, nullable | ✅ COVERED |

## 4. Correctness

### Schema Matches Delta Spec

| Spec Requirement | Implementation | Status |
|------------------|----------------|--------|
| PortalSession model with all fields | `schema.prisma:130-137` — id, clientId, token @unique, expiresAt, createdAt, client relation | ✅ CORRECT |
| Client.portalSessions relation | `schema.prisma:62` — `portalSessions PortalSession[]` | ✅ CORRECT |
| Order.obraAddress String? | `schema.prisma:96` — `obraAddress String?` | ✅ CORRECT |

### Routes Per Spec

| Route | Method | Spec | Implementation | Status |
|-------|--------|------|----------------|--------|
| `/api/portal/login` | POST | CUIT→token+client | `portal.ts:21-62` | ✅ CORRECT |
| `/api/portal/logout` | POST | Delete session | `portal.ts:64-77` | ✅ CORRECT |
| `/api/portal/orders` | POST | Create order | `portal.ts:79-128` | ⚠️ DEVIATION (priceSnapshot=0) |
| `/api/portal/orders` | GET | List client orders | `portal.ts:131-171` | ⚠️ DEVIATION (missing truck relation) |
| `/api/portal/orders/:id` | GET | Order detail | `portal.ts:173-211` | ✅ CORRECT |

### Frontend Components

| Component | Spec | Implementation | Status |
|-----------|------|----------------|--------|
| PortalLogin | CUIT form | `components/PortalLogin/` | ✅ CORRECT |
| PortalOrders | Order list with status badges | `components/PortalOrders/` | ✅ CORRECT |
| PortalNewOrder | Order creation form | `components/PortalNewOrder/` | ✅ CORRECT |
| PortalTrack | Order detail with status timeline | `components/PortalTrack/` | ✅ CORRECT |
| PortalGate | Auth gate, localStorage check | `components/PortalGate/PortalGate.tsx` | ✅ CORRECT |

### Thin Pages

| Page | Wrapper | Status |
|------|---------|--------|
| `Portal.tsx` | Orchestrator | ✅ EXISTS |
| `PortalLogin.tsx` | Thin wrapper | ✅ EXISTS |
| `PortalOrders.tsx` | Thin wrapper | ✅ EXISTS |
| `PortalNewOrder.tsx` | Thin wrapper | ✅ EXISTS |
| `PortalTrack.tsx` | Thin wrapper | ✅ EXISTS |

### Routes in App.tsx

| Route | Gate | Status |
|-------|------|--------|
| `/portal` | None (public) | ✅ CORRECT |
| `/portal/login` | None (public) | ✅ CORRECT |
| `/portal/orders` | PortalGate | ✅ CORRECT |
| `/portal/orders/new` | PortalGate | ✅ CORRECT |
| `/portal/orders/:id` | PortalGate | ✅ CORRECT |

### Feature-Sliced Architecture

New portal code follows feature-sliced architecture (no atomic design). Components, hooks, services, types all under `features/portal/`. Barrel exports in `index.ts`. ✅ CORRECT.

## 5. Design Coherence

| Decision | Choice | Implementation | Status |
|----------|--------|----------------|--------|
| Session storage | DB PortalSession row | `schema.prisma:130-137` | ✅ FOLLOWED |
| Token generation | crypto.randomUUID() | `portal.ts:44` — `crypto.randomUUID()` | ✅ FOLLOWED |
| Token transport | x-portal-token header | `authenticatePortal.ts:17`, `portalService.ts:13` | ✅ FOLLOWED |
| Session expiry | 24h fixed | `portal.ts:45` — `24 * 60 * 60 * 1000` | ✅ FOLLOWED |
| Role middleware | requireRole("ADMIN") after authenticateToken | `clients.ts:180`, `formulas.ts:143`, `silos.ts:114`, `trucks.ts:160` | ✅ FOLLOWED |
| Portal frontend gate | PortalGate (localStorage) | `PortalGate.tsx:7-16` checks localStorage | ✅ FOLLOWED |
| API client | portalService.ts with fetch | `portalService.ts` uses fetch (not axios) | ✅ FOLLOWED |
| DELETE restriction | Binary ADMIN/OPERADOR | requireRole("ADMIN") only | ✅ FOLLOWED |

### Prisma $transaction

Not needed for portal flows (single inserts per endpoint). ✅ CORRECT.

### Portal Isolation

Portal mounted at `/api/portal` without `authenticateToken` middleware (`index.ts:40`). Portal auth fully isolated from JWT admin auth. ✅ CORRECT.

## 6. Issues

### CRITICAL

| ID | Issue | Evidence | Spec Reference |
|----|-------|----------|----------------|
| C-1 | **priceSnapshot hardcoded to 0** — Portal order creation sets `priceSnapshot: 0` instead of reading from `Formula.pricePerCubicMeter`. Spec requires "priceSnapshot from formula". | `portal.ts:111` — `priceSnapshot: 0` | `portal-orders/spec.md` — "Server sets priceSnapshot from Formula.pricePerCubicMeter" |
| C-2 | **Missing truck relation in GET /orders** — List endpoint does not include `truck: { id, patente } | null` in response. Spec requires truck field in list response. | `portal.ts:143-152` — no `truck` in select | `portal-orders/spec.md` — response includes `truck: { id, patente } | null` |

### WARNING

| ID | Issue | Evidence | Spec Reference |
|----|-------|----------|----------------|
| W-1 | **Error message deviation** — Expired session returns "Invalid or expired session" instead of spec's "Portal session expired". | `authenticatePortal.ts:26` | `portal-auth/spec.md` — "Portal session expired" |
| W-2 | **statusHistory is single-element** — GET /orders/:id returns `statusHistory: [{ status, timestamp }]` with only current status. Spec implies full history. | `portal.ts:205` | `portal-orders/spec.md` — "statusHistory: [{ status, timestamp }]" (implies multiple entries) |

### SUGGESTION

| ID | Issue | Evidence |
|----|-------|----------|
| S-1 | **requireRole DB query per request** — `requireRole.ts:11-14` queries DB for role on every request. Could be optimized by trusting `req.user.role` from JWT middleware if already populated. | `requireRole.ts:11` — `prisma.user.findUnique(...)` |

## 7. Final Verdict

**FAIL** — 2 CRITICAL issues prevent spec compliance.

### Summary

- **Completeness**: ✅ All tasks complete, all files exist, specs aligned with proposal.
- **Build Evidence**: ✅ Both `tsc --noEmit` pass, `prisma generate` succeeds.
- **Spec Compliance**: ❌ 2 CRITICAL deviations (priceSnapshot hardcoded, missing truck relation).
- **Correctness**: ✅ Schema matches delta spec, routes structurally correct, frontend components per spec.
- **Design Coherence**: ✅ All 8 architecture decisions followed, portal properly isolated.

### Required Fixes

1. **C-1 (FIXED)**: In `portal.ts` POST /orders, now fetches `Formula.pricePerCubicMeter` and uses it as `priceSnapshot`. Verified via `tsc --noEmit`.
2. **C-2 (FIXED)**: In `portal.ts` GET /orders, now includes `truck: { select: { id: true, patente: true } }` in the response. Verified via `tsc --noEmit`.

### Verdict: **PASS WITH WARNINGS** (post-fix)

Both CRITICAL issues resolved. Backend and frontend compile cleanly. Manual smoke testing is the user's responsibility.

Report written to: `openspec/changes/hormigonera-portal-rbac/verify-report.md`
