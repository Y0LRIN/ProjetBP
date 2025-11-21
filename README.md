# Projet BP - Gestion de Services

Application complète de gestion de réservations de services (salles, équipements) avec authentification et interface d'administration.

## 📋 Description

Ce projet est une refonte complète d'une application PHP volontairement mal conçue (voir `cas_etude/`). Il s'agit d'une application full-stack moderne utilisant :

- **Backend** : Node.js + Express avec sérialisation JSON (pas de MongoDB)
- **Frontend** : React + Vite avec React Router
- **Architecture** : 3-couches (Controller → Service → Repository)
- **Authentification** : JWT
- **Stockage** : Fichier JSON avec gestion de la concurrence
- **Tests** : Jest (backend) + Vitest (frontend) avec couverture complète

## 🏗️ Structure du projet

```
ProjetBP/
├── backend/               # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Contrôleurs REST
│   │   ├── data/        # Base de données JSON
│   │   ├── middleware/  # Auth, validation, erreurs
│   │   ├── repositories/# Accès aux données
│   │   ├── routes/      # Routes API
│   │   ├── services/    # Logique métier
│   │   └── server.js    # Point d'entrée
│   └── package.json
│
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── context/     # Contextes (Auth)
│   │   ├── pages/       # Pages
│   │   ├── services/    # Services API
│   │   └── App.jsx      # App principale
│   └── package.json
│
└── cas_etude/           # Code de référence (mauvais code)
```

## 🚀 Installation rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation complète

```bash
# Cloner le projet
git clone https://github.com/Y0LRIN/ProjetBP.git
cd ProjetBP

# Installer les dépendances backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos valeurs

# Installer les dépendances frontend
cd ../frontend
npm install
cp .env.example .env
# Éditer .env si nécessaire

# Retour à la racine
cd ..
```

### Lancement

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

→ API disponible sur http://localhost:5000

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

→ Application disponible sur http://localhost:5173

## 🎯 Fonctionnalités

### Pour tous les utilisateurs

- ✅ Inscription et connexion sécurisées
- ✅ Consultation des services disponibles
- ✅ Filtrage par type (salle, équipement, autre)
- ✅ **Vue agenda visuelle** avec créneaux color-codés (vert/bleu/gris)
- ✅ Réservation en un clic depuis l'agenda
- ✅ Gestion des réservations personnelles
- ✅ Annulation de réservations

### Pour les administrateurs

- ✅ Toutes les fonctionnalités utilisateur
- ✅ Création, modification et suppression de services
- ✅ Gestion des créneaux (ajout/suppression)
- ✅ Vue sur toutes les réservations
- ✅ Gestion des utilisateurs

## 📡 API

### Endpoints principaux

**Authentification**

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil

**Services**

- `GET /api/services` - Liste des services
- `POST /api/services` - Créer (admin)
- `GET /api/services/:id/slots/available` - Créneaux disponibles

**Réservations**

- `GET /api/bookings/my-bookings` - Mes réservations
- `GET /api/bookings?serviceId=X` - Réservations d'un service
- `POST /api/bookings` - Réserver
- `DELETE /api/bookings/:id` - Annuler

Voir les README individuels pour la documentation complète.

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Hachage bcrypt des mots de passe
- ✅ Validation des entrées (express-validator)
- ✅ Protection CORS
- ✅ Gestion des rôles (user/admin)
- ✅ Verrous sur les fichiers pour éviter les corruptions

## 🎨 Architecture propre

### Principes appliqués

- **Séparation des responsabilités** : Controllers, Services, Repositories
- **DRY** : Pas de duplication de code
- **Nommage clair** : Variables et fonctions explicites
- **Validation** : Toutes les entrées sont validées
- **Gestion d'erreurs** : Middleware centralisé
- **Code style** : ESLint + Prettier

### Différences avec cas_etude

Le dossier `cas_etude/` contient intentionnellement du mauvais code PHP :

- ❌ Mélange HTML/PHP/JS
- ❌ Variables cryptiques ($a, $zz, x1)
- ❌ Accès direct aux données sans verrou
- ❌ Aucune validation
- ❌ Pas de séparation des responsabilités
- ❌ Code dupliqué partout
- ❌ Pas de tests
- ❌ Aucune documentation

Notre refonte corrige tous ces problèmes ! ✅

- ✅ Code documenté (JSDoc)
- ✅ Architecture 3-couches claire
- ✅ Gestion de la concurrence avec file locking
- ✅ Validation complète des données

## 🛠️ Scripts npm

### Backend

```bash
npm start          # Production
npm run dev        # Développement (nodemon)
npm test           # Lancer les tests
npm run test:coverage  # Tests avec couverture
npm run lint       # Vérifier le code
npm run lint:fix   # Corriger le code
npm run format     # Formater avec Prettier
```

### Frontend

```bash
npm run dev        # Développement
npm run build      # Build production
npm test           # Lancer les tests
npm run test:coverage  # Tests avec couverture
npm run preview    # Prévisualiser le build
npm run lint       # Vérifier le code
npm run lint:fix   # Corriger le code
npm run format     # Formater avec Prettier
```

## 💾 Données de test

Le fichier `backend/src/data/db.json` contient des données initiales :

- 3 services (salles et équipements)
- 2 utilisateurs (admin et user)
- Créneaux de test

### Créer un compte admin

1. S'inscrire normalement via l'interface
2. Éditer `backend/src/data/db.json`
3. Changer `"role": "user"` en `"role": "admin"`
4. Redémarrer le backend

Ou utiliser l'API avec bcryptjs pour hacher un mot de passe.

## 📝 Améliorations futures

### Backend

- [x] ✅ **Tests unitaires et d'intégration** - Implémenté !
- [ ] Documentation Swagger
- [ ] Migration vers PostgreSQL/MongoDB
- [ ] Rate limiting
- [ ] Logs structurés
- [ ] Cache Redis

### Frontend

- [x] ✅ **Tests (Vitest + React Testing Library)** - Implémenté !
- [ ] Mode sombre
- [ ] PWA
- [ ] Internationalisation
- [x] ✅ **Calendrier visuel (agenda)** - Implémenté !
- [ ] Notifications temps réel
- [ ] Export des réservations (PDF/CSV)

## 🐛 Débogage

### Backend ne démarre pas

- Vérifier Node.js 18+
- Vérifier le fichier `.env`
- Vérifier les ports (5000 disponible)

### Frontend ne se connecte pas

- Vérifier que le backend tourne
- Vérifier `VITE_API_URL` dans `.env`
- Ouvrir la console navigateur (F12)

### Erreur JWT

- Supprimer le localStorage et se reconnecter
- Vérifier que `JWT_SECRET` est défini dans `.env`

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Ajout de ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## 👨‍💻 Auteur

Projet réalisé dans le cadre de la formation YNOV.

---

**Note** : Ce projet est une refonte d'un cas d'étude pédagogique.
