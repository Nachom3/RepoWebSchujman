# Proposal: Hormigonera Schema + Clientes Module

## Intent

The repo is pivoting from cátedra Login Fullstack to **Sistema de Gestión para Plantas de Hormigón**. Slice 1 lays the Prisma schema foundation and delivers the Clientes module so the admin can register constructoras, track contact data, and operate cuenta corriente with a full transaction log. Without this, no order, invoicing, or portal flow can exist.

## Scope

**In:** Prisma models `Client` (CUIT unique, contact, denormalized saldo), `Formula`, `Order`, `SiloStock`, `Truck`, `CuentaCorrienteMovimiento`; `UserRole` enum on `User`. Clientes CRUD + Movements endpoints. Saldo updated only inside the same `$transaction` as the movement. Feature-sliced frontend (Clientes feature). Zod + JWT. Role enforcement deferred.

**Out:** Order creation, approval, payment recording. Formula/SiloStock/Truck endpoints. Portal. Role-based auth. Deploy to cátedra server.

## Capabilities

**New:**
- `hormigonera-schema` — Prisma schema: Client (+ contact), Formula, Order, SiloStock, Truck, CuentaCorrienteMovimiento, UserRole enum
- `clientes-crud` — Admin CRUD: CUIT, status, contact, cuenta corriente history, balance

**Modified:** `auth` (implicit) — `User.role` enum, default `ADMIN`. No behavior change in slice 1.

## Approach

1. Add 6 models + `UserRole` enum to `schema.prisma`. Minimal relations — only FKs needed for Clientes + Movements.
2. `Client.saldo` updated ONLY inside the same Prisma `$transaction` as the `CuentaCorrienteMovimiento` insert (DEBITO +saldo, CREDITO −saldo).
3. `routes/clients.ts` + `routes/clientMovements.ts` follow auth.ts: Zod validation, `authenticateToken`, soft-disable on DELETE. Mount `/clients[/...]` + `/api/clients[/...]` in `index.ts`.
4. **Frontend: feature-sliced** (per `react-feature-architecture` skill). New `features/clientes/` with `components/<Name>/` (one per folder, `.tsx + .types.ts + index.ts`), `hooks/`, `services/`, `types.ts`, `schemas.ts`, public `index.ts`. `pages/` stay thin, delegate to feature. Cross-feature primitives come from shadcn/ui in `components/ui/`.

## Affected Areas

`schema.prisma` (mod); `routes/{clients,clientMovements}.ts` (new); `validation/{client,movement}Schemas.ts` + `types/{clients,movements}.ts` (new); `index.ts` (mod). Frontend feature-sliced: new `features/clientes/` (components: ClientList, ClientDetail, ClientForm, ClientRow, MovementRow — each in its own folder with `.tsx + .types.ts + index.ts`; plus `hooks/`, `services/`, `types.ts`, `schemas.ts`, public `index.ts`). `components/ui/` populated from shadcn/ui. `pages/{Clientes,ClienteDetail}.tsx` (new, thin). `App.tsx` (mod, adds routes).

## Risks

| Risk | Mitigation |
|------|------------|
| `UserRole` enum on existing `User` rows | Default `ADMIN`; Prisma handles on `db push`. |
| CUIT uniqueness edge case | Global unique; re-enable needs manual override. P2002 handled. |
| `Client.saldo` denormalization drift | Update only inside `$transaction` with movement insert. |
| bcrypt 10 vs 12 discrepancy | Noted; not touched in this slice. |
| SQLite scaling | Acceptable for MVP. |
| No role enforcement yet | Documented as deferred. |

## Rollback Plan

Revert branch `feat/hormigonera-schema-clients` to `main` (164f35e). No production deploy; local `git reset --hard main` + drop migration if created.

## Dependencies

`npx prisma generate` after schema edit. Zod, bcrypt, jsonwebtoken already installed.

## Success Criteria

- [ ] `prisma db push` succeeds; existing Users default `role = ADMIN`
- [ ] CRUD constructoras via API; CUIT globally unique
- [ ] `POST /clients/:id/movements` records movement and updates `saldo` atomically; `GET` returns history desc
- [ ] Frontend Clientes list + ClienteDetail (contact, balance, history) render
- [ ] All endpoints require valid JWT; existing login/register unaffected
