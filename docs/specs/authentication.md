# Authentification

## Objectif

Permettre aux utilisateurs autorisés de se connecter simplement au CRM.

L'authentification doit rester volontairement légère.

## Principe

L'utilisateur se connecte avec :

- email ;
- mot de passe.

Le mot de passe est stocké uniquement sous forme de hash.

Une fois connecté, l'API retourne un JWT.

Le frontend conserve le token et l'envoie dans les appels API protégés.

## Données

L'authentification repose sur la table `users`.

Champs nécessaires :

```text
email
password_hash
is_active
role
```

## Connexion

Endpoint :

```http
POST /api/auth/login
```

Payload :

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Réponse attendue :

```json
{
  "token": "...",
  "user": {
    "id": "...",
    "firstname": "Kevin",
    "lastname": "Dupont",
    "email": "user@example.com",
    "role": "MANAGER"
  }
}
```

Le champ `password_hash` ne doit jamais être retourné.

## Profil connecté

Endpoint :

```http
GET /api/auth/me
```

Cet endpoint nécessite une authentification.

Il retourne l'utilisateur correspondant au JWT.

## Déconnexion

La déconnexion est gérée côté frontend en supprimant le JWT local.

Aucun système complexe de session serveur n'est nécessaire.

## Sécurité minimale

- mot de passe hashé avec `bcryptjs` ou équivalent ;
- secret JWT dans une variable d'environnement ;
- mot de passe jamais loggé ;
- `password_hash` jamais retourné ;
- utilisateur inactif interdit de connexion ;
- routes privées protégées par un middleware simple.

## Hors périmètre initial

Ne pas implémenter sans demande :

- OAuth ;
- Google Login ;
- SSO ;
- MFA ;
- refresh tokens ;
- récupération de mot de passe ;
- gestion complexe de permissions ;
- sessions Redis.

## Critères d'acceptation

- un utilisateur actif peut se connecter avec des identifiants valides ;
- un mauvais mot de passe retourne une erreur 401 ;
- un utilisateur inactif ne peut pas se connecter ;
- `/api/auth/me` fonctionne avec un JWT valide ;
- une route protégée refuse une requête sans JWT ;
- aucun mot de passe ni hash n'apparaît dans les réponses API.
