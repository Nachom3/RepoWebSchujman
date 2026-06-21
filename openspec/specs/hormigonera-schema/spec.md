# Hormigonera Schema Specification

## Purpose

Prisma schema foundation for the concrete plant management system. Defines data models, enums, relations, and invariants for slices 1–2. Endpoint behavior is NOT covered here.

---

## Enums

### Requirement: UserRole Enum

The system MUST define a `UserRole` enum with values `ADMIN` and `OPERADOR`. Applied to `User.role` with default `ADMIN`.

#### Scenario: New user gets ADMIN role

- GIVEN a new User is created via registration
- WHEN the User record is persisted
- THEN `role` is set to `ADMIN`

#### Scenario: Existing users default to ADMIN

- GIVEN existing User rows exist before schema migration
- WHEN the migration runs
- THEN all existing Users have `role = ADMIN`

### Requirement: Client Status Enum Conversion

Replace `Client.status String @default("active")` with `Client.status ClientStatus @default(ACTIVE)` — values: `ACTIVE`, `DISABLED`.

(Previously: String with default "active")

#### Scenario: Migration maps "active"→ACTIVE, "disabled"→DISABLED

- GIVEN existing Client rows with status "active" or "disabled"
- WHEN the migration runs
- THEN status values are converted to ACTIVE or DISABLED respectively

#### Scenario: New client defaults to ACTIVE

- GIVEN a new Client is created
- WHEN the Client is persisted
- THEN `status` is set to ACTIVE

### Requirement: Order Status Enum Conversion

Replace `Order.status String` with `Order.status OrderStatus @default(PENDIENTE)` — values: `PENDIENTE`, `APROBADA`, `COMPLETADA`, `CANCELADA`.

(Previously: String field)

#### Scenario: Transitions enforced

- GIVEN an Order with status PENDIENTE
- WHEN approve is called
- THEN status becomes APROBADA

- GIVEN an Order with status APROBADA
- WHEN complete is called
- THEN status becomes COMPLETADA

### Requirement: Truck Status Enum Conversion

Replace `Truck.status String` with `Truck.status TruckStatus @default(DISPONIBLE)` — values: `DISPONIBLE`, `EN_RECORRIDO`.

(Previously: String field)

#### Scenario: New truck defaults to DISPONIBLE

- GIVEN a new Truck is created
- WHEN the Truck is persisted
- THEN `status` is set to DISPONIBLE

### Requirement: CuentaCorrienteMovimiento Tipo Enum Conversion

Replace `CuentaCorrienteMovimiento.tipo String` with `tipo MovementTipo` — values: `DEBITO`, `CREDITO`.

(Previously: String with enum semantics)

#### Scenario: DEBITO/CREDITO persisted as enums

- GIVEN a movement with tipo "DEBITO"
- WHEN the movement is persisted
- THEN tipo is stored as the DEBITO enum value

- GIVEN an invalid tipo value
- WHEN the movement is persisted
- THEN Prisma rejects the insert

---

## Models

### Requirement: Client Model

The system MUST define a `Client` model:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `cuit` | String | `@unique` (global) |
| `razonSocial` | String | required |
| `direccion` | String | optional |
| `telefono` | String | optional |
| `email` | String | optional |
| `contacto` | String | optional |
| `condicionIVA` | String | optional |
| `saldo` | Float | `@default(0)` — denormalized balance |
| `status` | ClientStatus | `@default(ACTIVE)` (Previously: String with default "active") |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |

#### Scenario: Client created with CUIT

- GIVEN a Client payload with `cuit`, `razonSocial`
- WHEN the Client is persisted
- THEN `id` is auto-generated, `saldo` is 0, `status` is ACTIVE

#### Scenario: Duplicate CUIT rejected

- GIVEN an existing Client with cuit "20-12345678-9"
- WHEN another Client is created with the same CUIT
- THEN the database rejects the insert (Prisma P2002)

### Requirement: CuentaCorrienteMovimiento Model

The system MUST define a `CuentaCorrienteMovimiento` model:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `tipo` | MovementTipo | enum: `DEBITO`, `CREDITO` (Previously: String with enum semantics) |
| `monto` | Float | required, must be > 0 |
| `fecha` | DateTime | `@default(now())` |
| `referencia` | String | optional |
| `clientId` | Int | FK → Client |

