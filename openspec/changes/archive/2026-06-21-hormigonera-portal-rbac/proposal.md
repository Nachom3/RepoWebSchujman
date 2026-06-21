# Proposal: Portal de Autogestión + Role-Based Authorization

## Intent

Enable client self-service via a public portal (CUIT-only login, order creation, live tracking) and enforce role-based access control on admin endpoints. Slices 5–6 of the hormigonera product.

## Scope

### In Scope
- `PortalSession` model (id, clientId FK, token @unique, expiresAt, createdAt)
- `Order.obraAddress String?` field
- `POST /api/portal/login` — CUIT auth, returns portal token
- `POST /api/portal/orders` — create order (formula, quantity, obraAddress, scheduledDate)
- `GET /api/portal/orders` — client's orders with status
- `GET /api/portal/orders/:id` — single order (client-scoped)
- `authenticatePortal` middleware (x-portal-token, no JWT)
- `requireRole(...)` middleware on req.user.role
- Apply `requireRole("ADMIN")` to DELETE: clients, formulas, silos, trucks
- `features/portal/` — PortalLogin, PortalOrders, PortalNewOrder, PortalTrack
- 5 thin portal pages + 4 routes in App.tsx (no ProtectedRoute)

### Out of Scope
- Slice 7, real-time updates, portal order editing, password/2FA, user management UI, role-based UI hiding, bcrypt rounds

## Capabilities

### New Capabilities
- `portal-auth`: CUIT login, PortalSession create/revoke, x-portal-token middleware
- `portal-orders`: Portal order create (formula, quantity, obraAddress, scheduledDate) + client-scoped listing/tracking
- `rbac`: requireRole middleware, ADMIN-only DELETE restriction

### Modified Capabilities
- `clientes-crud`: DELETE gains `requireRole("ADMIN")` gate
- `hormigonera-schema`: PortalSession model + Order.obraAddress

## Approach

1. Prisma: add PortalSession + Order.obraAddress, migrate
2. Backend: authenticatePortal + requireRole middleware
3. Backend: /api/portal/* routes (login, orders)
4. Backend: requireRole("ADMIN") on DELETE endpoints
5. Frontend: features/portal/ (service, hooks, components)
6. Frontend: thin pages + 4 portal routes in App.tsx

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modified | PortalSession model + Order.obraAddress |
| `backend/src/middleware/auth.ts` | Modified | authenticatePortal + requireRole exports |
| `backend/src/routes/` | Modified | Portal routes + requireRole on DELETEs |
| `frontend/src/features/portal/` | New | Components, hooks, services |
| `frontend/src/pages/Portal*.tsx` | New | 5 thin page files |
| `frontend/src/App.tsx` | Modified | 4 portal routes |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CUIT-only auth is insecure by design | Known | Accept; password/2FA deferred |
| Token collision | Low | crypto.randomUUID() |
| Order without payment validation | Medium | PENDIENTE status; admin approval gate exists |

## Rollback Plan

Revert App.tsx routes → remove features/portal/ → remove /api/portal/* → revert requireRole on DELETEs → drop PortalSession + Order.obraAddress (migration down).

## Dependencies

Existing Client (CUIT), Order, and Formula models.

## Success Criteria

- [ ] CUIT login returns valid portal token
- [ ] Portal order creation (PENDIENTE status)
- [ ] Client lists/tracks own orders
- [ ] DELETE endpoints enforce ADMIN role (OPERADOR → 403)
- [ ] Portal routes work without JWT
- [ ] No regressions in admin functionality
