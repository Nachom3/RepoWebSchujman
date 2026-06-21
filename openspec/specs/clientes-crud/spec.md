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
