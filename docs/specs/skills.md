# Compétences

## Objectif

Permettre de créer librement des compétences puis de les attribuer aux apprenants.

Les compétences ne doivent pas être codées en dur dans la table `students`.

## Modèle `skills`

```text
id
name
description
is_active
created_at
updated_at
```

## Modèle `student_skills`

```text
id
student_id
skill_id
created_at
```

## Exemples de compétences

```text
JavaScript
React
Python
SQL
Docker
Git
Algorithmie
Communication
Autonomie
Anglais
IA
Cyber
```

## Règles métier

- `name` obligatoire ;
- `description` optionnelle ;
- `is_active = true` par défaut ;
- une compétence ne peut être attribuée qu'une fois au même apprenant.

Contrainte :

```text
UNIQUE(student_id, skill_id)
```

## API compétences

```http
GET    /api/skills
GET    /api/skills/:id
POST   /api/skills
PUT    /api/skills/:id
```

## API attribution apprenant

```http
POST   /api/students/:studentId/skills/:skillId
DELETE /api/students/:studentId/skills/:skillId
```

Il n'est pas nécessaire de créer un CRUD public complexe sur `student_skills`.

## Interface de gestion

Créer une page simple permettant :

- lister les compétences ;
- créer une compétence ;
- modifier une compétence ;
- désactiver une compétence.

## Interface fiche apprenant

Afficher les compétences sous forme simple, par exemple :

```text
[ Python ] [ Git ] [ SQL ] [+ Ajouter]
```

L'utilisateur doit pouvoir :

- ajouter une compétence existante ;
- retirer une compétence attribuée.

Une compétence inactive ne doit plus être proposée à l'ajout mais peut rester visible sur les historiques existants.

## Critères d'acceptation

- une compétence personnalisée peut être créée ;
- elle peut être attribuée à plusieurs apprenants ;
- un apprenant peut posséder plusieurs compétences ;
- impossible d'attribuer deux fois la même compétence au même apprenant ;
- une compétence peut être retirée d'un apprenant.
