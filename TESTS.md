# Tests Documentation

Ce projet inclut des tests unitaires et d'intégration pour le backend et le frontend.

## 🧪 Backend Tests

### Stack de test

- **Jest** - Framework de test
- **Supertest** - Tests d'API HTTP
- **Mocks** - Pour isoler les unités testées

### Lancer les tests

```bash
cd backend

# Tous les tests
npm test

# Mode watch (re-run automatique)
npm run test:watch

# Avec couverture
npm run test:coverage
```

### Tests disponibles

#### 1. jsonRepository.test.js

Tests du repository JSON avec gestion de la concurrence :

- ✅ Initialisation de la base de données
- ✅ Opérations CRUD (Create, Read, Update, Delete)
- ✅ Recherche par ID et par prédicat
- ✅ Auto-incrémentation des IDs
- ✅ Timestamps (createdAt, updatedAt)
- ✅ File locking pour éviter la corruption
- ✅ Gestion d'erreurs

#### 2. userService.test.js

Tests du service utilisateur :

- ✅ Inscription avec hash du mot de passe
- ✅ Vérification des emails dupliqués
- ✅ Connexion avec JWT
- ✅ Validation des credentials
- ✅ Récupération du profil
- ✅ Gestion des rôles (user/admin)
- ✅ Suppression d'utilisateurs

#### 3. bookingService.test.js

Tests du service de réservation :

- ✅ Récupération des réservations utilisateur
- ✅ Création de réservation avec validation
- ✅ Vérification des créneaux disponibles
- ✅ Détection des conflits horaires
- ✅ Annulation de réservations
- ✅ Filtrage par service

#### 4. auth.api.test.js

Tests d'intégration de l'API :

- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ GET /api/auth/profile
- ✅ Validation des entrées
- ✅ Gestion des erreurs HTTP

### Structure des tests

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── jsonRepository.test.js
│   │   ├── userService.test.js
│   │   ├── bookingService.test.js
│   │   └── auth.api.test.js
│   └── ...
└── jest.config.js
```

---

## ⚛️ Frontend Tests

### Stack de test

- **Vitest** - Framework de test rapide pour Vite
- **React Testing Library** - Tests de composants React
- **@testing-library/jest-dom** - Matchers supplémentaires
- **@testing-library/user-event** - Simulation d'interactions utilisateur
- **jsdom** - Environnement DOM pour les tests

### Lancer les tests

```bash
cd frontend

# Tous les tests
npm test

# Mode UI interactif
npm run test:ui

# Avec couverture
npm run test:coverage
```

### Tests disponibles

#### 1. Navbar.test.jsx

Tests du composant Navbar :

- ✅ Affichage du titre
- ✅ Links pour utilisateurs non-connectés
- ✅ Menu utilisateur connecté
- ✅ Lien Admin pour administrateurs
- ✅ Masquage du lien Admin pour users

#### 2. ServiceCard.test.jsx

Tests de la carte de service :

- ✅ Affichage du nom et description
- ✅ Badge de type (Salle/Équipement/Autre)
- ✅ Nombre de créneaux disponibles
- ✅ Bouton "Voir l'agenda"
- ✅ Gestion des valeurs manquantes

#### 3. Login.test.jsx

Tests de la page de connexion :

- ✅ Affichage du formulaire
- ✅ Validation des champs vides
- ✅ Mise à jour des inputs
- ✅ Lien vers l'inscription
- ✅ Gestion des erreurs

#### 4. useAuth.test.jsx

Tests du hook d'authentification :

- ✅ Fournit le contexte auth
- ✅ Initialisation sans utilisateur
- ✅ Login réussi
- ✅ Logout
- ✅ Chargement du token au démarrage

### Structure des tests

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── Navbar.test.jsx
│   │   ├── ServiceCard.test.jsx
│   │   ├── Login.test.jsx
│   │   └── useAuth.test.jsx
│   ├── test/
│   │   └── setup.js
│   └── ...
├── vitest.config.js
└── package.json
```

---

## 📊 Couverture de code

### Backend

```bash
cd backend
npm run test:coverage
```

Génère un rapport dans `backend/coverage/`

### Frontend

```bash
cd frontend
npm run test:coverage
```

Génère un rapport dans `frontend/coverage/`

### Objectifs de couverture

- **Statements** : > 80%
- **Branches** : > 75%
- **Functions** : > 80%
- **Lines** : > 80%

---

## 🔧 Configuration

### Backend - jest.config.js

- Environnement Node.js
- Support des modules ES6
- Timeout de 10 secondes
- Exclusion de `server.js` et `data/` de la couverture

### Frontend - vitest.config.js

- Environnement jsdom (DOM virtuel)
- Setup file pour les matchers
- Provider v8 pour la couverture
- Exclusion des fichiers de test de la couverture

---

## 🐛 Debugging des tests

### Backend

```bash
# Mode verbose
npm test -- --verbose

# Test spécifique
npm test -- jsonRepository.test.js

# Pattern matching
npm test -- --testNamePattern="should create"
```

### Frontend

```bash
# Mode UI (navigateur)
npm run test:ui

# Test spécifique
npm test Navbar.test.jsx

# Pattern matching
npm test -- -t "should render"
```

---

## ✅ Bonnes pratiques appliquées

1. **Tests isolés** - Chaque test est indépendant
2. **Mocks appropriés** - Services mockés pour isoler les unités
3. **Arrange-Act-Assert** - Structure claire des tests
4. **Nommage descriptif** - Tests auto-documentés
5. **Nettoyage** - beforeEach/afterEach pour reset l'état
6. **Assertions précises** - Vérification de comportements spécifiques
7. **Edge cases** - Tests des cas limites et erreurs

---

## 📝 Ajouter de nouveaux tests

### Backend

1. Créer un fichier `*.test.js` dans `src/__tests__/`
2. Importer le module à tester
3. Mocker les dépendances si nécessaire
4. Écrire les tests avec `describe` et `test`

### Frontend

1. Créer un fichier `*.test.jsx` dans `src/__tests__/`
2. Importer le composant/hook à tester
3. Utiliser `render` ou `renderHook`
4. Utiliser les queries de Testing Library
5. Simuler les interactions utilisateur

---

## 🚀 CI/CD

Ces tests peuvent être intégrés dans un pipeline CI/CD :

```yaml
# Exemple GitHub Actions
- name: Backend Tests
  run: |
    cd backend
    npm install
    npm test

- name: Frontend Tests
  run: |
    cd frontend
    npm install
    npm test
```

---

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/ladjs/supertest)

---

**Note** : Les tests sont une partie essentielle du projet. Pensez à ajouter des tests pour chaque nouvelle fonctionnalité !
