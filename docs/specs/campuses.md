# Campus

## Objectif

Permettre de créer et gérer les campus auxquels sont rattachés les promotions et les apprenants.

## Modèle

```text
id
name
city
is_active
created_at
updated_at
```

## Exemples

```text
VCFR
Paris
Toulouse
Rennes
Thonon
```

## Règles métier

- `name` obligatoire ;
- `city` optionnelle ;
- `is_active = true` par défaut.

Un campus inactif reste visible dans les données historiques mais ne doit plus être proposé par défaut lors de la création d'un nouvel apprenant ou d'une nouvelle promotion.

## API

```http
GET    /api/campuses
GET    /api/campuses/:id
POST   /api/campuses
PUT    /api/campuses/:id
```

Un endpoint DELETE n'est pas nécessaire au départ.

La désactivation passe par `is_active`.

## Interface

Créer une page simple permettant :

- voir la liste des campus ;
- créer un campus ;
- modifier un campus ;
- activer ou désactiver un campus.

Colonnes minimales :

```text
Nom
Ville
Actif
Actions
```

## Critères d'acceptation

- un campus peut être créé ;
- un campus peut être modifié ;
- un campus peut être désactivé ;
- un campus actif peut être associé à une promotion ;
- un campus actif peut être associé à un apprenant.
