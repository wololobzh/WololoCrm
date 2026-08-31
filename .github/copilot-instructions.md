# CRM project instructions

## Project specifications

Les spécifications fonctionnelles du projet sont dans :

`docs/specs/`

Avant de développer ou modifier une fonctionnalité :

1. Lire `docs/specs/README.md`.
2. Lire le ou les fichiers de specs liés à la fonctionnalité.
3. Vérifier le code existant.
4. Implémenter conformément aux specs.

En cas de contradiction, l'ordre de priorité est :

1. La demande actuelle de l'utilisateur.
2. Les fichiers dans `docs/specs/`.
3. Le code existant.
4. Les choix par défaut de l'agent.

## Goal

Build and maintain a small CRM that stays simple to understand, run and modify.

The application must start with:

```bash
docker compose up
```

Do not turn this project into a large-scale architecture.

## Required stack

- JavaScript only. Do not migrate the project to TypeScript.
- Backend: Node.js + Express.
- ORM: Prisma.
- Database: SQLite.
- Frontend: React + Vite, HTML/CSS/JavaScript.
- Authentication: simple email/password authentication with hashed passwords and JWT.
- API documentation/testing: Swagger UI.
- Database browser: a lightweight SQLite web client started by Docker Compose.
- Containers: Docker Compose.

## Preferred project structure

```text
.
├── client/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── data/
├── docker-compose.yml
└── .github/
    ├── copilot-instructions.md
    └── agents/
```

This is a preferred structure, not a reason to reorganize working code unnecessarily.

## Architecture rules

Prefer the simplest solution that works.

- One backend application.
- One React frontend.
- One SQLite database file.
- REST API under `/api`.
- Swagger UI exposed under `/api-docs`.
- No microservices.
- No Kubernetes.
- No event bus.
- No CQRS.
- No repository pattern unless there is a concrete need.
- No dependency injection framework.
- No Redux unless application state genuinely requires it.
- No Next.js, NestJS, GraphQL or other framework migration unless explicitly requested.
- Do not create abstractions for code that is used only once.
- Do not introduce a new dependency when a few clear lines of code are sufficient.

## Database

Use Prisma as the only application-level access layer to SQLite.

Prefer explicit, readable models and relations.

For every schema change:

1. update `schema.prisma`;
2. create/apply the Prisma migration when appropriate;
3. update API behavior;
4. update Swagger documentation;
5. update the frontend if the feature is user-facing.

The SQLite database file must live in a Docker-mounted persistent directory such as `/data`.

## Authentication

Keep authentication deliberately small.

- A `User` model with a unique email and password hash is enough initially.
- Hash passwords with a well-known password hashing package such as `bcryptjs`.
- Never store or return plaintext passwords.
- Use JWT for authenticated API requests.
- Protect only routes that need authentication.
- Do not build OAuth, SSO, refresh-token rotation, RBAC or permission engines unless requested.

## API

- Use REST.
- Return JSON.
- Use appropriate HTTP status codes.
- Keep route handlers small and readable.
- Validate required inputs.
- Return useful error messages without leaking stack traces or secrets.
- Document each public API route in Swagger/OpenAPI.

## Frontend

Keep React components small and practical.

- Use functional components and hooks.
- Prefer `fetch` unless an HTTP client is already installed.
- Keep styling simple.
- Do not add a design system unless requested.
- Implement loading, empty and error states when useful.
- Favor straightforward forms and tables for CRM screens.

## Docker

`docker compose up` must be the normal way to run the complete project.

The compose stack should expose:

- the React application;
- the API;
- Swagger through the API;
- the SQLite browser.

Avoid additional infrastructure unless a feature truly requires it.

## Delivery style

Implement features as small vertical slices:

`database -> API -> Swagger -> UI -> verification`

Before adding complexity, ask: "Does this small CRM need this today?"

If the answer is no, do not add it.
