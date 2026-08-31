# Conventions API

## Base URL

Toutes les routes métier sont placées sous :

```text
/api
```

Swagger UI est disponible sous :

```text
/api-docs
```

## Format

L'API utilise JSON.

Exemple :

```http
Content-Type: application/json
```

## Authentification

Les routes privées utilisent :

```http
Authorization: Bearer <token>
```

## Codes HTTP

Utiliser simplement :

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

## Erreurs

Format recommandé :

```json
{
  "error": "Student not found"
}
```

ou :

```json
{
  "error": "Validation error",
  "details": [
    "firstname is required"
  ]
}
```

Ne pas retourner de stack trace au frontend.

## Pagination

La pagination n'est pas obligatoire pour la première version.

Elle pourra être ajoutée lorsque le nombre de données le justifiera.

## Relations

Pour les écrans qui en ont besoin, préférer une réponse Prisma avec `include` plutôt que multiplier les requêtes frontend.

Exemple : la fiche apprenant peut inclure :

```text
campus
promotion
promotion.manager
skills
comments
comments.author
```

## Swagger

Chaque route publique doit être documentée.

Swagger doit préciser :

- méthode ;
- URL ;
- paramètres ;
- body ;
- principales réponses ;
- besoin ou non d'authentification.

## Validation

Valider au minimum :

- champs obligatoires ;
- formats évidents ;
- relations existantes ;
- contraintes métier.

Exemples :

```text
email unique
campus existant
promotion existante
responsable utilisateur existant
Hippocamp accepté/refusé non simultanés
skill non dupliquée
```

## Principe

Ne pas introduire une librairie de validation complexe si les validations restent peu nombreuses.

Si le projet commence à avoir beaucoup de schémas, une librairie légère pourra être ajoutée plus tard.
