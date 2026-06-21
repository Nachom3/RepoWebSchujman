# Clientes CRUD Specification

## Purpose

Admin CRUD for constructoras: create, read, update, soft-disable, cuenta corriente movements. All endpoints require JWT. Data model in `hormigonera-schema`.

---

## Endpoints

### Requirement: Create Client

`POST /api/clients` — Request: `{ cuit (required, unique), razonSocial (required), direccion?, telefono?, email?, contacto?, condicionIVA? }`. Response 201: `{ id, cuit, razonSocial, saldo: 0, status: "active" }`.

#### Scenario: Client created
- GIVEN valid JWT + `{ cuit, razonSocial }` → POST → 201

#### Scenario: Duplicate CUIT
- GIVEN existing cuit "20-12345678-9" → POST same CUIT → 409 "CUIT already registered"

#### Scenario: Missing field
- GIVEN JWT, no `razonSocial` → POST → 400

#### Scenario: No auth
- GIVEN no token → POST → 401

### Requirement: List Clients

`GET /api/clients` — Optional `?status=active|disabled`. Response 200: `[{ id, cuit, razonSocial, saldo, status }]`.

#### Scenario: List active
- 3 active → GET ?status=active → 200 with 3

#### Scenario: Filter disabled
- 2 active, 1 disabled → GET ?status=disabled → 200 with 1

### Requirement: Get Client by ID

`GET /api/clients/:id` — Response 200: full Client.

#### Scenario: Found
- id=1 → GET → 200

#### Scenario: Not found
- id=999 → GET → 404

### Requirement: Update Client

`PATCH /api/clients/:id` — Partial contact update. CUIT immutable.

#### Scenario: Update contact
- id=1 → PATCH `{ telefono }` → 200

#### Scenario: CUIT immutable
- id=1 → PATCH `{ cuit }` → 400

### Requirement: Disable Client (Soft Delete)

`DELETE /api/clients/:id` — Sets status "disabled". No removal.

#### Scenario: Soft-disable
- Active id=1 → DELETE → 200, status "disabled"

#### Scenario: Idempotent
- Disabled id=1 → DELETE → 200, remains "disabled"

### Requirement: Record Movement

`POST /api/clients/:id/movements` — Request: `{ tipo ("DEBITO"|"CREDITO"), monto (>0), referencia? }`. Atomic saldo. Response 201: `{ id, tipo, monto, fecha, referencia, clientId }`.

#### Scenario: DEBITO
- saldo=1000 → POST `{ tipo: "DEBITO", monto: 200 }` → saldo=1200

#### Scenario: CREDITO
- saldo=1000 → POST `{ tipo: "CREDITO", monto: 200 }` → saldo=800

#### Scenario: Non-existent client
- id=999 → POST → 404

#### Scenario: Invalid tipo
- POST `{ tipo: "INVALID" }` → 400

### Requirement: Order Payment Recording

`POST /api/clients/:id/movements` — When `tipo` is `CREDITO` and `referencia` is provided as an Order ID, this records a payment against that specific order. The endpoint MUST validate:

1. The Client exists (404 if not)
2. `tipo` is CREDITO (400 if invalid)
3. `monto` > 0 (400 if ≤ 0)
4. `referencia` is a valid Order ID belonging to this Client (400 if mismatched)

The movement is recorded atomically with the Client saldo update. The `referencia` field carries the Order ID as a string.

#### Scenario: Payment against order

- GIVEN Client id=1 with Order id=10 (PENDIENTE)
- WHEN POST `{ tipo: "CREDITO", monto: 50000, referencia: "10" }` → 201
- THEN movement exists with referencia "10" AND Client saldo decreases by 50000

#### Scenario: Payment for wrong client

- GIVEN Client id=1, Order id=10 belongs to Client id=2
- WHEN POST `{ tipo: "CREDITO", monto: 50000, referencia: "10" }` → 400 "Order does not belong to this client"

#### Scenario: Payment with non-existent order

- GIVEN no Order id=999
- WHEN POST `{ tipo: "CREDITO", monto: 50000, referencia: "999" }` → 400 "Order not found"

#### Scenario: DEBITO ignores referencia

- GIVEN Client id=1
- WHEN POST `{ tipo: "DEBITO", monto: 200, referencia: "10" }` → 201
- THEN movement is recorded (referencia is informational, not validated for DEBITO)

### Requirement: CREDITO Movement Semantics Extended

The existing CREDITO movement now serves dual purpose: generic balance reduction (no referencia) or order-specific payment (referencia = orderId). The endpoint signature is unchanged — `referencia` remains optional for CREDITO.

(Previously: referencia was purely informational, now it triggers order-payment linkage when present)

#### Scenario: CREDITO without referencia

- GIVEN Client id=1
- WHEN POST `{ tipo: "CREDITO", monto: 300 }` → 201
- THEN movement recorded with null referencia, saldo decreases

#### Scenario: CREDITO with referencia

- GIVEN Client id=1, Order id=10 belongs to Client id=1
- WHEN POST `{ tipo: "CREDITO", monto: 300, referencia: "10" }` → 201
- THEN movement recorded with referencia "10", saldo decreases

### Requirement: List Movements

`GET /api/clients/:id/movements` — Ordered fecha desc. Response 200: `[{ id, tipo, monto, fecha, referencia }]`.

#### Scenario: Descending
- 3 movements → GET → 200 desc

#### Scenario: Not found
- id=999 → GET → 404

---

## Error States

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Validation failed | `{ error, details }` |
| 401 | No JWT / expired | `{ error: "Access denied" }` |
| 403 | Insufficient role | DEFERRED |
| 404 | Not found | `{ error: "Client not found" }` |
| 409 | Duplicate CUIT | `{ error: "CUIT already registered" }` |

---

## Frontend Contracts

### Requirement: Clientes List Page

The frontend MUST render a client table (CUIT, razon social, saldo, status) with status filtering and detail navigation.

| Component | shadcn primitives |
|-----------|-------------------|
| ClientList | Table, Input, Badge, Button |
| ClientRow | TableRow, TableCell, Badge |

#### Scenario: List renders
- 5 clients → page loads → table shows 5

### Requirement: Cliente Detail Page

The frontend MUST display contact, balance, history, and new-movement form.

| Component | shadcn primitives |
|-----------|-------------------|
| ClientDetail | Card, Badge, Button, Separator |
| MovementRow | TableRow, TableCell, Badge |

#### Scenario: Detail shows balance
- saldo=1500, 4 movements → Detail → saldo=1500, 4 movements desc

### Requirement: Client Form Component

The frontend MUST provide create/edit form (all contact fields). CUIT disabled on edit.

| Component | shadcn primitives |
|-----------|-------------------|
| ClientForm | Form, Input, Label, Button, Select |

#### Scenario: Create validates CUIT
- Submit without CUIT → validation error
