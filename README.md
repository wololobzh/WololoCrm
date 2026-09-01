# WololoCrm

Petit CRM pour gérer les apprenants d'une école (React + Express + Prisma + SQLite).

Voir les spécifications fonctionnelles dans [docs/specs](docs/specs/README.md).

## Démarrage

```bash
docker compose up
```

Au premier démarrage, le serveur applique automatiquement les migrations Prisma
et crée un utilisateur admin de test :

```text
email    : admin@wololocrm.local
password : admin1234
```

## URLs

| Service                  | URL                              |
| ------------------------ | --------------------------------- |
| Frontend (React)          | http://localhost:5173             |
| API                        | http://localhost:4000/api         |
| Swagger UI                 | http://localhost:4000/api-docs    |
| Navigateur SQLite (sqlite-web) | http://localhost:8080         |

## Statut actuel

Socle technique et authentification uniquement (login + `/api/auth/me`).
La gestion des campus, promotions, apprenants, compétences et commentaires
n'est pas encore implémentée.

## Développement sans Docker

```bash
# server
cd server
cp .env.example .env
npm install
npx prisma migrate deploy
node prisma/seed.js
npm run dev

# client (autre terminal)
cd client
npm install
npm run dev
```
