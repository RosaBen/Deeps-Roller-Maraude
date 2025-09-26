# Deeps Roller Maraude

Une application mobile et web pour répertorier et aider les SDF à Paris.

## 🎯 Objectif

# 🏠 Deeps Roller Maraude

Application PWA (Progressive Web App) avec **React JavaScript** et **Rails API** pour cartographier et aider les personnes sans domicile fixe à Paris.

## ✨ Fonctionnalités

- 📱 **PWA Mobile-First** : Installation sur smartphone, fonctionnement hors-ligne partiel
- 🗺️ **Carte Interactive** : Géolocalisation et visualisation avec Leaflet
- 📸 **Capture Photos** : Prise de photo avec consentement électronique signé  
- 📊 **Dashboard** : Statistiques et gestion CRUD complète
- 🔐 **Respect de la dignité** : Consentement obligatoire, données sécurisées
- 🌐 **API REST** : Backend Rails avec Active Storage pour fichiers

## 🚀 État du Projet

### ✅ Terminé
- ✅ Structure complète React (JavaScript) + Rails API
- ✅ Base de données PostgreSQL avec modèle Person
- ✅ Capture photo et formulaire de consentement avec signature
- ✅ Géolocalisation automatique et manuelle
- ✅ Carte interactive avec marqueurs filtrable
- ✅ Dashboard avec statistiques et graphiques Chart.js
- ✅ Upload de fichiers avec Active Storage
- ✅ API REST complète avec sérialisation JSON
- ✅ Seed data (15 personnes de test)
- ✅ Documentation utilisateur et technique complète
- ✅ Workflow Git avec branches feature

### 🔄 En cours
- 🔄 Résolution des problèmes de compilation frontend (Tailwind/PostCSS)
- 🔄 Tests end-to-end complets

### 📋 À faire
- [ ] Tests unitaires (Jest + RSpec)
- [ ] Authentification JWT
- [ ] Déploiement production (Netlify + Railway/Heroku)
- [ ] Optimisation performances PWA

---

## 🏗️ Architecture Technique

```
Frontend (React PWA)          Backend (Rails API)
┌─────────────────────┐      ┌─────────────────────┐
│  React JavaScript   │────▶ │   Rails 8.0.3      │
│  Tailwind CSS       │      │   PostgreSQL        │
│  PWA + Service      │      │   Active Storage    │
│  Worker             │      │   CORS enabled      │
│  Leaflet Maps       │      │   JSON API          │
│  Chart.js           │      │   Person model      │
│  Camera Capture     │      │   File uploads      │
└─────────────────────┘      └─────────────────────┘
```

## 🛠️ Développement Local

### Prérequis
- **Node.js** 18+ et **pnpm**
- **Ruby** 3.2+ et **Rails** 8.0.3
- **PostgreSQL** 13+

### Installation Rapide
```bash
# Cloner et installer
git clone <repo-url>
cd deeps-roller-maraude

# Backend Rails
cd backend
bundle install
rails db:setup && rails db:seed
rails server -p 3001 &

# Frontend React  
cd ../frontend
pnpm install
pnpm start
```

### URLs de développement
- **Frontend** : http://localhost:3000 (React PWA)
- **Backend** : http://localhost:3001 (Rails API)
- **API Test** : http://localhost:3001/api/v1/dashboard/stats

---

## 📚 Documentation

- 📖 **[Guide Utilisateur](docs/user-guide.md)** : Instructions complètes d'utilisation
- 🔧 **[Guide Technique](docs/technical-guide.md)** : Architecture, API, développement  
- 🚀 **[Guide Déploiement](docs/deployment-guide.md)** : Production, CI/CD, monitoring
- 🔥 **[Setup Firebase](docs/firebase-setup.md)** : Configuration push notifications

---

## 🌐 API REST

### Endpoints principaux
```http
GET    /api/v1/persons           # Liste des personnes
POST   /api/v1/persons           # Ajouter une personne
GET    /api/v1/persons/:id       # Détails d'une personne
PATCH  /api/v1/persons/:id       # Modifier une personne
DELETE /api/v1/persons/:id       # Supprimer une personne
GET    /api/v1/dashboard/stats   # Statistiques
```

