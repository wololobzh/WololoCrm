# Commentaires

## Objectif

Permettre aux utilisateurs de laisser des notes simples sur un apprenant.

## Modèle

```text
id
student_id
author_user_id
content
status
created_at
updated_at
```

## Relations

```text
comment.student_id
       ↓
students.id
```

```text
comment.author_user_id
       ↓
users.id
```

L'auteur doit provenir de l'utilisateur authentifié.

Le frontend ne doit pas pouvoir choisir arbitrairement `author_user_id`.

## Statuts

Valeurs initiales :

```text
INFO
TODO
IMPORTANT
DONE
```

Ne pas créer de workflow complexe autour de ces statuts.

## Exemple

```text
[IMPORTANT]
L'apprenant semble décrocher depuis deux semaines.

[TODO]
Prévoir un entretien avec le responsable de promotion.

[DONE]
Point effectué le 28/08.
```

## API

```http
GET    /api/students/:studentId/comments
POST   /api/students/:studentId/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
```

Création :

```json
{
  "content": "Prévoir un entretien cette semaine.",
  "status": "TODO"
}
```

`author_user_id` est déterminé par le JWT.

## Affichage

Les commentaires doivent être affichés du plus récent au plus ancien.

Chaque commentaire montre au minimum :

```text
statut
contenu
auteur
date
```

## Critères d'acceptation

- un utilisateur authentifié peut ajouter un commentaire ;
- le commentaire est automatiquement associé à son auteur ;
- le commentaire est associé à l'apprenant ;
- les commentaires sont visibles sur la fiche apprenant ;
- le plus récent apparaît en premier ;
- le statut peut être modifié ;
- le contenu peut être modifié.
