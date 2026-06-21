# Design: Pedidos, Inventario, Flota + Panel

## Technical Approach

Extend Prisma schema with FormulaMaterial model and enums (ClientStatus, OrderStatus, TruckStatus, MovementTipo). Add fields to Order (priceSnapshot, completedAt, truckId) and SiloStock (alertMin). Backend: five new route files (orders, formulas, silos, trucks, panel) following slice 1 patterns (Zod, authenticateToken, $transaction). Frontend: four feature-sliced modules (pedidos, inventario, flota, panel) with thin pages. Smart discount atomic on approval. Panel via Prisma queries.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Enum migration | SQLite enums via string mapping; defaults for existing rows. `prisma db push`. | Manual SQL | Prisma's SQLite enum support; defaults avoid data loss. |
| Order approval transaction | Single `$transaction`: verify payment → update status → smart discount (check stock, decrement). Rollback on failure. | Sequential transactions | Atomicity prevents stock oversell; aligns with clientMovements pattern. |
| Price snapshot | Store formula.pricePerCubicMeter at creation as order.priceSnapshot. Use snapshot for calculations. | Dynamic reference | Historical orders retain original pricing. |
| Smart discount formula | decrement = (kgPerCubicMeter × quantity) / 1000 (kg→tons). If SiloStock < decrement, rollback. | Other conversions | Matches spec; unit conversion correct. |
| Peak hours query | `prisma.order.findMany` last 30d COMPLETADA, JS extract hour-of-day, count, top 3. | SQLite strftime | Prisma lacks hour extraction; JS acceptable for MVP. |
| Panel aggregations | Prisma queries only. No denormalization. | Cached tables | MVP scale; simplicity wins. |
| Truck assignment atomicity | PATCH order { truckId } in `$transaction`: verify truck DISPONIBLE, order APROBADA, set both. | Sequential updates | Prevents race conditions. |

## Data Flow

**Approve an order**:

```
PedidoDetail → useApproveOrder → approveOrder service → POST /api/orders/:id/approve
  → Prisma $transaction:
    1. Verify CREDITO movement with referencia=orderId
    2. Update order.status = APROBADA
    3. For each FormulaMaterial:
       decrement = (kgPerCubicMeter × quantity) / 1000
       if SiloStock.quantity < decrement → throw (rollback)
       else SiloStock.quantity -= decrement
    4. Return order
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | Add enums, FormulaMaterial, Order/SiloStock fields |
| `backend/src/routes/orders.ts` | Create | Order CRUD + approve + complete |
| `backend/src/routes/formulas.ts` | Create | Formula CRUD + materials |
| `backend/src/routes/silos.ts` | Create | SiloStock CRUD with alert |
| `backend/src/routes/trucks.ts` | Create | Truck CRUD + status toggle |
| `backend/src/routes/panel.ts` | Create | Panel summary |
| `backend/src/validation/{order,formula,silo,truck,panel}Schemas.ts` | Create | Zod schemas |
| `backend/src/types/{orders,formulas,silos,trucks,panel}.ts` | Create | DTOs |
| `backend/src/index.ts` | Modify | Mount 5 routers |
| `frontend/src/features/{pedidos,inventario,flota,panel}/` | Create | Feature-sliced modules |
| `frontend/src/pages/{Pedidos,PedidoDetail,Inventario,Flota,Panel}.tsx` | Create | Thin pages |
| `frontend/src/App.tsx` | Modify | Add 5 routes with ProtectedRoute |

## Interfaces / Contracts

**Prisma schema fragment**:

```prisma
enum ClientStatus { ACTIVE DISABLED }
enum OrderStatus { PENDIENTE APROBADA COMPLETADA CANCELADA }
enum TruckStatus { DISPONIBLE EN_RECORRIDO }
enum MovementTipo { DEBITO CREDITO }

model FormulaMaterial {
  id              Int      @id @default(autoincrement())
  formulaId       Int
  siloStockId     Int
  kgPerCubicMeter Float
  formula         Formula  @relation(fields: [formulaId], references: [id])
  siloStock       SiloStock @relation(fields: [siloStockId], references: [id])
  @@unique([formulaId, siloStockId])
}
```

**Atomic order approval**:

```typescript
await prisma.$transaction(async (tx) => {
  const payment = await tx.cuentaCorrienteMovimiento.findFirst({
    where: { clientId: order.clientId, tipo: "CREDITO", referencia: String(orderId) },
  });
  if (!payment) throw new Error("Payment required");
  await tx.order.update({ where: { id: orderId }, data: { status: "APROBADA" } });
  const materials = await tx.formulaMaterial.findMany({ where: { formulaId: order.formulaId } });
  for (const mat of materials) {
    const decrement = (mat.kgPerCubicMeter * order.quantity) / 1000;
    const silo = await tx.siloStock.findUnique({ where: { id: mat.siloStockId } });
    if (silo.quantity < decrement) throw new Error(`Insufficient stock: ${silo.material}`);
    await tx.siloStock.update({ where: { id: mat.siloStockId }, data: { quantity: { decrement } } });
  }
});
```

**Peak hours**:

```typescript
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const orders = await prisma.order.findMany({
  where: { status: "COMPLETADA", completedAt: { gte: thirtyDaysAgo } },
  select: { completedAt: true },
});
const hourCounts = new Map<number, number>();
for (const o of orders) {
  const hour = o.completedAt!.getHours();
  hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
}
const peakHours = [...hourCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([hour, count]) => ({ hour, count }));
```

**Smart discount**:

```typescript
const decrement = (kgPerCubicMeter * orderQuantity) / 1000;
await prisma.siloStock.update({
  where: { id: siloStockId },
  data: { quantity: { decrement } },
});
```

## Testing Strategy

No automated tests. User explicit. Recommend Vitest + RTL in a future slice.

## Migration / Rollout

- `prisma db push` with enum conversions. Defaults ensure no data loss.
- No production deploy. User does PR.

## Open Questions

None — all decisions baked into the proposal.