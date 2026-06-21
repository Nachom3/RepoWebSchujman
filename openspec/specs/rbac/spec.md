# RBAC Specification

## Purpose

Role-based access control for admin endpoints. Enforces that OPERADOR users cannot perform destructive DELETE operations. Uses `requireRole` middleware on `req.user.role` (set by existing JWT auth).

---

## Middleware

### Requirement: requireRole Middleware

The system MUST provide `requireRole(...allowedRoles)` middleware that checks `req.user.role` is in the allowedRoles list. Returns 403 if role doesn't match.

**Signature:** `requireRole(...roles: UserRole[])`

#### Scenario: Role matches

- GIVEN a User with role ADMIN
- WHEN `requireRole("ADMIN")` processes the request
- THEN the request proceeds to the next handler

#### Scenario: Role does not match

- GIVEN a User with role OPERADOR
- WHEN `requireRole("ADMIN")` processes the request
- THEN 403 with `{ error: "Insufficient role" }`

#### Scenario: Multiple allowed roles

- GIVEN a User with role OPERADOR
- WHEN `requireRole("ADMIN", "OPERADOR")` processes the request
- THEN the request proceeds (OPERADOR is in the allowed list)

---

## Role Behavior

### Requirement: ADMIN Role Permissions

Users with role `ADMIN` MUST have full access to all authenticated endpoints, including DELETE operations.

#### Scenario: ADMIN deletes client

- GIVEN a User with role ADMIN
- WHEN DELETE /api/clients/:id
- THEN the delete proceeds (no 403)

#### Scenario: ADMIN deletes formula

- GIVEN a User with role ADMIN
- WHEN DELETE /api/formulas/:id
- THEN the delete proceeds

### Requirement: OPERADOR Role Permissions

Users with role `OPERADOR` MUST have access to all authenticated endpoints EXCEPT DELETE on clients, formulas, silos, and trucks.

#### Scenario: OPERADOR lists clients

- GIVEN a User with role OPERADOR
- WHEN GET /api/clients
- THEN the request succeeds (200)

#### Scenario: OPERADOR creates order

- GIVEN a User with role OPERADOR
- WHEN POST /api/orders
- THEN the request succeeds

#### Scenario: OPERADOR cannot delete client

- GIVEN a User with role OPERADOR
- WHEN DELETE /api/clients/:id
- THEN 403 with `{ error: "Insufficient role" }`

#### Scenario: OPERADOR cannot delete formula

- GIVEN a User with role OPERADOR
- WHEN DELETE /api/formulas/:id
- THEN 403 returned

#### Scenario: OPERADOR cannot delete silo

- GIVEN a User with role OPERADOR
- WHEN DELETE /api/silos/:id
- THEN 403 returned

#### Scenario: OPERADOR cannot delete truck

- GIVEN a User with role OPERADOR
- WHEN DELETE /api/trucks/:id
- THEN 403 returned

---

## Endpoint Application

### Requirement: DELETE Endpoint Role Enforcement

The following DELETE endpoints MUST apply `requireRole("ADMIN")`:

| Endpoint | Middleware |
|----------|-----------|
| `DELETE /api/clients/:id` | `requireRole("ADMIN")` |
| `DELETE /api/formulas/:id` | `requireRole("ADMIN")` |
| `DELETE /api/silos/:id` | `requireRole("ADMIN")` |
| `DELETE /api/trucks/:id` | `requireRole("ADMIN")` |

All other endpoints (GET, POST, PATCH) require only authentication.

#### Scenario: ADMIN can delete any resource

- GIVEN a User with role ADMIN
- WHEN any DELETE endpoint is called
- THEN not blocked by role check

#### Scenario: OPERADOR blocked on all DELETEs

- GIVEN a User with role OPERADOR
- WHEN any of the 4 DELETE endpoints is called
- THEN 403 returned

---

## Migration

### Requirement: Default Role Assignment

No data migration needed. Existing Users default to `ADMIN` (per auth spec). New users also default to `ADMIN`. Role assignment changes deferred to future user management slice.

#### Scenario: Existing users unaffected

- GIVEN Users with role ADMIN before RBAC slice
- WHEN requireRole middleware is deployed
- THEN all existing users retain ADMIN and have full access

---

## Error States

| Code | Condition | Response |
|------|-----------|----------|
| 403 | Role not in allowedRoles | `{ error: "Insufficient role" }` |

---

## Deferred

### Requirement: Granular Role Permissions

Fine-grained per-endpoint permission configuration is deferred. Current approach uses hardcoded middleware per DELETE endpoint. Future slices MAY introduce a permission matrix.

#### Scenario: Future permission matrix

- GIVEN a configurable role-permission system
- WHEN a role is assigned specific permissions
- THEN only those permissions are enforced
