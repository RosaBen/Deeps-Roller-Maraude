# Deeps Roller Maraude

Une application mobile et web pour répertorier et aider les SDF à Paris.

## 🎯 Objectif

Application destinée aux bénévoles pour cartographier et suivre les personnes sans domicile fixe à Paris afin d'optimiser l'aide et la distribution.

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

Privée - Usage réservé aux bénévoles autorisés.