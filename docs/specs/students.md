# Apprenants

## Objectif

La gestion des apprenants est la fonctionnalité principale du CRM.

## Modèle

Un apprenant possède :

```text
id
firstname
lastname
phone
email
discord_login
city

campus_id
promotion_id

is_alerte
is_abandon
is_hyppo_refused
is_hyppo_accepted
is_financement_ok
is_admin_status_ok
is_material_setup_ok
is_employability_initialised

created_at
updated_at
```

## Champs obligatoires

```text
firstname
lastname
campus_id
promotion_id
```

L'email peut être optionnel mais, lorsqu'il existe, il doit être unique.

## Informations générales

L'interface doit permettre de gérer :

- prénom ;
- nom ;
- téléphone ;
- email ;
- login Discord ;
- ville ;
- campus ;
- promotion.

## Statuts

### Général

```text
is_alerte
is_abandon
```

Affichage :

```text
☐ Alerte
☐ Abandon
```

### Hippocamp

```text
is_hyppo_refused
is_hyppo_accepted
```

Affichage :

```text
Hippocamp
☐ Accepté
☐ Refusé
```

Les deux valeurs ne doivent jamais être vraies simultanément.

Si l'utilisateur coche "Accepté", l'application peut automatiquement décocher "Refusé", et inversement.

### Onboarding

```text
is_financement_ok
is_admin_status_ok
is_material_setup_ok
is_employability_initialised
```

Affichage :

```text
☐ Financement OK
☐ Administratif OK
☐ Matériel configuré
☐ Employabilité initialisée
```

Toutes ces valeurs valent `false` par défaut.

## Liste des apprenants

Créer une page présentant un tableau.

Colonnes minimales :

```text
Nom
Prénom
Email
Campus
Promotion
Alerte
Abandon
Actions
```

Fonctions minimales :

- voir la liste ;
- ouvrir une fiche apprenant ;
- créer un apprenant ;
- modifier un apprenant.

Un filtre campus et un filtre promotion peuvent être ajoutés simplement.

Une recherche nom/prénom/email peut être ajoutée si elle reste simple.

## Fiche apprenant

La fiche apprenant doit regrouper :

### Identité

```text
Prénom
Nom
Téléphone
Email
Discord
Ville
Campus
Promotion
```

### Statuts

Toutes les checkbox définies ci-dessus.

### Compétences

Affichage des compétences attribuées avec possibilité :

- d'ajouter une compétence ;
- de retirer une compétence.

### Commentaires

Afficher les commentaires du plus récent au plus ancien.

Permettre d'ajouter un commentaire.

## API

```http
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

`GET /api/students/:id` doit retourner suffisamment d'informations pour construire la fiche apprenant, notamment :

```text
campus
promotion
promotion.manager
skills
comments
comments.author
```

Éviter autant que possible de faire cinq appels API depuis la fiche apprenant.

## Exemple d'interface

```text
┌──────────────────────────────────────────────┐
│ Jean DUPONT                                  │
│ C30 Betty — VCFR                             │
│                                              │
│ jean@email.com                               │
│ 06 XX XX XX XX                               │
│ Discord : jean_dev                           │
│ Rennes                                       │
├──────────────────────────────────────────────┤
│ STATUT                                       │
│                                              │
│ ☐ Alerte             ☐ Abandon              │
│                                              │
│ HIPPOCAMP                                    │
│ ☐ Accepté            ☐ Refusé               │
│                                              │
│ ONBOARDING                                   │
│ ☑ Financement OK                             │
│ ☑ Administratif OK                          │
│ ☐ Matériel configuré                        │
│ ☑ Employabilité initialisée                 │
├──────────────────────────────────────────────┤
│ COMPÉTENCES                                  │
│                                              │
│ [ Python ] [ Git ] [ SQL ] [+ Ajouter]       │
├──────────────────────────────────────────────┤
│ COMMENTAIRES                                 │
│                                              │
│ IMPORTANT                                    │
│ Difficultés sur Python.                      │
│ Anthony — 28/08/2026                         │
│                                              │
│ [+ Ajouter un commentaire]                   │
└──────────────────────────────────────────────┘
```

## Critères d'acceptation

- un apprenant peut être créé ;
- il peut être modifié ;
- il est lié à un campus ;
- il est lié à une promotion ;
- ses statuts peuvent être modifiés depuis sa fiche ;
- les deux statuts Hippocamp ne peuvent pas être actifs simultanément ;
- ses compétences sont visibles et modifiables ;
- ses commentaires sont visibles ;
- sa fiche permet de créer un commentaire.
