# Modèle de données

## Vue d'ensemble

Le CRM utilise 7 tables principales :

```text
users
campuses
promotions
students
skills
student_skills
comments
```

## Relations

```mermaid
erDiagram

    USERS ||--o{ PROMOTIONS : "responsable de"
    USERS ||--o{ COMMENTS : "écrit"

    CAMPUSES ||--o{ PROMOTIONS : "contient"
    CAMPUSES ||--o{ STUDENTS : "contient"

    PROMOTIONS ||--o{ STUDENTS : "contient"

    STUDENTS ||--o{ COMMENTS : "possède"
    STUDENTS ||--o{ STUDENT_SKILLS : "possède"

    SKILLS ||--o{ STUDENT_SKILLS : "est attribuée à"

    USERS {
        string id PK
        string firstname
        string lastname
        string email UK
        string password_hash
        string role
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    CAMPUSES {
        string id PK
        string name
        string city
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    PROMOTIONS {
        string id PK
        string name
        string campus_id FK
        string manager_user_id FK
        datetime start_date
        datetime end_date
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    STUDENTS {
        string id PK
        string firstname
        string lastname
        string phone
        string email UK
        string discord_login
        string city
        string campus_id FK
        string promotion_id FK
        boolean is_alerte
        boolean is_abandon
        boolean is_hyppo_refused
        boolean is_hyppo_accepted
        boolean is_financement_ok
        boolean is_admin_status_ok
        boolean is_material_setup_ok
        boolean is_employability_initialised
        datetime created_at
        datetime updated_at
    }

    SKILLS {
        string id PK
        string name
        string description
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    STUDENT_SKILLS {
        string id PK
        string student_id FK
        string skill_id FK
        datetime created_at
    }

    COMMENTS {
        string id PK
        string student_id FK
        string author_user_id FK
        string content
        string status
        datetime created_at
        datetime updated_at
    }
```

## Identifiants

Le projet utilise Prisma avec SQLite.

Les identifiants peuvent être générés par Prisma avec `uuid()`.

Exemple :

```prisma
id String @id @default(uuid())
```

## Contraintes importantes

### Email utilisateur

```text
users.email UNIQUE
```

### Email apprenant

```text
students.email UNIQUE
```

Un email vide doit être géré comme `null` et non comme une chaîne vide afin de permettre plusieurs apprenants sans email.

### Compétence d'un apprenant

Une même compétence ne peut être attribuée qu'une fois au même apprenant.

```text
UNIQUE(student_id, skill_id)
```

### Hippocamp

Les deux indicateurs suivants ne doivent jamais être vrais simultanément :

```text
is_hyppo_refused
is_hyppo_accepted
```

Cette règle doit être contrôlée par l'application.

SQLite et Prisma ne nécessitent pas ici de complexifier le schéma avec une logique spécifique si la validation applicative est suffisante.

## Suppression

Par défaut :

- utilisateurs : désactivation via `is_active` ;
- campus : désactivation via `is_active` ;
- promotions : désactivation via `is_active` ;
- compétences : désactivation via `is_active`.

Pour les apprenants et commentaires, une suppression réelle peut être proposée si elle ne casse pas l'intégrité des données.

Ne pas ajouter de système générique de soft delete tant qu'il n'est pas nécessaire.
