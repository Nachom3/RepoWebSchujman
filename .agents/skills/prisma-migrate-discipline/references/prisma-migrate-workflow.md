# Prisma Migrate Workflow Reference

This file is the local reference for the `prisma-migrate-discipline` skill, adapted for the hormigonera backend (SQLite + Prisma 6).

## Official Prisma guidance distilled

- Standard schema changes should start in `backend/prisma/schema.prisma`, then generate a migration with `prisma migrate dev --name ...`.
- For risky or custom work, Prisma recommends `prisma migrate dev --create-only`, then reviewing or extending the generated SQL.
- Production and CI should apply already-committed migrations with `prisma migrate deploy`; they should not generate new migrations.
- Baselining an existing database is a separate workflow using `prisma migrate diff` plus `prisma migrate resolve`; it is not the same as hand-editing a normal migration.

## Project-specific notes

- This backend uses **SQLite** (`backend/prisma/dev.db`) via `DATABASE_URL=file:./dev.db`. SQLite supports a subset of Prisma features — avoid Postgres-only assumptions (RLS, JSONB, partial indexes with custom expressions, etc.).
- The Prisma client is generated into `node_modules/.prisma/client` (Prisma 6 default) — not into the source tree.
- `package.json` exposes two helper scripts: `prisma:migrate` (dev) and `prisma:generate`. Use `npx prisma migrate deploy` for production-style apply.
- The schema is the source of truth for entities: `User`, `Client`, `CuentaCorrienteMovimiento`, `Formula`, `Order`, `SiloStock`, `Truck`, `FormulaMaterial`. Any new model must be justified in `schema.prisma` first.

## What this repo does NOT need (Prisma 6 + SQLite, single-tenant, no infra)

- No `db/init.sql` bootstrap (no Docker, no RLS, no `app_runtime` role, no `evolution` database).
- No RLS policies or drift tests — SQLite is single-tenant.
- No `prisma.config.ts` separation — Prisma 6 keeps `datasource db` inside `schema.prisma`.

## Commands cheatsheet

```bash
# Local dev — generate a new migration
cd backend
npx prisma migrate dev --name descriptive_migration_name

# Local dev — review first, apply later
npx prisma migrate dev --create-only --name descriptive_migration_name
# then inspect backend/prisma/migrations/<timestamp>_descriptive_migration_name/migration.sql

# Local dev — regenerate client after schema edit (rare; migrate dev already does this)
npm run prisma:generate

# Pre-merge checks
npx prisma format
npx prisma validate
npx prisma migrate status

# Production-style apply (CI / staging / prod) — never generates new migrations
npx prisma migrate deploy
```

Official docs used:
- https://www.prisma.io/docs/cli/migrate/dev
- https://www.prisma.io/docs/orm/more/best-practices
- https://www.prisma.io/docs/orm/prisma-migrate/getting-started
