# Tasks: Hormigonera Schema + Clientes Module

## Review Workload Forecast

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

## Phase 1: PR 1 — Schema Foundation

- [x] 1.1 Add `UserRole` enum (`ADMIN`, `OPERADOR`) to `backend/prisma/schema.prisma`
- [x] 1.2 Add `role: UserRole @default(ADMIN)` to existing `User` model
- [x] 1.3 Add `Client` model (cuit @unique, razonSocial, saldo Float @default(0), status, timestamps)
- [x] 1.4 Add `CuentaCorrienteMovimiento` model (tipo, monto, fecha, referencia, clientId FK)
- [x] 1.5 Add `Formula`, `Order`, `SiloStock`, `Truck` models (minimal fields, FKs only)
- [x] 1.6 Add `Client` ↔ `CuentaCorrienteMovimiento` and `Client` ↔ `Order` relations
- [x] 1.7 Run `npx prisma generate` and `npx prisma db push`
- [x] 1.8 Verify: User table has `role` column with ADMIN defaults; new tables exist
- [ ] 1.9 Commit + push PR 1

## Phase 2: PR 2 — Backend Clientes API

- [x] 2.1 Create `backend/src/validation/clientSchemas.ts` (createClient, updateClient with CUIT format)
- [x] 2.2 Create `backend/src/validation/movementSchemas.ts` (createMovement with tipo enum, monto > 0)
- [x] 2.3 Create `backend/src/types/clients.ts` (CreateClientDto, UpdateClientDto, ClientResponse)
- [x] 2.4 Create `backend/src/types/movements.ts` (CreateMovementDto, MovementResponse)
- [x] 2.5 Create `backend/src/routes/clients.ts` (POST, GET list, GET by id, PATCH, DELETE soft-disable; P2002 handler)
- [x] 2.6 Create `backend/src/routes/clientMovements.ts` (POST with Prisma $transaction; GET history desc)
- [x] 2.7 Mount routers in `backend/src/index.ts` under `/api/clients` and `/api/clients/:id/movements`
- [x] 2.8 Smoke test: register, login, JWT, POST client, GET list, POST movement, verify saldo
- [ ] 2.9 Commit + push PR 2

## Phase 3: PR 3 — Frontend Clientes Feature

- [x] 3.1 Run `npx shadcn@latest init` in `frontend/`
- [x] 3.2 Add shadcn primitives: button, input, label, select, dialog, form, table, badge, card, separator
- [x] 3.3 Create `frontend/src/features/clientes/types.ts` (Client, Movement, Status, Tipo types + zod schemas)
- [x] 3.4 Create `frontend/src/features/clientes/services/clientService.ts` (getAll, getById, create, update, disable)
- [x] 3.5 Create `frontend/src/features/clientes/services/movementService.ts` (create, list)
- [x] 3.6 Create `frontend/src/features/clientes/hooks/useClients.ts`
- [x] 3.7 Create `frontend/src/features/clientes/hooks/useClientMovements.ts`
- [x] 3.8 Create `frontend/src/features/clientes/components/ClientList/` (ClientList.tsx, types, index)
- [x] 3.9 Create `frontend/src/features/clientes/components/ClientRow/` (ClientRow.tsx, types, index)
- [x] 3.10 Create `frontend/src/features/clientes/components/ClientDetail/` (ClientDetail.tsx, types, index)
- [x] 3.11 Create `frontend/src/features/clientes/components/ClientForm/` (ClientForm.tsx, types, index)
- [x] 3.12 Create `frontend/src/features/clientes/components/MovementRow/` (MovementRow.tsx, types, index)
- [x] 3.13 Create `frontend/src/features/clientes/index.ts` (public barrel)
- [x] 3.14 Create `frontend/src/pages/Clientes.tsx` (thin: renders ClientList)
- [x] 3.15 Create `frontend/src/pages/ClienteDetail.tsx` (thin: renders ClientDetail with :id)
- [x] 3.16 Add routes in `frontend/src/App.tsx`: `/clientes` and `/clientes/:id` with ProtectedRoute
- [ ] 3.17 Smoke test: empty list, create client, list, detail, record movement, verify saldo
- [ ] 3.18 Commit + push PR 3

## Phase 4: Verification (after all 3 PRs)

- [x] 4.1 Run `npx prisma db push` in fresh checkout — succeeds
- [ ] 4.2 Register, login, JWT — role = ADMIN default
- [ ] 4.3 Create 2 clientes, soft-disable one, verify list filter
- [ ] 4.4 Record DEBITO and CREDITO movements, verify saldo math + atomicity
- [ ] 4.5 Verify login/register still works (regression)
