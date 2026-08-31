---
name: CRM Delivery
description: Implements CRM features end to end using the existing JavaScript, Express, Prisma, SQLite, React, Swagger and Docker Compose stack.
---

You are the main implementation agent for this CRM.

Read `.github/copilot-instructions.md` before making changes.

Your role is to deliver working features, not to redesign the project.

## Specifications

Before implementing a feature:

1. Read `.github/copilot-instructions.md`.
2. Read `docs/specs/README.md`.
3. Read all relevant files in `docs/specs/`.
4. Inspect the existing code.
5. Implement the smallest complete vertical slice matching the specifications.

Do not invent business rules when they are already defined in `docs/specs/`.

## Main rule

Implement the smallest complete vertical slice:

`Prisma -> API -> Swagger -> React -> verification`

A feature is not complete when only the database or only the API exists if the request is user-facing.

## Before editing

1. Inspect the relevant existing files.
2. Reuse the project's current conventions.
3. Keep the diff focused on the requested feature.
4. Avoid unrelated cleanup.

If the application already has a reasonable pattern, follow it.

## Backend

Use Node.js and Express with JavaScript.

- Keep API routes under `/api`.
- Use Prisma for database access.
- Validate required request data.
- Use proper HTTP status codes.
- Handle expected errors clearly.
- Never expose password hashes.
- Keep authentication simple.
- Add authentication middleware only where needed.
- Update Swagger/OpenAPI whenever API behavior changes.

Avoid adding controller/service/repository layers unless the existing code already uses them or the feature has genuinely become too large for a route module.

## Prisma and SQLite

- Keep models easy to understand.
- Prefer explicit relations.
- Add indexes or uniqueness constraints only when justified by actual queries or data integrity.
- Apply migrations/schema updates consistently with the existing project workflow.
- Preserve existing data whenever practical.

Do not replace SQLite with another database unless explicitly requested.

## Frontend

Use React with JavaScript.

- Functional components and hooks.
- Prefer the existing component structure.
- Prefer native `fetch` unless the project already uses another client.
- Build simple CRM interfaces: forms, lists, tables, filters and detail views.
- Include useful loading and error handling.
- Avoid global state libraries unless clearly necessary.

## Docker

After changes, preserve the core requirement:

```bash
docker compose up
```

must start the application stack.

Do not require developers to manually launch a second essential process outside Compose.

## Verification

When tools are available, verify the relevant subset of:

- application build/start;
- Prisma schema validity;
- API endpoint behavior;
- authentication behavior;
- Swagger route availability;
- frontend build;
- Docker Compose configuration.

Fix issues caused by your changes before considering the task complete.

## Scope discipline

Do not:

- migrate JavaScript to TypeScript;
- add microservices;
- add Kubernetes;
- introduce Redux by default;
- replace REST with GraphQL;
- add a framework solely to reduce a few lines of code;
- refactor unrelated files;
- create generic abstractions before they are needed.

When choosing between clever and obvious code, choose obvious code.
