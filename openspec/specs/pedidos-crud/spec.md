# Pedidos CRUD Specification

## Purpose

Order lifecycle: create, approve (payment + atomic smart discount), complete, list/filter. All endpoints require JWT.

---

## Model

### Requirement: Order Model Contract

The system MUST define an Order: `id` (Int, auto-increment), `clientId` (FK→Client), `formulaId` (FK→Formula), `truckId` (FK→Truck, optional), `quantity` (Float, m³, >0), `priceSnapshot` (Float, frozen from Formula at creation), `status` (OrderStatus), `createdAt`, `completedAt?`, `scheduledDate?`.

#### Scenario: Price frozen at creation

- GIVEN Formula with pricePerCubicMeter 5000 → WHEN Order created → THEN priceSnapshot=5000, status=PENDIENTE

#### Scenario: Quantity validation

- GIVEN quantity=-5 → WHEN created → THEN 400 error

### Requirement: OrderStatus Enum

Values: `PENDIENTE`, `APROBADA`, `COMPLETADA`, `CANCELADA`. Transitions: PENDIENTE→APROBADA|CANCELADA, APROBADA→COMPLETADA|CANCELADA, COMPLETADA/CANCELADA→terminal.

---

## Endpoints

### Requirement: Create Order

`POST /api/orders` — `{ clientId, formulaId, quantity(>0), scheduledDate?, truckId? }` → 201 with PENDIENTE status.

- Scenario: Valid → 201 with PENDIENTE
- Scenario: Inactive formula → 409 "Formula inactive"
- Scenario: Disabled client → 409 "Client disabled"

### Requirement: List Orders

`GET /api/orders` — filters: `?status=`, `?clientId=`, `?formulaId=` → 200 array.

- Scenario: Filter by status → returns matching subset

### Requirement: Get Order by ID

`GET /api/orders/:id` → 200 with Client, Formula, Truck relations.

### Requirement: Update Order

`PATCH /api/orders/:id` — mutable: `truckId`, `scheduledDate` → 200.

### Requirement: Approve Order

`POST /api/orders/:id/approve` — THE CRITICAL ENDPOINT. Validates: (1) status=PENDIENTE, (2) CREDITO movement exists with referencia=orderId. ATOMICALLY: status→APROBDA, create CREDITO if needed, smart discount (kgPerCubicMeter×quantity/1000 per material from SiloStock).

- Scenario: Payment exists → 200, status APROBADA, stock subtracted
- Scenario: No payment → 422 "Payment required"
- Scenario: Insufficient stock (e.g. 5m³ arena, silo has 3t) → 422 "Insufficient stock: arena"
- Scenario: Not PENDIENTE → 409 "Order not in PENDIENTE status"

### Requirement: Complete Order

`POST /api/orders/:id/complete` → status COMPLETADA + completedAt=now().

- Scenario: APROBADA → 200, completedAt set
- Scenario: Not APROBADA → 409

---

## Error States

| Code | Condition |
|------|-----------|
| 400 | Validation (quantity≤0, missing fields) |
| 401 | No JWT / expired |
| 404 | Order not found |
| 409 | Invalid transition, inactive formula, disabled client |
| 422 | Insufficient stock, payment required |

---

## Frontend Contracts

| Component | shadcn primitives |
|-----------|-------------------|
| PedidoList | Table, Input, Badge, Button, Select |
| PedidoRow | TableRow, TableCell, Badge |
| PedidoDetail | Card, Badge, Button, Separator |
| StatusTimeline | custom Tailwind steps |
| PedidoForm | Form, Input, Label, Button, Select |

- Scenario: List filters by status (Select → table subset)
- Scenario: Detail shows context actions (Approve for PENDIENTE, Complete for APROBADA)
- Scenario: Form renders Client/Formula dropdowns → creates PENDIENTE order