### Test de l'API
```bash
# Statistiques dashboard
curl http://localhost:3001/api/v1/dashboard/stats

# Liste des personnes
curl http://localhost:3001/api/v1/persons
```

---

## 🔄 Workflow Git

1. **Créer une branche feature**
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. **Développer et committer**
   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   ```

3. **Push et review sur GitHub**
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

4. **Merge vers dev puis main**

---

## 📊 Données de Test

Le projet inclut **15 personnes de test** avec :
- Descriptions variées et réalistes
- Géolocalisations dans Paris
- Mix d'adultes/enfants, hommes/femmes
- Statuts de visite différents

---

## 🔐 Sécurité & Éthique

### Protection des données
- ✅ **Consentement obligatoire** pour les photos
- ✅ **Signature électronique** pour validation
- ✅ **Géolocalisation sécurisée**
- ✅ **CORS configuré** pour sécurité API

### Respect de la dignité
- 🤝 **Approche bienveillante** avec les personnes
- 📝 **Consentement éclairé** avant toute photo
- 🔒 **Confidentialité** totale des données
- ⚖️ **Usage humanitaire** uniquement

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Committer les changements  
4. Push vers la branche
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour les détails.

---

## 📞 Contact & Support

- 🐛 **Issues** : [GitHub Issues](../../issues)
- 📧 **Email** : admin@deepsroller.org  
- 📱 **Urgence** : [Numéro de contact]

---

✨ **Projet développé avec ❤️ pour aider les personnes en situation de rue à Paris**

## 🚀 Fonctionnalités

- **Compteur de personnes** avec géolocalisation
- **Carte interactive** montrant les emplacements
- **Profils détaillés** (genre, âge, description, date)
- **Dashboard administratif** (CRUD, graphiques, statistiques)
- **Suivi des visites** par lieu
- **Applications multi-plateformes** (Web, iOS, Android, Desktop)

## 🛠️ Stack Technique

### Frontend
- **React** avec JavaScript
- **React Native** pour mobile (iOS/Android)
- **Electron** pour desktop
- **Firebase** pour la base de données
- **Mapbox/Google Maps** pour la cartographie
- **Chart.js/Recharts** pour les graphiques

### Backend
- **Ruby on Rails** API
- **PostgreSQL** base de données principale
- **Firebase** pour l'authentification et sync temps réel

### Déploiement
- **Netlify/Vercel** pour le frontend web
- **Heroku/Railway** pour le backend Rails
- **App Store/Google Play** pour les apps mobiles

## 📁 Structure du Projet

```
deeps-roller-maraude/
├── frontend/                 # Application React Web
├── mobile/                   # Application React Native
├── desktop/                  # Application Electron
├── backend/                  # API Rails
├── shared/                   # Code partagé
├── docs/                     # Documentation
├── deployment/               # Scripts de déploiement
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Ruby 3.0+
- Rails 7.0+
- pnpm
- PostgreSQL
- Git

### Installation rapide

```bash
# Cloner le projet
git clone git@github.com:RosaBen/Deeps-Roller-Maraude.git
cd Deeps-Roller-Maraude

# Installer les dépendances frontend
cd frontend
pnpm install

# Installer les dépendances backend
cd ../backend
bundle install
rails db:setup

# Lancer en mode développement
# Terminal 1 - Backend
cd backend && rails server

# Terminal 2 - Frontend  
cd frontend && pnpm start
```

## 📱 Déploiement

### Web (Netlify/Vercel)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement sur push

### Mobile
1. **iOS**: Utiliser Xcode et App Store Connect
2. **Android**: Utiliser Android Studio et Google Play Console

Voir `/docs/deployment-guide.md` pour les instructions détaillées.

## 📖 Documentation

- [Guide Utilisateur](/docs/user-guide.md)
- [Guide Développeur](/docs/developer-guide.md) 
- [Guide Déploiement](/docs/deployment-guide.md)
- [Configuration Firebase](/docs/firebase-setup.md)

## 🤝 Contribution

Cette application est destinée à un usage restreint par des bénévoles autorisés pour l'aide aux personnes sans domicile fixe.

## 📄 Licence

Privée - Usage réservé aux bénévoles autorisés.# Deeps-Roller-Maraude
