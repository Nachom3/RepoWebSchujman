# Inventario CRUD Specification

## Purpose

Formula recipe management, SiloStock CRUD with alert thresholds, and FormulaMaterial join model. Smart discount triggered on order approval. All endpoints require JWT.

---

## Models

### Requirement: Formula Model Contract

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | auto-increment |
| `name` | String | unique |
| `pricePerCubicMeter` | Float | >0 |
| `materials` | relation | one-to-many FormulaMaterial |

#### Scenario: Formula created with price

- GIVEN payload `{ name:"H15", pricePerCubicMeter:5000 }`
- WHEN persisted → price snapshotable by orders

### Requirement: SiloStock Model Contract

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | auto-increment |
| `material` | enum | arena, grava, cemento, cal |
| `quantity` | Float | tons, ≥0 |
| `alertMin` | Float | default 0 |

#### Scenario: Alert threshold

- GIVEN silo with quantity=2.5, alertMin=3.0
- WHEN queried → API response flags LOW stock

### Requirement: FormulaMaterial Model Contract

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | auto-increment |
| `formulaId` | FK | → Formula |
| `siloStockId` | FK | → SiloStock |
| `kgPerCubicMeter` | Float | >0 |

#### Scenario: Material linked to formula

- GIVEN Formula H15 + SiloStock arena → FormulaMaterial `{ kgPerCubicMeter: 200 }`
- WHEN order for H15 with 10m³ → discount = 200 × 10 / 1000 = 2 tons arena

---

## Endpoints

### Requirement: Formula CRUD

- `GET /api/formulas` — list all
- `POST /api/formulas` — create `{ name, pricePerCubicMeter }`
- `PATCH /api/formulas/:id` — update name/price
- `DELETE /api/formulas/:id` — hard delete (no orders referencing it)

#### Scenario: Create formula

- GIVEN valid JWT → POST `{ name:"H25", pricePerCubicMeter:6500 }` → 201

#### Scenario: Delete with active orders

- GIVEN formula with PENDIENTE orders → DELETE → 409 "Formula in use"

### Requirement: SiloStock CRUD

- `GET /api/silos` — list all, computed `low` flag
- `POST /api/silos` — create `{ material, quantity, alertMin? }`
- `PATCH /api/silos/:id` — update quantity/alertMin
- `DELETE /api/silos/:id` — hard delete

#### Scenario: List with alert flag

- GIVEN silo arena quantity=2.5, alertMin=3.0 → GET → item has `low: true`

#### Scenario: Quantity cannot go negative

- GIVEN silo quantity=10 → PATCH `{ quantity: -5 }` → 400

### Requirement: Formula Materials Management

`GET/POST/PATCH/DELETE /api/formulas/:id/materials` — manage recipe ingredients.

#### Scenario: Add material to formula

- GIVEN formula H15 → POST `{ siloStockId:1, kgPerCubicMeter:200 }` → 201

#### Scenario: Duplicate material rejected

- GIVEN formula H15 already has arena material → POST arena again → 409

### Requirement: Smart Discount (Order Approval Trigger)

When an order is approved, for each FormulaMaterial in the order's formula, subtract `(kgPerCubicMeter × order.quantity / 1000)` from the corresponding SiloStock.quantity. This MUST occur within the same Prisma `$transaction` as the order status update.

#### Scenario: Successful discount

- GIVEN formula with arena 200 kg/m³, order 10m³, silo arena=5.0 → approve → silo arena=3.0

#### Scenario: Insufficient stock rolls back

- GIVEN silo arena=1.0, order needs 2.0 tons → approve → 422 "Insufficient stock: arena", silo unchanged

#### Scenario: Multiple materials atomic

- GIVEN formula with arena + cemento → approve → BOTH subtract or NEITHER (transaction)

---

## Error States

| Code | Condition |
|------|-----------|
| 400 | Validation (negative quantity, missing fields) |
| 401 | No JWT / expired |
| 404 | Formula/Silo not found |
| 409 | Formula in use, duplicate material |
| 422 | Insufficient stock on approval |

---

## Frontend Contracts

| Component | shadcn primitives |
|-----------|-------------------|
| FormulaList | Table, Button, Badge |
| FormulaForm | Form, Input, Label, Button |
| SiloList | Table, Badge, Button |
| SiloForm | Form, Input, Label, Button |

#### Scenario: Silo shows alert

- SiloList renders red Badge when `low: true`
