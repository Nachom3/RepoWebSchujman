# Delta for Hormigonera Schema

## ADDED Requirements

### Requirement: FormulaMaterial Model

The system MUST define a `FormulaMaterial` join table between Formula and SiloStock:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `formulaId` | Int | FK → Formula |
| `siloStockId` | Int | FK → SiloStock |
| `kgPerCubicMeter` | Float | >0 |

Unique constraint on `(formulaId, siloStockId)`.

- Scenario: Material linked → FormulaMaterial persisted, formula recipe queryable
- Scenario: Duplicate pair → Prisma rejects (unique constraint)

### Requirement: Order Model Field Extensions

Add to Order: `priceSnapshot` (Float, optional, frozen from Formula at creation), `completedAt` (DateTime, optional), `truckId` (Int, optional FK→Truck).

- Scenario: priceSnapshot frozen → Formula price 5000 → Order priceSnapshot=5000, unchanged if Formula updates
- Scenario: completedAt set → POST /complete → completedAt=now()

### Requirement: SiloStock Alert Threshold

Add `alertMin Float @default(0)` to SiloStock. When `quantity < alertMin`, stock is low.

- Scenario: Default → alertMin=0 on new SiloStock
- Scenario: Low detection → quantity=2.5, alertMin=3.0 → API response `low: true`

---

## MODIFIED Requirements

### Requirement: Formula, Order, SiloStock, Truck Models

The system MUST define these models with full field contracts. Endpoint behavior is OUT OF SCOPE.

(Previously: minimal stubs — recipe was JSON/String, Order lacked priceSnapshot/completedAt/truckId, SiloStock lacked alertMin, Truck lacked capacidad)

| Model | Key Fields |
|-------|-----------|
| Formula | id, name, pricePerCubicMeter (Float) |
| Order | id, clientId FK, formulaId FK, truckId? FK, quantity (Float, m³), priceSnapshot (Float), status (OrderStatus), createdAt, completedAt?, scheduledDate? |
| SiloStock | id, material (enum: arena, grava, cemento, cal), quantity (Float, tons), alertMin (Float, @default 0) |
| Truck | id, patente (unique), capacidad (Float, m³), status (TruckStatus) |

- Scenario: All 7 models + enums exist after `prisma db push`

### Requirement: Client Status Enum Conversion

Replace `Client.status String @default("active")` with `Client.status ClientStatus @default(ACTIVE)` — values: `ACTIVE`, `DISABLED`.

(Previously: String with default "active")

- Scenario: Migration maps "active"→ACTIVE, "disabled"→DISABLED
- Scenario: New client defaults to ACTIVE

### Requirement: Order Status Enum Conversion

Replace `Order.status String` with `Order.status OrderStatus @default(PENDIENTE)` — values: `PENDIENTE`, `APROBADA`, `COMPLETADA`, `CANCELADA`.

(Previously: String field)

- Scenario: Transitions enforced (PENDIENTE→APROBADA|CANCELADA, APROBADA→COMPLETADA|CANCELADA)

### Requirement: Truck Status Enum Conversion

Replace `Truck.status String` with `Truck.status TruckStatus @default(DISPONIBLE)` — values: `DISPONIBLE`, `EN_RECORRIDO`.

(Previously: String field)

- Scenario: New truck defaults to DISPONIBLE

### Requirement: CuentaCorrienteMovimiento Tipo Enum Conversion

Replace `CuentaCorrienteMovimiento.tipo String` with `tipo MovementTipo` — values: `DEBITO`, `CREDITO`.

(Previously: String with enum semantics)

- Scenario: DEBITO/CREDITO persisted as enums; invalid value rejected by Prisma
