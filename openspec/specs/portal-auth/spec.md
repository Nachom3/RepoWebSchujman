# Portal Auth Specification

## Purpose

CUIT-only authentication for the client self-service portal. Defines `PortalSession` model, login/logout endpoints, and `x-portal-token` middleware. Separate auth surface from JWT-based admin auth — no JWT, no passwords.

**Security note**: CUIT-only auth means anyone who knows a CUIT can access that client's data. Accepted per product spec; password/2FA deferred.

---

## Model

### Requirement: PortalSession Model

The system MUST define a `PortalSession` model:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `clientId` | Int | FK → Client, required |
| `token` | String | `@unique` (global) |
| `expiresAt` | DateTime | required |
| `createdAt` | DateTime | `@default(now())` |

#### Scenario: Session created on login

- GIVEN a valid Client with CUIT "20-12345678-9"
- WHEN POST /api/portal/login is called with that CUIT
- THEN a PortalSession is created with token, expiresAt = now + 24h, clientId linked to Client

#### Scenario: Token is unique

- GIVEN an existing PortalSession with token "abc-123"
- WHEN a new session is created with the same token
- THEN the database rejects the insert (unique constraint)

#### Scenario: Expired session ignored

- GIVEN a PortalSession with expiresAt in the past
- WHEN authenticatePortal middleware reads the token
- THEN the session is treated as invalid (401)

---

## Endpoints

### Requirement: Portal Login

`POST /api/portal/login` — Authenticates a client by CUIT and returns a portal session token.

**Request body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `cuit` | string | yes | Must match CUIT format (XX-XXXXXXXX-X) |

**Response 200:** `{ sessionToken: string, client: { id, razonSocial, cuit } }`

#### Scenario: Successful login

- GIVEN an ACTIVE Client with CUIT "20-12345678-9"
- WHEN POST /api/portal/login with `{ cuit: "20-12345678-9" }`
- THEN 200 with `sessionToken` and `client` object

#### Scenario: Invalid CUIT format

- GIVEN a string "12345" (not matching CUIT regex)
- WHEN POST /api/portal/login
- THEN 400 with validation error

#### Scenario: CUIT not found

- GIVEN no Client with CUIT "99-99999999-9"
- WHEN POST /api/portal/login
- THEN 401 with error "Client not found or inactive"

#### Scenario: DISABLED client

- GIVEN a Client with CUIT "20-12345678-9" and status DISABLED
- WHEN POST /api/portal/login
- THEN 401 with error "Client not found or inactive"

### Requirement: Portal Logout

`POST /api/portal/logout` — Revokes the current portal session.

**Headers:** `x-portal-token: <token>`

**Response 200:** `{ message: "Logged out" }`

#### Scenario: Successful logout

- GIVEN a valid PortalSession with token "abc-123"
- WHEN POST /api/portal/logout with that token
- THEN the PortalSession is deleted and 200 returned

#### Scenario: Invalid token on logout

- GIVEN no PortalSession with token "invalid"
- WHEN POST /api/portal/logout
- THEN 200 returned (idempotent — no error for missing session)

---

## Middleware

### Requirement: authenticatePortal Middleware

The system MUST provide `authenticatePortal` middleware that reads `x-portal-token`, looks up the PortalSession, verifies not expired, and attaches `req.portalClientId` to the request.

#### Scenario: Valid token attaches clientId

- GIVEN a PortalSession with token "abc-123" linked to clientId=5, not expired
- WHEN authenticatePortal processes request with `x-portal-token: abc-123`
- THEN `req.portalClientId` is set to 5 and request proceeds

#### Scenario: Missing header returns 401

- GIVEN no `x-portal-token` header
- WHEN authenticatePortal processes the request
- THEN 401 with error "Portal session required"

#### Scenario: Expired token returns 401

- GIVEN a PortalSession with expiresAt in the past
- WHEN authenticatePortal processes the request
- THEN 401 with error "Portal session expired"

---

## Error States

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid CUIT format | `{ error: "Validation failed", details: {...} }` |
| 401 | CUIT not found, client DISABLED, missing/expired token | `{ error: "..." }` |
| 500 | Unexpected server error | `{ error: "Internal server error" }` |