#### Scenario: DEBITO movement recorded

- GIVEN a Client with saldo 1000
- WHEN a DEBITO movement of 200 is recorded
- THEN saldo becomes 1200

#### Scenario: CREDITO movement recorded

- GIVEN a Client with saldo 1000
- WHEN a CREDITO movement of 200 is recorded
- THEN saldo becomes 800

### Requirement: Saldo Denormalization Invariant

`Client.saldo` MUST equal the sum of all `CuentaCorrienteMovimiento.monto` values (DEBITO adds, CREDITO subtracts). Enforced atomically within the same transaction as the movement insert.

#### Scenario: Atomic saldo update

- GIVEN a Client with saldo 500
- WHEN a DEBITO of 300 is recorded in a transaction
- THEN saldo is 800 AND the movement exists AND no intermediate state is visible

#### Scenario: Transaction rollback preserves saldo

- GIVEN a Client with saldo 500
- WHEN a DEBITO of 300 is attempted but the transaction fails
- THEN saldo remains 500 AND no movement record exists

### Requirement: FormulaMaterial Model

The system MUST define a `FormulaMaterial` join table between Formula and SiloStock:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `formulaId` | Int | FK → Formula |
| `siloStockId` | Int | FK → SiloStock |
| `kgPerCubicMeter` | Float | >0 |

Unique constraint on `(formulaId, siloStockId)`.

#### Scenario: Material linked

- GIVEN a Formula and a SiloStock
- WHEN a FormulaMaterial is created linking them
- THEN the FormulaMaterial is persisted and the formula recipe is queryable

#### Scenario: Duplicate pair rejected

- GIVEN an existing FormulaMaterial for (formulaId=1, siloStockId=2)
- WHEN another FormulaMaterial is created for the same pair
- THEN Prisma rejects the insert (unique constraint)

### Requirement: Order Model Field Extensions

Add to Order: `priceSnapshot` (Float, optional, frozen from Formula at creation), `completedAt` (DateTime, optional), `truckId` (Int, optional FK→Truck).

#### Scenario: priceSnapshot frozen

- GIVEN a Formula with pricePerCubicMeter=5000
- WHEN an Order is created referencing this Formula
- THEN order.priceSnapshot=5000 and remains unchanged if Formula updates

#### Scenario: completedAt set

- GIVEN an Order with status APROBADA
- WHEN POST /complete is called
- THEN completedAt is set to now()

### Requirement: SiloStock Alert Threshold

Add `alertMin Float @default(0)` to SiloStock. When `quantity < alertMin`, stock is low.

#### Scenario: Default alertMin

- GIVEN a new SiloStock is created
- WHEN the SiloStock is persisted
- THEN alertMin=0

#### Scenario: Low detection

- GIVEN a SiloStock with quantity=2.5 and alertMin=3.0
- WHEN the API returns SiloStock data
- THEN the response includes `low: true`

### Requirement: Formula, Order, SiloStock, Truck Models

The system MUST define these models with full field contracts. Endpoint behavior is OUT OF SCOPE.

(Previously: minimal stubs — recipe was JSON/String, Order lacked priceSnapshot/completedAt/truckId, SiloStock lacked alertMin, Truck lacked capacidad)

| Model | Key Fields |
|-------|-----------|
| Formula | id, name, pricePerCubicMeter (Float) |
| Order | id, clientId FK, formulaId FK, truckId? FK, quantity (Float, m³), priceSnapshot (Float), status (OrderStatus), createdAt, completedAt?, scheduledDate? |
| SiloStock | id, material (enum: arena, grava, cemento, cal), quantity (Float, tons), alertMin (Float, @default 0) |
| Truck | id, patente (unique), capacidad (Float, m³), status (TruckStatus) |

#### Scenario: All 7 models + enums exist after prisma db push

- GIVEN the Prisma schema is applied
- WHEN `prisma db push` runs
- THEN all 7 models and enums exist

---

## Relations

### Requirement: Client Relations

Client MUST have one-to-many relations to `CuentaCorrienteMovimiento` and `Order`.

#### Scenario: Client has movements

- GIVEN a Client with 3 movements
- WHEN queried with `include: { movements: true }`
- THEN all 3 movements are returned
