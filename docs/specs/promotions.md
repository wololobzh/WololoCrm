# Promotions

## Objectif

Permettre de gérer les promotions d'apprenants.

Chaque promotion :

- appartient à un campus ;
- possède un responsable ;
- peut contenir plusieurs apprenants.

Le responsable est un utilisateur de l'application.

## Modèle

```text
id
name
campus_id
manager_user_id
start_date
end_date
is_active
created_at
updated_at
```

## Exemples

```text
C30 Betty
C31
C32
Bachelor Agentic 2026
```

## Relations

```text
promotion.campus_id
        ↓
campuses.id
```

```text
promotion.manager_user_id
        ↓
users.id
```

## Règles métier

- `name` obligatoire ;
- `campus_id` obligatoire ;
- `manager_user_id` obligatoire ;
- le responsable doit être un utilisateur actif ;
- `start_date` et `end_date` sont optionnelles ;
- si les deux dates existent, `end_date` doit être postérieure ou égale à `start_date` ;
- `is_active = true` par défaut.

## API

```http
GET    /api/promotions
GET    /api/promotions/:id
POST   /api/promotions
PUT    /api/promotions/:id
```

Le listing doit idéalement retourner également :

```text
campus
manager
```

pour éviter au frontend de multiplier les appels.

## Interface

Une page promotions doit afficher au minimum :

```text
Nom
Campus
Responsable
Date de début
Date de fin
Actif
Actions
```

Le formulaire utilise :

- une liste déroulante de campus actifs ;
- une liste déroulante d'utilisateurs actifs pour le responsable.

## Critères d'acceptation

- une promotion peut être créée ;
- elle est obligatoirement rattachée à un campus ;
- elle possède un responsable utilisateur ;
- elle peut être désactivée ;
- elle peut être sélectionnée sur une fiche apprenant.
