---
name: prisma-migrate-discipline
description: "Trigger: Prisma, prisma migrate, schema.prisma, migration.sql, db push, migrate deploy. Enforce the schema-first Prisma migration workflow and guard unsafe SQL edits in the hormigonera backend."
license: Apache-2.0
metadata:
  author: "opencode"
  version: "1.0"
---

# Prisma Migrate Discipline

## Activation Contract

Use this skill whenever a task touches `backend/prisma/schema.prisma`, `backend/prisma/migrations/**`, `prisma migrate`, `prisma db push`, `migrate deploy`, or asks whether a migration SQL file should be edited manually.

## Hard Rules

- Treat `backend/prisma/schema.prisma` as the source of truth for Prisma-supported schema changes.
- Never design normal table, column, relation, index, or enum changes by editing `migration.sql` first.
- Never edit, rename, or delete an applied migration.
- Never use `prisma db push` for staging or production migration work.
- Never use `prisma migrate deploy` in local development to create migrations; `deploy` only applies already-generated migrations in staging/production.

## Decision Gates

| Situation | Action |
| --- | --- |
| Prisma can express the change | Edit `backend/prisma/schema.prisma`, then run `cd backend && npx prisma migrate dev --name <descriptive_name>` (or `npm run prisma:migrate -- --name <name>`) |
| Rename, backfill, risky type change, or other unsupported SQL | Run `cd backend && npx prisma migrate dev --create-only --name <descriptive_name>`, then append only the necessary manual SQL |
| Staging or production | Apply committed migrations with `cd backend && npx prisma migrate deploy`; do not generate new ones there |
| Need to reset the local dev DB | Use `rm backend/prisma/dev.db && cd backend && npx prisma migrate dev` only on local dev — never on shared environments |

## Execution Steps

1. Read `AGENTS.md`, `backend/prisma/schema.prisma`, and any touched migration before changing anything.
2. Decide whether the change is Prisma-supported or needs manual SQL for data safety / unsupported features.
3. For Prisma-supported changes, edit `backend/prisma/schema.prisma` first and generate the migration from Prisma.
4. Review generated SQL before applying it; manual SQL is allowed only for the unsupported or data-preserving part.
5. Before closing, run these focused commands one at a time: `prisma format`, `prisma validate`, `prisma migrate status`, `prisma generate`.
6. Run `npm run typecheck` (or `npx tsc --noEmit`) inside `backend/` to make sure the generated client still type-checks.

## Output Contract

Return:
- Whether the main change was made in `schema.prisma`.
- Which migration was generated (path under `backend/prisma/migrations/`).
- Whether manual SQL was added, and exactly why Prisma could not own that part.
- Any residual risk such as drift, destructive SQL, or an applied-migration conflict.

## References

- `AGENTS.md`
- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`
- `.agents/skills/prisma-migrate-discipline/references/prisma-migrate-workflow.md`
