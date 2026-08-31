# Utilisateurs

## Objectif

Les utilisateurs sont les personnes autorisées à accéder à l'application.

Un utilisateur peut également être responsable d'une ou plusieurs promotions et auteur de commentaires.

## Modèle

```text
id
firstname
lastname
email
password_hash
role
is_active
created_at
updated_at
```

## Rôles

Valeurs initiales :

```text
ADMIN
MANAGER
USER
```

Ne pas créer un système de permissions plus complexe pour le moment.

De nouveaux rôles pourront être ajoutés ultérieurement si nécessaire.

## Règles métier

- `email` obligatoire ;
- `email` unique ;
- `password_hash` obligatoire ;
- `role` obligatoire ;
- `is_active` vaut `true` par défaut.

## API minimale

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
```

La suppression d'un utilisateur n'est pas nécessaire au départ.

La désactivation se fait via :

```text
is_active = false
```

## Création d'un utilisateur

Le payload de création reçoit un mot de passe en clair :

```json
{
  "firstname": "Kevin",
  "lastname": "Dupont",
  "email": "kevin@example.com",
  "password": "mot-de-passe",
  "role": "MANAGER"
}
```

L'API doit immédiatement hasher le mot de passe.

Le champ `password` n'existe pas en base.

## Interface

Une page simple de gestion des utilisateurs doit permettre :

- voir les utilisateurs ;
- ajouter un utilisateur ;
- modifier prénom, nom, email, rôle ;
- activer ou désactiver un utilisateur.

Pas de gestion complexe des permissions dans cette première version.

## Critères d'acceptation

- impossible de créer deux utilisateurs avec le même email ;
- le mot de passe est hashé avant insertion en base ;
- le hash n'est jamais affiché dans l'interface ni retourné par l'API ;
- un utilisateur peut être sélectionné comme responsable de promotion.
