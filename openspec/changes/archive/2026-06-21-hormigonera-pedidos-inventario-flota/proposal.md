# Proposal: Pedidos, Inventario, Flota + Panel

## Intent

Deliver slices 2–4: Pedidos (order lifecycle), Inventario (formula + silo + smart discount), Flota (trucks + panel). Builds on slice 1 schema + clientes.

## Scope

### In
- Order CRUD + workflow PENDIENTE → APROBADA → COMPLETADA
- Payment recording: CuentaCorrienteMovimiento CREDITO (atomic)
- Formula CRUD + FormulaMaterial join table
- SiloStock CRUD + alertMin threshold
- Smart discount: on APROBADA, subtract kgPerCubicMeter × quantity from stock (atomic $transaction)
- Truck CRUD + toggle DISPONIBLE/EN_RECORRIDO + order assignment
- Panel: monthlyIncome, m³/week, peakHours, paymentStatus
- Frontend: 4 feature-sliced modules + thin pages
- Schema enums: ClientStatus, OrderStatus, TruckStatus, MovementTipo

### Out
- Portal (slice 5), role auth (slice 6), real-time, reports, tests

## Capabilities

**New:** `pedidos-crud`, `inventario-crud`, `flota-crud`, `panel-summary`

**Modified:** `hormigonera-schema` (4 enums + FormulaModel + field adds), `clientes-crud` (ClientStatus enum)

## Approach

Schema first → Zod + authenticateToken + $transaction per route pattern → 5 new routers → 4 frontend features with shadcn only.

## Affected Areas

- `schema.prisma` (mod): enums + FormulaModel + field additions
- `routes/{orders,formulas,siloStocks,trucks,panel}.ts` (new)
- `index.ts` (mod): mount 5 routers
- `features/{pedidos,inventario,flota,panel}/` (new)
- `pages/{Pedidos,PedidoDetail,Inventario,Flota,Panel}.tsx` (new, thin)
- `App.tsx` (mod): 5 routes

## Assumptions

1 order = 1 truck. Discount on approval not completion. priceSnapshot frozen at creation. Peak hours = last 30d completedAt hour. Status strings → enums. Panel via Prisma queries.

## Risks

- Stock oversell → check quantity before approve
- Enum migration → map existing string values
- Transaction complexity → flat operations, test each path

## Rollback

Revert to `feat/hormigonera-schema-clients`. `prisma db push --force-reset` if needed.

## Dependencies

Slice 1 (uncommitted on feat/hormigonera-schema-clients). shadcn/ui primitives.

## Success Criteria

- [ ] Order CRUD + approval + completion with JWT
- [ ] Payment → CREDITO + saldo atomic
- [ ] Smart discount subtracts stock atomically
- [ ] Formula + SiloStock CRUD with LOW alert
- [ ] Truck CRUD + toggle + assignment
- [ ] Panel returns summary
- [ ] 4 features render; existing unaffected
