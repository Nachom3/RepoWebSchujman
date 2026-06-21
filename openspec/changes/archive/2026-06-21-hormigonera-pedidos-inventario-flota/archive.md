# Archive Report: Pedidos, Inventario, Flota + Panel

## Change Archived

**Change**: hormigonera-pedidos-inventario-flota
**Date Archived**: 2026-06-21
**Archived to**: `openspec/changes/archive/2026-06-21-hormigonera-pedidos-inventario-flota/`

## Specs Synced

| Domain | Action | Requirements |
|--------|--------|--------------|
| `hormigonera-schema` | Delta applied | ADDED: FormulaMaterial Model, Order Model Field Extensions, SiloStock Alert Threshold. MODIFIED: Formula/Order/SiloStock/Truck Models (full field contracts), Client Model (ClientStatus enum), CuentaCorrienteMovimiento Model (MovementTipo enum). NEW ENUMS: ClientStatus, OrderStatus, TruckStatus, MovementTipo. |
| `clientes-crud` | Delta applied | ADDED: Order Payment Recording, CREDITO Movement Semantics Extended |

### Delta Merge Details

**hormigonera-schema/spec.md**:
- Client Model: `status` field changed from `String @default("active")` to `ClientStatus @default(ACTIVE)` with "(Previously: String with default "active")" note
- CuentaCorrienteMovimiento Model: `tipo` field changed from `String` to `MovementTipo` with "(Previously: String with enum semantics)" note
- Formula, Order, SiloStock, Truck Models: replaced minimal stubs with full field contracts including priceSnapshot, completedAt, truckId, alertMin, capacidad
- Added FormulaMaterial Model requirement (join table with unique constraint)
- Added Order Model Field Extensions requirement
- Added SiloStock Alert Threshold requirement
- Added 4 new enum requirements: ClientStatus, OrderStatus, TruckStatus, MovementTipo conversions
- Updated Purpose to reflect slices 1–2

**clientes-crud/spec.md**:
- Added Order Payment Recording requirement (validates CREDITO + referencia against Order ownership)
- Added CREDITO Movement Semantics Extended requirement (dual purpose: generic or order-specific)

## Archive Contents

- proposal.md ✅
- design.md ✅
- specs/ ✅ (clientes-crud, hormigonera-schema)
- tasks.md ✅
- verify-report.md ✅

### Task Completion

All implementation tasks (1.1–1.8, 2.1–2.10, 3.1–3.14, 4.1–4.3) are marked [x].

Unchecked task (non-implementation):
- 4.4: Document manual smoke test — SKIPPED (user does manual testing)

**Exceptional stale-checkbox reconciliation**: Not required — only unchecked task is a documentation step explicitly skipped by design.

## Source of Truth Updated

The following main specs now reflect the new behavior:
- `openspec/specs/hormigonera-schema/spec.md` — now includes enums (ClientStatus, OrderStatus, TruckStatus, MovementTipo), FormulaMaterial model, Order field extensions, SiloStock alertMin
- `openspec/specs/clientes-crud/spec.md` — now includes order payment recording and CREDITO semantics

## Post-Verify Fix Applied

The verify-report notes a post-verify fix applied to `clientMovements.ts`:
- **Fix**: Added validation for Order Payment Recording — when `tipo=CREDITO` and `referencia` matches `/^\d+$/`, fetches the Order and verifies `clientId` matches the path param. Returns 400 with appropriate error if not found or wrong client.
- **Status**: All CRITICAL issues resolved. Backend compiles cleanly.

## Verification

- [x] Main specs updated correctly (delta applied)
- [x] Change folder moved to archive
- [x] Archive contains all artifacts (proposal, specs, design, tasks, verify-report)
- [x] No unchecked implementation tasks
- [x] Active changes directory no longer has this change
