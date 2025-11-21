# Backend - API de Gestion de Services

Backend Node.js/Express pour une application de gestion de réservations de services (salles, équipements).

## 🏗️ Architecture

### Structure du projet
```
backend/
├── src/
│   ├── config/          # Configuration (JWT, port, etc.)
│   ├── controllers/     # Contrôleurs REST
│   ├── data/           # Base de données JSON
│   ├── middleware/     # Auth, validation, gestion d'erreurs
│   ├── repositories/   # Accès aux données avec verrous
│   ├── routes/         # Définition des routes API
│   ├── services/       # Logique métier
│   └── server.js       # Point d'entrée
├── .env.example        # Variables d'environnement
└── package.json
```

### Architecture 3-couches
- **Controllers** : Gestion des requêtes HTTP
- **Services** : Logique métier et validation
- **Repositories** : Accès aux données avec gestion de la concurrence

### Documentation du code
Tout le code backend est documenté avec des commentaires JSDoc pour faciliter la maintenance et la compréhension.

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation des dépendances
```bash
cd backend
npm install
```

### Configuration
Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

Variables d'environnement :
```
PORT=5000
JWT_SECRET=votre-secret-jwt-securise
JWT_EXPIRATION=24h
NODE_ENV=development
DATA_PATH=./src/data/db.json
```

## 🎯 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (authentifié)

### Services
- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détails d'un service
- `GET /api/services/:id/slots/available` - Créneaux disponibles
- `POST /api/services` - Créer un service (admin)
- `PATCH /api/services/:id` - Modifier un service (admin)
- `DELETE /api/services/:id` - Supprimer un service (admin)
- `POST /api/services/:id/slots` - Ajouter un créneau (admin)
- `DELETE /api/services/:id/slots` - Supprimer un créneau (admin)

### Réservations
- `GET /api/bookings/my-bookings` - Mes réservations
- `GET /api/bookings/:id` - Détails d'une réservation
- `GET /api/bookings?serviceId=X` - Réservations pour un service (pour l'agenda)
- `POST /api/bookings` - Créer une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation
- `GET /api/bookings` - Toutes les réservations (admin)
- `PATCH /api/bookings/:id/status` - Modifier le statut (admin)

### Utilisateurs (admin)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PATCH /api/users/:id/role` - Modifier le rôle
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 🔒 Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans l'en-tête :
```
Authorization: Bearer <votre-token>
```

## 💾 Stockage des données

Les données sont stockées dans un fichier JSON (`src/data/db.json`) avec un système de verrous pour gérer la concurrence et éviter les corruptions.

### Créer des utilisateurs de test

Pour créer un administrateur, utilisez l'API d'inscription puis modifiez manuellement le fichier `db.json` :
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "password": "$2a$10$...",
      "firstName": "Admin",
      "lastName": "System",
      "role": "admin"
    }
  ]
}
```

Ou utilisez un outil comme bcryptjs pour générer un hash de mot de passe :
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
console.log(hash);
```

## 🛠️ Scripts disponibles

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en mode développement (nodemon)
- `npm run lint` - Vérifier le code avec ESLint
- `npm run lint:fix` - Corriger automatiquement les erreurs ESLint
- `npm run format` - Formater le code avec Prettier
- `npm run format:check` - Vérifier le formatage

## 🔧 Qualité du code

### ESLint
Configuration stricte pour maintenir la qualité du code.

### Prettier
Formatage automatique pour un code cohérent.

## 📝 Améliorations possibles

- [x] ✅ Tests unitaires et d'intégration
- [ ] Migration vers une vraie base de données (PostgreSQL, MongoDB)
- [ ] Cache Redis pour les performances
- [ ] Rate limiting pour la sécurité
- [ ] Logs structurés (Winston, Pino)
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Webhooks pour les notifications
- [ ] Export des données (CSV, Excel)

## 🐛 Débogage

Activer les logs détaillés :
```bash
NODE_ENV=development npm run dev
```

## 📄 Licence

MIT
