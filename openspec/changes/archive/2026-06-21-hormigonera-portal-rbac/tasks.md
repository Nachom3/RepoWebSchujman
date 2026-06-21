# Tasks: Portal de Autogestión + Role-Based Authorization

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

Estimated changed lines: ~1100–1500. Delivery strategy: exception-ok.

## Phase 1: Schema + Foundation

- [x] 1.1 Add `PortalSession` model to `backend/prisma/schema.prisma` (id, clientId FK, token @unique, expiresAt, createdAt) + `Client.portalSessions` relation
- [x] 1.2 Add `obraAddress String?` field to Order model in `schema.prisma`
- [x] 1.3 Run `npx prisma generate` and `npx prisma db push`

## Phase 2: Backend

- [x] 2.1 Create `backend/src/middleware/authenticatePortal.ts` — reads `x-portal-token`, DB lookup, expiry check, attaches `req.portalClientId`, returns 401 if missing/invalid/expired
- [x] 2.2 Create `backend/src/middleware/requireRole.ts` — checks `req.user.role` in allowedRoles, returns 403 if not
- [x] 2.3 Create `backend/src/validation/portalSchemas.ts` — zod: `portalLoginBody` (cuit), `portalCreateOrderBody` (formulaId, quantity, obraAddress, scheduledDate)
- [x] 2.4 Create `backend/src/types/portal.ts` — DTOs: PortalLoginResponse, PortalOrderRequest, PortalOrderResponse
- [x] 2.5 Create `backend/src/routes/portal.ts` — POST /login (CUIT→Client→PortalSession with crypto.randomUUID(), expiresAt=now+24h, return token+client); POST /logout (authenticatePortal, delete session); POST /orders (authenticatePortal, create Order with clientId from session, priceSnapshot from formula, status=PENDIENTE); GET /orders (authenticatePortal, list client's orders); GET /orders/:id (authenticatePortal, verify order belongs to client)
- [x] 2.6 Modify `backend/src/routes/clients.ts` — add `requireRole("ADMIN")` to DELETE handler after `authenticateToken`
- [x] 2.7 Modify `backend/src/routes/formulas.ts` — added `requireRole("ADMIN")` to DELETE handler (after rebase onto slice-2 branch)
- [x] 2.8 Modify `backend/src/routes/silos.ts` — added `requireRole("ADMIN")` to DELETE handler (after rebase onto slice-2 branch)
- [x] 2.9 Modify `backend/src/routes/trucks.ts` — added `requireRole("ADMIN")` to DELETE handler (after rebase onto slice-2 branch)
- [x] 2.10 Modify `backend/src/index.ts` — mount portalRouter at `/api/portal` (NOT behind authenticateToken)

## Phase 3: Frontend

- [x] 3.1 Create `frontend/src/features/portal/types.ts` — PortalSession, PortalClient, PortalOrder types + zod schemas
- [x] 3.2 Create `frontend/src/features/portal/services/portalService.ts` — login, logout, createOrder, listOrders, getOrder using `x-portal-token` header
- [x] 3.3 Create `frontend/src/features/portal/hooks/usePortalSession.ts` — localStorage read/write, exposes { sessionToken, client, login, logout, isAuthenticated }
- [x] 3.4 Create `frontend/src/features/portal/hooks/usePortalOrders.ts` — fetches client's orders using session token
- [x] 3.5 Create `frontend/src/features/portal/components/PortalLogin/` — PortalLogin.tsx + types.ts + index.ts, CUIT form
- [x] 3.6 Create `frontend/src/features/portal/components/PortalOrders/` — PortalOrders.tsx + types.ts + index.ts, order list with status badges + "New Order" button
- [x] 3.7 Create `frontend/src/features/portal/components/PortalNewOrder/` — PortalNewOrder.tsx + types.ts + index.ts, formula dropdown, quantity, address, scheduled date
- [x] 3.8 Create `frontend/src/features/portal/components/PortalTrack/` — PortalTrack.tsx + types.ts + index.ts, order detail with status timeline
- [x] 3.9 Create `frontend/src/features/portal/components/PortalGate/` — PortalGate.tsx + types.ts + index.ts, auth gate checks localStorage, redirects to /portal/login
- [x] 3.10 Create `frontend/src/features/portal/index.ts` barrel exports
- [x] 3.11 Create `frontend/src/pages/Portal.tsx`, `PortalLogin.tsx`, `PortalOrders.tsx`, `PortalNewOrder.tsx`, `PortalTrack.tsx` (all thin wrappers)
- [x] 3.12 Modify `frontend/src/App.tsx` — add 4 portal routes wrapped in PortalGate: `/portal/orders`, `/portal/orders/new`, `/portal/orders/:id`; `/portal` and `/portal/login` NOT gated

## Phase 4: Verification

- [x] 4.1 Verify `npx prisma db push` works on updated schema
- [x] 4.2 Verify backend compiles: `cd backend && npx tsc --noEmit`
- [x] 4.3 Verify frontend compiles: `cd frontend && npx tsc --noEmit`
