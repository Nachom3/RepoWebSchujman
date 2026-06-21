# Portal Orders Specification

## Purpose

Client self-service order management via the portal. Order creation, listing, and tracking — scoped to authenticated client. No approval or completion from portal (admin-only).

---

## Endpoints

### Requirement: Create Portal Order

`POST /api/portal/orders` — Creates an Order for the authenticated client.

**Headers:** `x-portal-token: <token>`

**Request:** `{ formulaId (number, required), quantity (number, required, >0), obraAddress (string, required), scheduledDate (string, ISO date, optional) }`

**Response 201:** `{ id, formulaId, quantity, obraAddress, scheduledDate, priceSnapshot, status: "PENDIENTE" }`

Server sets `clientId` from `req.portalClientId`, `priceSnapshot` from `Formula.pricePerCubicMeter`.

#### Scenario: Order created successfully

- GIVEN authenticated client (clientId=5) with valid session
- WHEN POST /api/portal/orders with `{ formulaId: 1, quantity: 10, obraAddress: "Av. Principal 123" }`
- THEN 201 with status PENDIENTE and priceSnapshot from formula

#### Scenario: Validation errors

- GIVEN authenticated client
- WHEN POST /api/portal/orders with quantity ≤ 0, missing obraAddress, or invalid formulaId
- THEN 400 with validation error

#### Scenario: No/invalid session

- GIVEN no or expired x-portal-token
- WHEN POST /api/portal/orders
- THEN 401 (authenticatePortal rejects)

### Requirement: List Portal Orders

`GET /api/portal/orders` — Returns all orders for the authenticated client.

**Headers:** `x-portal-token: <token>`

**Response 200:** `[{ id, formulaId, quantity, obraAddress, scheduledDate, priceSnapshot, status, truck: { id, patente } | null, createdAt, completedAt }]`

#### Scenario: Client sees own orders

- GIVEN clientId=5 with 3 orders
- WHEN GET /api/portal/orders
- THEN 200 with exactly 3 orders (no other client's orders)

#### Scenario: No orders

- GIVEN clientId=5 with 0 orders
- WHEN GET /api/portal/orders
- THEN 200 with empty array

### Requirement: Get Portal Order Detail

`GET /api/portal/orders/:id` — Returns single order detail, scoped to authenticated client.

**Headers:** `x-portal-token: <token>`

**Response 200:** `{ id, formulaId, quantity, obraAddress, scheduledDate, priceSnapshot, status, truck: { id, patente } | null, createdAt, completedAt, statusHistory: [{ status, timestamp }] }`

#### Scenario: Order found

- GIVEN clientId=5 owns order id=10
- WHEN GET /api/portal/orders/10
- THEN 200 with full detail including statusHistory

#### Scenario: Order not found or wrong client

- GIVEN clientId=5, order id=999 doesn't exist or belongs to clientId=6
- WHEN GET /api/portal/orders/999
- THEN 404 with error "Order not found"

---

## Frontend Contracts

### Requirement: Portal Components

The frontend MUST provide portal UI:

| Component | shadcn primitives | Purpose |
|-----------|-------------------|---------|
| PortalLogin | Card, Input, Button, Label | CUIT login form |
| PortalOrders | Table, Badge, Button | Order list with status badges |
| PortalNewOrder | Form, Input, Select, Label, Button, Card | Order creation form |
| PortalTrack | Card, Badge, Separator | Order detail with status timeline |
| Portal (page) | — | Route-based orchestrator, auth state |

#### Scenario: Login renders for unauthenticated user

- GIVEN no active portal session
- WHEN /portal is visited
- THEN PortalLogin renders with CUIT input and submit button

#### Scenario: Orders list renders for authenticated client

- GIVEN authenticated client with 3 orders
- WHEN /portal/orders is visited
- THEN PortalOrders renders table with 3 rows and status badges

#### Scenario: New order form renders

- GIVEN authenticated client
- WHEN /portal/orders/new is visited
- THEN PortalNewOrder renders with formula dropdown, quantity, address, date inputs

#### Scenario: Track order renders detail

- GIVEN authenticated client with order id=10
- WHEN /portal/orders/10 is visited
- THEN PortalTrack renders status badge with timestamps

---

## Error States

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Validation failed (quantity ≤ 0, missing obraAddress, invalid formulaId) | `{ error, details }` |
| 401 | No/invalid/expired portal session | `{ error: "Portal session required" }` |
| 404 | Order not found or doesn't belong to client | `{ error: "Order not found" }` |
| 500 | Unexpected server error | `{ error: "Internal server error" }` |
