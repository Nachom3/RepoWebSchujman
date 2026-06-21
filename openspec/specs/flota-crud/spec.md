# Flota CRUD Specification

## Purpose

Truck fleet management: CRUD, status toggle (DISPONIBLE/EN_RECORRIDO), and order assignment. All endpoints require JWT.

---

## Model

### Requirement: Truck Model Contract

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | auto-increment |
| `patente` | String | unique |
| `capacidad` | Float | m³, >0 |
| `status` | TruckStatus | DISPONIBLE or EN_RECORRIDO |

The system MUST compute `currentOrderId` as the order where `truckId=this.id` AND status ≠ COMPLETADA (derived, not stored).

#### Scenario: New truck is DISPONIBLE

- GIVEN payload `{ patente:"ABC123", capacidad:8 }`
- WHEN persisted → status defaults to DISPONIBLE

#### Scenario: Patente uniqueness

- GIVEN truck "ABC123" exists → POST `{ patente:"ABC123" }` → 409

### Requirement: TruckStatus Enum

The system MUST define `TruckStatus` with values: `DISPONIBLE`, `EN_RECORRIDO`.

#### Scenario: Status toggle

- DISPONIBLE → PATCH status → EN_RECORRIDO
- EN_RECORRIDO → PATCH status → DISPONIBLE

---

## Endpoints

### Requirement: Truck CRUD

- `GET /api/trucks` — list all, optional `?status=DISPONIBLE|EN_RECORRIDO`
- `POST /api/trucks` — create `{ patente, capacidad }`
- `PATCH /api/trucks/:id` — update capacidad, patente
- `DELETE /api/trucks/:id` — hard delete

#### Scenario: List available trucks

- GIVEN 3 trucks (2 DISPONIBLE, 1 EN_RECORRIDO) → GET ?status=DISPONIBLE → 200 with 2

#### Scenario: Delete truck in use

- GIVEN truck assigned to APROBADA order → DELETE → 409 "Truck in use"

### Requirement: Toggle Truck Status

`PATCH /api/trucks/:id/status` — Toggles between DISPONIBLE and EN_RECORRIDO. Response 200 with new status.

#### Scenario: Toggle from DISPONIBLE

- GIVEN DISPONIBLE truck → PATCH → 200, status EN_RECORRIDO

#### Scenario: Toggle from EN_RECORRIDO

- GIVEN EN_RECORRIDO truck → PATCH → 200, status DISPONIBLE

### Requirement: Quick Assign Order to Truck

`PATCH /api/orders/:id` with `{ truckId: X }` — ATOMICALLY sets the truck's status to EN_RECORRIDO and the order's truckId. Both updates MUST occur in the same transaction.

#### Scenario: Assign truck to order

- GIVEN DISPONIBLE truck, PENDIENTE order → PATCH order `{ truckId: 1 }` → truck status EN_RECORRIDO, order.truckId=1

#### Scenario: Assign unavailable truck

- GIVEN EN_RECORRIDO truck → PATCH order `{ truckId: 2 }` → 409 "Truck not available"

#### Scenario: Reassign truck

- GIVEN order with truckId=1 → PATCH `{ truckId: 2 }` → old truck reverts to DISPONIBLE (if no other active orders), new truck → EN_RECORRIDO

---

## Error States

| Code | Condition |
|------|-----------|
| 400 | Validation (missing patente, capacidad ≤0) |
| 401 | No JWT / expired |
| 404 | Truck/Order not found |
| 409 | Duplicate patente, truck in use, truck not available |

---

## Frontend Contracts

| Component | shadcn primitives |
|-----------|-------------------|
| TruckList | Table, Badge, Button, Select |
| TruckRow | TableRow, TableCell, Badge |
| TruckForm | Form, Input, Label, Button |

#### Scenario: List shows status

- TruckList renders Badge: green DISPONIBLE, orange EN_RECORRIDO

#### Scenario: Filter by status

- Select "DISPONIBLE" → table shows only available trucks
