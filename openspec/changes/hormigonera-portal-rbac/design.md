# Design: Portal de Autogestión + Role-Based Authorization

## Technical Approach

3 capabilities: portal-auth (CUIT login, DB-backed token), portal-orders (create/list/track), rbac (ADMIN-only DELETEs). Schema: `PortalSession` model + `Order.obraAddress`. Backend: `authenticatePortal` middleware (x-portal-token, DB lookup), `requireRole` on DELETE handlers. Frontend: `features/portal/` (4 components, 5 thin pages, 4 routes). Portal auth fully isolated from JWT admin auth.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Session storage | DB `PortalSession` row | JWT separate issuer/secret | Simpler, revocable, queryable. JWT needs separate config + revocation logic. |
| Token generation | `crypto.randomUUID()` | nanoid, uuid pkg | Zero new deps, collision-resistant for ~100 concurrent sessions. |
| Token transport | `x-portal-token` header | `Authorization: Bearer` (shared), cookies | Isolated from admin JWT. No CORS complexity. |
| Session expiry | 24h fixed | Sliding window | Simple. Portal users log in once/day. |
| Role middleware | `requireRole("ADMIN")` after `authenticateToken` | Route groups, field-level | Minimal disruption. Composable per-route. |
| Portal frontend gate | `PortalGate` (localStorage) | Reuse `ProtectedRoute` (JWT) | `ProtectedRoute` depends on JWT context. Portal uses separate localStorage key. |
| API client | `portalService.ts` with `fetch` | Extend `api` axios | Avoids polluting admin interceptor. Isolated. |
| DELETE restriction | Binary ADMIN/OPERADOR | Granular CRUD matrix | Matches `UserRole` enum. Easy future extension. |

## Data Flow

Portal order creation:

```
Browser → portalService.ts → POST /api/portal/orders (x-portal-token)
  → authenticatePortal (DB lookup → expiry check → req.portalSession)
  → validateBody(zod)
  → prisma.order.create(status: "PENDIENTE", obraAddress)
  → response
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | Add `PortalSession` (id, clientId FK, token @unique, expiresAt, createdAt). Add `obraAddress String?` to Order. Add `Client.portalSessions` relation. |
| `backend/src/middleware/authenticatePortal.ts` | Create | Read `x-portal-token`, lookup DB, check expiry, attach `req.portalSession`. |
| `backend/src/middleware/requireRole.ts` | Create | Read `req.user.role`, return 403 if not in allowedRoles. Chain AFTER `authenticateToken`. |
| `backend/src/routes/portal.ts` | Create | POST /login (CUIT→token), POST /orders, GET /orders, GET /orders/:id. |
| `backend/src/validation/portalSchemas.ts` | Create | Zod: `portalLoginBody`, `createPortalOrderBody`. |
| `backend/src/types/portal.ts` | Create | DTOs: `PortalSessionResponse`, `PortalOrderResponse`. |
| `backend/src/routes/clients.ts` | Modify | Add `requireRole("ADMIN")` to DELETE handler. |
| `backend/src/index.ts` | Modify | Mount `portalRouter` at `/api/portal` (no `authenticateToken`). |
| `frontend/src/features/portal/types.ts` | Create | Interfaces + Zod schemas. |
| `frontend/src/features/portal/services/portalService.ts` | Create | `portalLogin`, `createPortalOrder`, `listPortalOrders`, `getPortalOrder`. `fetch` with `x-portal-token`. |
| `frontend/src/features/portal/hooks/usePortalSession.ts` | Create | localStorage session state. |
| `frontend/src/features/portal/hooks/usePortalOrders.ts` | Create | Fetch orders for current session. |
| `frontend/src/features/portal/components/PortalLogin/` | Create | CUIT input form. |
| `frontend/src/features/portal/components/PortalOrders/` | Create | Order list table with status badges. |
| `frontend/src/features/portal/components/PortalNewOrder/` | Create | Order creation form (formula, quantity, obraAddress). |
| `frontend/src/features/portal/components/PortalTrack/` | Create | Single order detail with status. |
| `frontend/src/features/portal/components/PortalGate/` | Create | Auth gate: checks localStorage, redirects to `/portal` if missing. |
| `frontend/src/features/portal/index.ts` | Create | Barrel exports. |
| `frontend/src/pages/Portal.tsx` | Create | Orchestrator page. |
| `frontend/src/pages/PortalLogin.tsx` | Create | Thin wrapper. |
| `frontend/src/pages/PortalOrders.tsx` | Create | Thin wrapper. |
| `frontend/src/pages/PortalNewOrder.tsx` | Create | Thin wrapper. |
| `frontend/src/pages/PortalTrack.tsx` | Create | Thin wrapper. |
| `frontend/src/App.tsx` | Modify | Add 4 portal routes wrapped in PortalGate. |

## Interfaces / Contracts

```prisma
model PortalSession {
  id        Int      @id @default(autoincrement())
  clientId  Int
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  client    Client   @relation(fields: [clientId], references: [id])
}
// Added to Client: portalSessions PortalSession[]
// Added to Order: obraAddress String?
```

Portal login handler: POST /api/portal/login → find Client by CUIT → create PortalSession(crypto.randomUUID(), expiresAt=now+24h) → return `{ token, clientId }`.

DELETE with requireRole: `router.delete("/:id", authenticateToken, requireRole("ADMIN"), handler)`.

## Testing Strategy

No automated tests. User explicit ("no testeos", "sin slice 7"). Recommend Vitest + RTL deferred.

## Migration / Rollout

`prisma db push` — new PortalSession table + optional `obraAddress`. Existing Orders get `obraAddress=null`. No data loss. No production deploy (user PR).

## Open Questions

None — all decisions baked into the proposal.
