# Design: Hormigonera Schema + Clientes Module

## Technical Approach

Extend the existing Express + Prisma + JWT backend with 6 new models and a `UserRole` enum. Add two route modules (`clients`, `clientMovements`) following the canonical `auth.ts` pattern: Zod validation → `authenticateToken` → handler → Prisma. On the frontend, create a new `features/clientes/` feature-sliced module with shadcn/ui table primitives, thin pages, and custom hooks returning `{ data, isLoading, error }`. Saldo updates happen inside a single Prisma `$transaction`.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Frontend structure | Feature-sliced (`features/clientes/`) | Atomic, flat components | Project already uses feature-sliced for auth/landing/dashboard. |
| State management | Plain hooks (`{ data, isLoading, error }`) | React Query, SWR, Redux | No deps installed; matches skill's SOLID principle. |
| Form handling | Controlled state with `onChange` | react-hook-form + zod | Not installed; overkill for 2 simple forms. |
| Saldo update | Prisma `$transaction` | Optimistic, trigger, cron | Spec mandates atomicity; transaction is the only guarantee. |
| shadcn install | `npx shadcn@latest add table badge select` | Manual copy | CLI generates theme-matched primitives. |
| Auth gating | `authenticateToken` middleware, no role check | Role-based middleware | Role enforcement deferred per spec. |
| API client | Centralized `lib/api.ts` (axios, already exists) | Per-feature services | Axios already handles token injection. |

## Data Flow: Record Movement

```
MovementForm → useCreateMovement() → api.post()
                                          │
                                     POST /api/clients/:id/movements
                                          │
                                     validateBody (Zod)
                                          │
                                     authenticateToken
                                          │
                                     prisma.$transaction([
                                       create(CuentaCorrienteMovimiento)
                                       update(Client.saldo)
                                     ])
                                          │
                                     201 { id, tipo, monto, fecha }
                                          │
                               refetch client ◄┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | UserRole enum, Client/Formula/Order/SiloStock/Truck/CuentaCorrienteMovimiento models |
| `backend/src/validation/clientSchemas.ts` | Create | Zod: createClientBody, updateClientBody, listClientsQuery |
| `backend/src/validation/movementSchemas.ts` | Create | Zod: createMovementBody |
| `backend/src/types/clients.ts` | Create | ClientResponse, ClientListResponse types |
| `backend/src/types/movements.ts` | Create | MovementResponse types |
| `backend/src/routes/clients.ts` | Create | CRUD: list, get, create, update, soft-delete |
| `backend/src/routes/clientMovements.ts` | Create | POST (atomic $transaction), GET (fecha desc) |
| `backend/src/index.ts` | Modify | Mount clientsRouter + clientMovementsRouter |
| `frontend/src/features/clientes/types.ts` | Create | Client, CuentaCorrienteMovimiento types |
| `frontend/src/features/clientes/schemas.ts` | Create | Zod schemas for client form validation |
| `frontend/src/features/clientes/services/clientService.ts` | Create | API calls: list, get, create, update, disable |
| `frontend/src/features/clientes/services/movementService.ts` | Create | API calls: listMovements, createMovement |
| `frontend/src/features/clientes/hooks/useClients.ts` | Create | Fetches client list |
| `frontend/src/features/clientes/hooks/useClient.ts` | Create | Fetches single client by id |
| `frontend/src/features/clientes/hooks/useCreateMovement.ts` | Create | Mutation for movement, refetches client |
| `frontend/src/features/clientes/components/ClientList/` | Create | Table + filter (ClientList.tsx, types, index) |
| `frontend/src/features/clientes/components/ClientRow/` | Create | TableRow: CUIT, saldo, status badge |
| `frontend/src/features/clientes/components/ClientDetail/` | Create | Card: contact, balance, movement history |
| `frontend/src/features/clientes/components/ClientForm/` | Create | Create/edit form: CUIT, razonSocial, contact |
| `frontend/src/features/clientes/components/MovementRow/` | Create | TableRow: tipo badge, monto, fecha |
| `frontend/src/features/clientes/index.ts` | Create | Public barrel |
| `frontend/src/pages/Clientes.tsx` | Create | Thin page → ClientList |
| `frontend/src/pages/ClienteDetail.tsx` | Create | Thin page → ClientDetail by :id |
| `frontend/src/App.tsx` | Modify | Add `/clientes` and `/clientes/:id` routes |

## Interfaces / Contracts

**Prisma schema fragment:**
```prisma
enum UserRole { ADMIN  OPERADOR }
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  role         UserRole @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
model Client {
  id Int @id @default(autoincrement())  cuit String @unique
  razonSocial String  direccion String?  telefono String?
  email String?  contacto String?  condicionIVA String?
  saldo Float @default(0)  status String @default("active")
  createdAt DateTime @default(now())  updatedAt DateTime @updatedAt
  movements CuentaCorrienteMovimiento[]  orders Order[]
}
model CuentaCorrienteMovimiento {
  id Int @id @default(autoincrement())  tipo String  monto Float
  fecha DateTime @default(now())  referencia String?
  clientId Int  client Client @relation(fields: [clientId], references: [id])
}
```

**Atomic movement insert:**
```ts
const [movement] = await prisma.$transaction([
  prisma.cuentaCorrienteMovimiento.create({ data: { tipo, monto, clientId, referencia } }),
  prisma.client.update({ where: { id: clientId },
    data: { saldo: tipo === "DEBITO" ? client.saldo + monto : client.saldo - monto } }),
]);
```

**shadcn primitives per component:**

| Component | Primitives |
|-----------|-----------|
| ClientList | Table, Input, Button |
| ClientRow | TableRow, TableCell, Badge |
| ClientDetail | Card, Badge, Button, Separator |
| ClientForm | Input, Label, Button, Select |
| MovementRow | TableRow, TableCell, Badge |

## Testing Strategy

No test runner installed (Vitest + RTL absent). Known gap. Recommend Vitest + React Testing Library + MSW for a future slice. This slice: manual smoke testing via curl and browser.

## Migration / Rollout

`npx prisma db push` applies new models. Existing Users get `role = ADMIN` via Prisma default — no data migration. No production deploy (local dev only).

## Open Questions

None — all decisions resolved by existing patterns and spec constraints.
