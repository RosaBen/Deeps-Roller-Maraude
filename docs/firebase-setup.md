# Guide de Configuration Firebase

## 🔥 Setup Firebase pour Deeps Roller Maraude

### 1. Création du Projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Nommez votre projet : `deeps-roller-maraude`
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Configuration de Realtime Database

1. Dans la console Firebase, allez dans "Realtime Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez une région proche (Europe pour la France)
4. Commencez en mode "verrouillé" puis configurez les règles de sécurité

### 2bis. Alternative : Configuration de Firestore Database

1. Dans la console Firebase, allez dans "Firestore Database"  
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode "production"
4. Sélectionnez une région proche (Europe pour la France)

#### Structure Realtime Database

```json
// Structure JSON pour Realtime Database
{
  "persons": {
    "person_id_1": {
      "description": "string",
      "latitude": "number", 
      "longitude": "number",
      "gender": "string",
      "ageCategory": "string",
      "dateEncounter": "timestamp",
      "locationVisited": "boolean",
      "firstName": "string",
      "lastName": "string", 
      "consentGiven": "boolean",
      "signature": "string",
      "photoUrl": "string",
      "documentUrl": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "createdBy": "string"
    }
  },
  "users": {
    "user_id_1": {
      "email": "string",
      "displayName": "string", 
      "role": "string",
      "isActive": "boolean",
      "createdAt": "timestamp"
    }
  },
  "counters": {
    "totalPersons": 0,
    "activeVolunteers": 0,
    "todayEncounters": 0
  }
}
```

#### Structure des collections Firestore (alternative)

```javascript  
// Collection: persons
{
  id: "auto-generated",
  description: "string",
  latitude: "number", 
  longitude: "number",
  gender: "string", // homme, femme, autre, non-specifie
  ageCategory: "string", // adulte, enfant
  dateEncounter: "timestamp",
  locationVisited: "boolean",
  firstName: "string",
  lastName: "string",
  consentGiven: "boolean",
  signature: "string", // base64 image
  photoUrl: "string", // Firebase Storage URL
  documentUrl: "string", // Firebase Storage URL
  createdAt: "timestamp",
  updatedAt: "timestamp",
  createdBy: "string" // user ID
}

// Collection: users (bénévoles)
{
  id: "auto-generated",
  email: "string",
  displayName: "string",
  role: "string", // admin, volunteer
  isActive: "boolean",
  createdAt: "timestamp"
}
```

### 3. Configuration de Firebase Storage

1. Allez dans "Storage" 
2. Cliquez sur "Commencer"
3. Configurez les règles de sécurité :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Photos et documents des personnes
    match /persons/{personId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Photos de profil des bénévoles
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Configuration de l'Authentication

1. Allez dans "Authentication"
2. Activez les méthodes de connexion :
   - Email/mot de passe
   - Google (optionnel)
3. Configurez les domaines autorisés :
   - `localhost` (développement)
   - Votre domaine de production

### 5. Règles de Sécurité Realtime Database

```json
{
  "rules": {
    // Seuls les utilisateurs authentifiés peuvent accéder aux données
    "persons": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    
    // Les utilisateurs peuvent lire leur propre profil
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    
    // Compteurs accessibles en lecture seule
    "counters": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 5bis. Règles de Sécurité Firestore (alternative)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Seuls les utilisateurs authentifiés peuvent accéder aux données
    match /persons/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Les utilisateurs ne peuvent lire que leur propre profil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Les admins peuvent gérer tous les utilisateurs
    match /users/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6. Configuration Web App

1. Dans les paramètres du projet, cliquez sur l'icône web `</>`
2. Nommez votre app : `deeps-roller-maraude-web`
3. Cochez "Configurer Firebase Hosting"
4. Récupérez la configuration :

```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-project-id.firebaseapp.com",
  databaseURL: "https://votre-project-id-default-rtdb.europe-west1.firebasedatabase.app/", // Pour Realtime Database
  projectId: "votre-project-id",
  storageBucket: "votre-project-id.appspot.com",
  messagingSenderId: "votre-sender-id",
  appId: "votre-app-id"
};

export default firebaseConfig;
```

### 7. Variables d'Environnement

Créez `.env.local` dans le frontend :

```bash
# Frontend .env.local
REACT_APP_FIREBASE_API_KEY=votre-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre-project-id.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://votre-project-id-default-rtdb.europe-west1.firebasedatabase.app/
REACT_APP_FIREBASE_PROJECT_ID=votre-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre-sender-id
REACT_APP_FIREBASE_APP_ID=votre-app-id
```

### 8. Installation des SDK Firebase

```bash
# Dans le frontend
cd frontend
pnpm add firebase

# Dans le backend (optionnel)
cd backend
gem 'firebase-admin-sdk'
```

### 9. Configuration Avancée

#### Indices Firestore

```javascript
// Pour optimiser les requêtes
persons: [
  { fields: ['dateEncounter'], order: 'desc' },
  { fields: ['locationVisited', 'dateEncounter'], order: 'desc' },
  { fields: ['gender', 'dateEncounter'], order: 'desc' },
  { fields: ['ageCategory', 'dateEncounter'], order: 'desc' }
]
```

#### Functions Firebase (optionnel)

```bash
# Installation
npm install -g firebase-tools
firebase init functions

# Fonctions utiles :
# - Redimensionnement automatique des images
# - Notifications push
# - Nettoyage des données
# - Statistiques automatiques
```

### 10. Déploiement avec Firebase Hosting

```bash
# Configuration
firebase init hosting

# Build et déploiement
cd frontend
pnpm build
firebase deploy --only hosting
```

### 🔒 Sécurité et Bonnes Pratiques

1. **Jamais de clés privées dans le code**
2. **Utiliser les variables d'environnement**
3. **Configurer les règles de sécurité strictes**
4. **Limiter l'accès par domaine**
5. **Audit régulier des permissions**
6. **Backup automatique des données**

### 📊 Monitoring

1. Activez Analytics dans Firebase
2. Configurez les alertes de sécurité
3. Surveillez les quotas d'usage
4. Mettez en place des alertes de coût

### 🚨 Limitations Gratuites Firebase

- **Firestore** : 50k lectures/jour, 20k écritures/jour
- **Storage** : 1GB stockage, 10GB transfert/mois
- **Hosting** : 10GB stockage, 360MB/jour
- **Functions** : 125k invocations/mois

Pour une utilisation intensive, prévoir un plan Blaze (pay-as-you-go).

---

✅ Une fois configuré, Firebase fournira une infrastructure robuste et scalable pour votre application d'aide aux SDF.