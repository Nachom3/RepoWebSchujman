# Hormigonera Schema Specification

## Purpose

Prisma schema foundation for the concrete plant management system. Defines data models, enums, relations, and invariants for slice 1. Endpoint behavior is NOT covered here.

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
| `status` | String | `@default("active")` |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |

#### Scenario: Client created with CUIT

- GIVEN a Client payload with `cuit`, `razonSocial`
- WHEN the Client is persisted
- THEN `id` is auto-generated, `saldo` is 0, `status` is "active"

#### Scenario: Duplicate CUIT rejected

- GIVEN an existing Client with cuit "20-12345678-9"
- WHEN another Client is created with the same CUIT
- THEN the database rejects the insert (Prisma P2002)

### Requirement: CuentaCorrienteMovimiento Model

The system MUST define a `CuentaCorrienteMovimiento` model:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `tipo` | String | enum: `DEBITO`, `CREDITO` |
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

### Requirement: Formula, Order, SiloStock, Truck Models

The system MUST define these models with minimal fields. Endpoint behavior is OUT OF SCOPE.

| Model | Key Fields |
|-------|-----------|
| Formula | id, name, recipe (JSON/String) |
| Order | id, clientId FK, formulaId FK, quantity, status, deliveryDate |
| SiloStock | id, material, quantity, unit |
| Truck | id, patente, capacity, status |

#### Scenario: Schema includes all models

- GIVEN the Prisma schema is applied
- WHEN `prisma db push` runs
- THEN all 6 models and UserRole enum exist

---

## Relations

### Requirement: Client Relations

Client MUST have one-to-many relations to `CuentaCorrienteMovimiento` and `Order`.

#### Scenario: Client has movements

- GIVEN a Client with 3 movements
- WHEN queried with `include: { movements: true }`
- THEN all 3 movements are returned
