# Tasks: Pedidos, Inventario, Flota + Panel

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

Estimated changed lines: ~1100–1500. Delivery strategy: exception-ok.

## Phase 1: Schema + Foundation

- [x] 1.1 Add 4 enums to `schema.prisma`: ClientStatus, OrderStatus, TruckStatus, MovementTipo
- [x] 1.2 Add FormulaMaterial model (id, formulaId, siloStockId, kgPerCubicMeter, @@unique)
- [x] 1.3 Add fields to Order: `priceSnapshot Float`, `completedAt DateTime?`, `truckId Int? FK`
- [x] 1.4 Add field to SiloStock: `alertMin Float @default(0)`
- [x] 1.5 Convert Client.status String → ClientStatus enum (default ACTIVE)
- [x] 1.6 Convert Order.status String → OrderStatus enum (default PENDIENTE)
- [x] 1.7 Convert Truck.status String → TruckStatus enum (default DISPONIBLE)
- [x] 1.8 Convert CuentaCorrienteMovimiento.tipo String → MovementTipo enum (default DEBITO); run `prisma generate` + `prisma db push`

## Phase 2: Backend Routes + Validation

- [x] 2.1 Create `backend/src/validation/orderSchemas.ts` (createOrder, updateOrder, listOrdersQuery, approveOrder)
- [x] 2.2 Create `backend/src/validation/{formula,silo,truck,panel}Schemas.ts`
- [x] 2.3 Create `backend/src/types/{orders,formulas,silos,trucks,panel}.ts` (DTOs, response types)
- [x] 2.4 Create `backend/src/routes/orders.ts` — CRUD + approve (atomic: verify CREDITO → status → smart discount) + complete
- [x] 2.5 Create `backend/src/routes/formulas.ts` — CRUD + /:id/materials management
- [x] 2.6 Create `backend/src/routes/silos.ts` — CRUD; GET includes `isLow: quantity < alertMin`
- [x] 2.7 Create `backend/src/routes/trucks.ts` — CRUD + status toggle; assign (atomic: verify DISPONIBLE + APROBADA)
- [x] 2.8 Create `backend/src/routes/panel.ts` — GET /summary: monthlyIncome, m3/week, peakHours, paymentStatus
- [x] 2.9 Mount all 5 routers in `backend/src/index.ts`
- [x] 2.10 Verify TypeScript compiles: `cd backend && npx tsc --noEmit`

## Phase 3: Frontend Features

### 3A: Pedidos
- [x] 3.1 Create `features/pedidos/types.ts` + zod schemas; `services/orderService.ts`; `hooks/{useOrders,useOrder,useApproveOrder}.ts`
- [x] 3.2 Create `features/pedidos/components/{PedidoList,PedidoRow,PedidoDetail,PedidoForm}/` (.tsx + .types.ts + index.ts each)
- [x] 3.3 Create `features/pedidos/index.ts` barrel; `pages/Pedidos.tsx` + `pages/PedidoDetail.tsx`

### 3B: Inventario
- [x] 3.4 Create `features/inventario/types.ts` + schemas; `services/{formulaService,siloService}.ts`; `hooks/{useFormulas,useFormula,useSilos,useSilo}.ts`
- [x] 3.5 Create `features/inventario/components/{FormulaList,FormulaForm,SiloList,SiloForm,FormulaMaterialEditor}/` (.tsx + .types.ts + index.ts each)
- [x] 3.6 Create `features/inventario/index.ts` barrel; `pages/Inventario.tsx` (tabs Formulas | Silos)

### 3C: Flota
- [x] 3.7 Create `features/flota/types.ts` + schemas; `services/truckService.ts`; `hooks/{useTrucks,useTruck,useToggleTruck}.ts`
- [x] 3.8 Create `features/flota/components/{TruckList,TruckRow,TruckForm}/` with status toggle
- [x] 3.9 Create `features/flota/index.ts` barrel; `pages/Flota.tsx`

### 3D: Panel
- [x] 3.10 Create `features/panel/types.ts`; `services/panelService.ts`; `hooks/usePanelSummary.ts`
- [x] 3.11 Create `features/panel/components/{PanelView,MetricCard,WeeklyBar,PeakHourList}/` (WeeklyBar = Tailwind divs, no chart lib)
- [x] 3.12 Create `features/panel/index.ts` barrel; `pages/Panel.tsx`

### Wiring
- [x] 3.13 Add shadcn: `npx shadcn@latest add tabs alert -y` (tabs for Inventario, alert for low stock)
- [x] 3.14 Add 5 routes in `App.tsx`: `/pedidos`, `/pedidos/:id`, `/inventario`, `/flota`, `/panel` with ProtectedRoute

## Phase 4: Verification

- [x] 4.1 Verify `prisma db push` works on updated schema
- [x] 4.2 Verify backend compiles: `cd backend && npx tsc --noEmit`
- [x] 4.3 Verify frontend compiles: `cd frontend && npx tsc --noEmit`
- [ ] 4.4 Document manual smoke test (order lifecycle, formulas, silos, trucks, panel) — SKIPPED (user does manual testing)
