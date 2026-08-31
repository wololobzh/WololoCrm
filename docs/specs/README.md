# CRM - Specifications fonctionnelles

## Objectif

Cette application est un petit CRM permettant de gérer les apprenants d'une école.

L'objectif est de rester simple :

- une application React ;
- une API REST Express ;
- Prisma ;
- SQLite ;
- une authentification simple ;
- Swagger pour documenter et tester l'API ;
- un client web SQLite pour visualiser la base ;
- lancement complet avec `docker compose up`.

Les spécifications de ce dossier constituent la référence fonctionnelle du projet.

## Modules

- [Authentification](./authentication.md)
- [Utilisateurs](./users.md)
- [Campus](./campuses.md)
- [Promotions](./promotions.md)
- [Apprenants](./students.md)
- [Compétences](./skills.md)
- [Commentaires](./comments.md)
- [Modèle de données](./data-model.md)
- [Conventions API](./api-conventions.md)

## Ordre recommandé de développement

1. Initialisation du projet et Docker Compose.
2. Base Prisma + SQLite.
3. Utilisateurs et authentification.
4. Campus.
5. Promotions.
6. Apprenants.
7. Compétences.
8. Commentaires.
9. Fiche apprenant complète.

Chaque fonctionnalité doit être développée comme une vertical slice :

```text
Prisma
  ↓
API REST
  ↓
Swagger
  ↓
Interface React
  ↓
Vérification
```

## Règles générales

- Ne pas ajouter de complexité sans besoin fonctionnel.
- Ne pas créer de microservices.
- Ne pas ajouter de Redux par défaut.
- Ne pas remplacer REST par GraphQL.
- Ne pas remplacer SQLite sans demande explicite.
- Ne pas migrer le projet vers TypeScript.
- Les suppressions fonctionnelles peuvent être remplacées par `is_active = false` lorsque cela évite de casser des relations.
- Les dates de création et modification doivent être gérées automatiquement lorsque possible.

## Source de vérité

En cas de contradiction :

1. la demande explicite actuelle de l'utilisateur ;
2. les fichiers de `docs/specs/` ;
3. le code existant ;
4. les choix par défaut de l'agent.
