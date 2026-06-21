# Delta for Clientes CRUD

## ADDED Requirements

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
