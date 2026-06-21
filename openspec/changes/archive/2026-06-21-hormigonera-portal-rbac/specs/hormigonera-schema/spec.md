# Delta for Hormigonera Schema

## ADDED Requirements

### Requirement: PortalSession Model

The system MUST define a `PortalSession` model with the following fields:

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Int | `@id @default(autoincrement())` |
| `clientId` | Int | FK → Client, required |
| `token` | String | `@unique` (global) |
| `expiresAt` | DateTime | required |
| `createdAt` | DateTime | `@default(now())` |

#### Scenario: Session created with token and expiry

- GIVEN a Client with id=5
- WHEN a PortalSession is created for that client
- THEN it has a unique token, expiresAt = now + 24h, clientId = 5

#### Scenario: Duplicate token rejected

- GIVEN an existing PortalSession with token "abc-123"
- WHEN another PortalSession is created with the same token
- THEN Prisma rejects the insert (unique constraint)

#### Scenario: PortalSession linked to Client

- GIVEN a PortalSession with clientId=5
- WHEN queried with `include: { client: true }`
- THEN the related Client is returned

### Requirement: Order.obraAddress Field

Add `obraAddress String?` (optional) to the Order model. Stores the delivery address for portal-created orders.

#### Scenario: Portal order with obraAddress

- GIVEN an Order created from the portal
- WHEN the Order is persisted with obraAddress "Av. Principal 123"
- THEN obraAddress is stored and returned in API responses

#### Scenario: Admin-created order without obraAddress

- GIVEN an Order created by an admin
- WHEN the Order is persisted without obraAddress
- THEN obraAddress is null (optional field)

---

## MODIFIED Requirements

### Requirement: Formula, Order, SiloStock, Truck Models

The system MUST define these models with full field contracts. Endpoint behavior is OUT OF SCOPE.

(Previously: Order row lacked obraAddress field)

| Model | Key Fields |
|-------|-----------|
| Formula | id, name, pricePerCubicMeter (Float) |
| Order | id, clientId FK, formulaId FK, truckId? FK, quantity (Float, m³), priceSnapshot (Float), status (OrderStatus), createdAt, completedAt?, scheduledDate?, obraAddress? (String) |
| SiloStock | id, material (enum: arena, grava, cemento, cal), quantity (Float, tons), alertMin (Float, @default 0) |
| Truck | id, patente (unique), capacidad (Float, m³), status (TruckStatus) |

#### Scenario: All 7 models + enums exist after prisma db push

- GIVEN the Prisma schema is applied
- WHEN `prisma db push` runs
- THEN all 7 models and enums exist

#### Scenario: Order with obraAddress persisted

- GIVEN an Order with obraAddress "Calle Falsa 123"
- WHEN the Order is queried
- THEN obraAddress returns "Calle Falsa 123"
