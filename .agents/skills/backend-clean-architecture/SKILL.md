---
name: backend-clean-architecture
description: "Trigger: backend, Express route, service, use case, repository, Prisma, controller. Move backend changes toward Clean/Hexagonal architecture."
license: Apache-2.0
metadata:
  author: "opencode"
  version: "1.0"
---

# Backend Clean Architecture

## Activation Contract

Use this skill for any change under `backend/src/**`, except pure generated output under `backend/dist/**`. Apply it especially when editing Express routes, Prisma access, validation, auth, business rules, or API response behavior.

## Hard Rules

- Keep Express routes as transport adapters: parse input, call one use case, map the result to HTTP.
- Do not add new business rules directly inside `backend/src/routes/**`.
- Keep application/domain code free of `express`, `@prisma/client`, HTTP status codes, and `Response`/`Request` types.
- Access Prisma only from infrastructure/repository code or from existing legacy routes being minimally touched.
- Prefer feature slices over technical buckets for new backend behavior: `backend/src/features/<feature>/...`.
- Do not introduce interfaces, factories, or repositories unless they invert a real external dependency or make a business rule testable.
- Preserve the existing API contract unless the task explicitly asks for a breaking change.

## Decision Gates

| Situation | Action |
| --- | --- |
| Small validation/type-only change | Keep the local structure, but avoid adding new route logic |
| New business rule | Add or extend a use case under `features/<feature>/application/` |
| New Prisma query needed by business logic | Put it behind a feature repository under `features/<feature>/infrastructure/` |
| New HTTP endpoint | Route/controller delegates to a use case; validation stays at the edge |
| Cross-feature reusable rule | Move it to a shared domain/application module only after a second real use |

## Execution Steps

1. Read the touched route, validation schema, response types, Prisma schema model, and nearby feature code before editing.
2. Identify which layer owns the change: HTTP adapter, application use case, domain rule, infrastructure repository, or schema/config.
3. Make the smallest change that improves direction toward Clean/Hexagonal architecture.
4. For new feature code, use this shape only as needed:

```text
backend/src/features/<feature>/
  application/      # use cases, ports, DTOs
  domain/           # business entities, policies, pure rules
  infrastructure/   # Prisma repositories, external services
  http/             # route/controller glue when a route grows beyond trivial wiring
```

5. Run `npm run typecheck` inside `backend/` after backend TypeScript changes.
6. If Prisma schema or migrations are touched, also apply `prisma-migrate-discipline`.

## Output Contract

Return:
- Which layer changed and why.
- Whether route-level business logic was reduced, preserved, or newly introduced.
- Any remaining legacy coupling to Express or Prisma.
- Verification command results.

## References

- `AGENTS.md`
- `backend/src/routes/`
- `backend/src/validation/`
- `backend/src/types/`
- `backend/prisma/schema.prisma`
