# 🚀 Guide de démarrage rapide

## Installation et lancement en 3 minutes

### 1️⃣ Installation des dépendances

```bash
# Backend
cd backend
npm install

# Frontend (dans un nouveau terminal)
cd frontend
npm install
```

### 2️⃣ Configuration

Les fichiers `.env` sont déjà créés avec les valeurs par défaut. Aucune modification nécessaire pour un démarrage rapide !

### 3️⃣ Lancement

**Terminal 1 - Backend (API)**

```bash
cd backend
npm run dev
```

✅ API démarrée sur http://localhost:5000

**Terminal 2 - Frontend (Interface)**

```bash
cd frontend
npm run dev
```

✅ Application démarrée sur http://localhost:5173

### 4️⃣ Test

Ouvrez votre navigateur sur http://localhost:5173

**Connexion avec un compte de test :**

- Admin : admin@example.com / admin123
- User : user@example.com / user123

---

## 🎯 Que faire ensuite ?

### En tant qu'utilisateur

1. Voir la liste des services disponibles
2. Cliquer sur "Voir l'agenda" pour un service
3. **Vue agenda visuelle** : créneaux verts (disponibles), bleus (vos réservations), gris (réservés)
4. Réserver en un clic depuis l'agenda
5. Consulter vos réservations
6. Annuler une réservation

### En tant qu'admin

1. Accéder au panneau Admin
2. Créer de nouveaux services
3. Ajouter des créneaux aux services
4. Voir toutes les réservations
5. Gérer les utilisateurs (changer les rôles)
6. Supprimer des services ou des créneaux

---

## 🐛 Problèmes courants

### Le backend ne démarre pas

- Vérifiez que le port 5000 est libre
- Vérifiez Node.js >= 18

### Le frontend ne se connecte pas

- Vérifiez que le backend tourne
- Vérifiez la console navigateur (F12)
- Vérifiez le fichier `.env` du frontend

### Erreurs de connexion

- Utilisez les comptes de test fournis
- Ou créez un nouveau compte via "Inscription"

---

## 📚 Documentation complète

- [README principal](./README.md)
- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
- [Comptes de test](./COMPTES_TEST.md)

---

**Bon développement ! 🎉**
