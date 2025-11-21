# Frontend - Application de Gestion de Services

Application React pour la gestion de réservations de services (salles, équipements).

## 🏗️ Architecture

### Structure du projet
```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── context/        # Contextes React (Auth)
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── public/             # Fichiers statiques
├── .env.example        # Variables d'environnement
└── package.json
```

### Pages
- **Home** : Page d'accueil
- **Login/Register** : Authentification
- **Services** : Liste des services avec filtres
- **ServiceAgenda** : Vue agenda avec créneaux color-codés (nouveau !)
- **Bookings** : Gestion des réservations
- **Admin** : Administration (admin uniquement)

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation des dépendances
```bash
cd frontend
npm install
```

### Configuration
Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

Variables d'environnement :
```
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Démarrage

### Mode développement
```bash
npm run dev
```

L'application démarre sur `http://localhost:5173`

### Build de production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

## 🎨 Fonctionnalités

### Utilisateur
- ✅ Inscription et connexion
- ✅ Consultation des services disponibles
- ✅ Filtrage par type (salle, équipement, autre)
- ✅ **Vue agenda visuelle** : 
  - Créneaux verts = disponibles
  - Créneaux bleus = vos réservations
  - Créneaux gris = réservés par d'autres
- ✅ Réservation en un clic depuis l'agenda
- ✅ Gestion des réservations personnelles
- ✅ Annulation de réservations

### Administrateur
- ✅ Toutes les fonctionnalités utilisateur
- ✅ Création de services
- ✅ Gestion des créneaux (ajout, suppression)
- ✅ Vue sur toutes les réservations
- ✅ Suppression de services

## 🔐 Authentification

L'application utilise JWT stocké dans le localStorage. Le token est automatiquement ajouté aux requêtes API.

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrer en mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Vérifier le code avec ESLint
- `npm run lint:fix` - Corriger automatiquement les erreurs
- `npm run format` - Formater le code avec Prettier
- `npm run format:check` - Vérifier le formatage

## 📦 Technologies utilisées

- **React 19** - Framework UI
- **React Router 7** - Routing
- **Axios** - Requêtes HTTP
- **Vite** - Build tool et dev server
- **ESLint** - Linting
- **Prettier** - Formatage
- **Context API** - Gestion d'état (AuthContext)
- **Custom Hooks** - Réutilisation de la logique

## 🎨 Styles

- CSS modules par composant/page
- Design responsive (mobile-first)
- Palette de couleurs cohérente

## 📱 Responsive

L'application est entièrement responsive et fonctionne sur :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)

## 🔧 Qualité du code

### ESLint
Configuration avec règles React et hooks.

### Prettier
Formatage automatique pour un code cohérent.

## 📝 Améliorations possibles

- [ ] Tests (Vitest, React Testing Library)
- [ ] PWA (Progressive Web App)
- [ ] Internationalisation (i18n)
- [ ] Mode sombre
- [ ] Notifications en temps réel (WebSocket)
- [x] ✅ **Calendrier visuel pour les réservations** - Implémenté !
- [ ] Export des réservations (PDF, iCal)
- [ ] Recherche et filtres avancés
- [ ] Upload d'images pour les services
- [ ] Système de notation/commentaires
- [ ] Animations et transitions

## 🐛 Débogage

### React DevTools
Installez l'extension React DevTools pour Chrome/Firefox.

### Logs API
Les erreurs API sont affichées dans la console et via des messages utilisateur.

## 🌐 Comptes de test

Pour tester l'application, créez des comptes via l'interface d'inscription, ou utilisez les comptes dans la base de données backend.

## 📄 Licence

MIT
