# Guide de Déploiement - Deeps Roller Maraude

## 🚀 Déploiement Multi-Plateforme

### 📱 1. Application Web (PWA)

#### Option A : Netlify (Recommandé pour React)

```bash
# 1. Build du projet
cd frontend
pnpm build

# 2. Déploiement via Git (automatique)
git push origin main

# 3. Configuration Netlify
# - Connecter le repository GitHub
# - Branch: main
# - Build command: cd frontend && pnpm build
# - Publish directory: frontend/build
```

**Variables d'environnement Netlify :**
```bash
REACT_APP_API_URL=https://votre-backend.herokuapp.com/api/v1
REACT_APP_FIREBASE_API_KEY=votre-firebase-key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre-project.firebaseapp.com
# ... autres variables Firebase
```

#### Option B : Vercel

```bash
# Installation CLI
npm i -g vercel

# Déploiement
cd frontend
vercel

# Configuration
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_FIREBASE_API_KEY
# ... autres variables
```

#### Option C : Firebase Hosting

```bash
# Configuration
cd frontend
npm install -g firebase-tools
firebase login
firebase init hosting

# Déploiement
pnpm build
firebase deploy
```

### 🚂 2. Backend Rails API

#### Option A : Railway (Recommandé)

```bash
# 1. Installation CLI Railway
npm install -g @railway/cli

# 2. Login et déploiement
railway login
cd backend
railway create deeps-roller-maraude-api
railway up

# 3. Configuration base de données
railway add postgresql
railway run rails db:create db:migrate db:seed
```

#### Option B : Heroku

```bash
# 1. Installation CLI Heroku
# Télécharger depuis heroku.com/cli

# 2. Création et déploiement
cd backend
heroku create deeps-roller-maraude-api
git subtree push --prefix=backend heroku main

# 3. Configuration base de données
heroku addons:create heroku-postgresql:mini
heroku run rails db:migrate
heroku run rails db:seed
```

#### Variables d'environnement Backend :
```bash
# Railway/Heroku
RAILS_ENV=production
RAILS_MASTER_KEY=votre-master-key
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://votre-frontend.netlify.app
```

### 📱 3. Application Mobile (React Native)

#### Installation React Native CLI

```bash
# Installation globale
npm install -g @react-native-community/cli

# Création du projet mobile
cd ..
npx react-native init DeepsRollerMaraudeMobile
cd DeepsRollerMaraudeMobile
```

#### Structure Mobile

```
mobile/
├── android/          # Projet Android
├── ios/             # Projet iOS  
├── src/
│   ├── components/   # Composants partagés avec web
│   ├── screens/      # Écrans mobiles
│   ├── navigation/   # Navigation React Navigation
│   └── services/     # API calls
├── package.json
└── metro.config.js
```

#### Déploiement iOS

```bash
# 1. Configuration Xcode
cd ios
pod install

# 2. Build et archive
xcodebuild -workspace DeepsRollerMaraudeMobile.xcworkspace \
  -scheme DeepsRollerMaraudeMobile \
  -configuration Release \
  -archivePath build/DeepsRollerMaraudeMobile.xcarchive \
  archive

# 3. Export pour App Store
xcodebuild -exportArchive \
  -archivePath build/DeepsRollerMaraudeMobile.xcarchive \
  -exportPath build/ios \
  -exportOptionsPlist ExportOptions.plist
```

#### Déploiement Android

```bash
# 1. Génération APK
cd android
./gradlew assembleRelease

# 2. Génération AAB (App Bundle - recommandé)
./gradlew bundleRelease

# 3. Upload sur Google Play Console
# Fichier généré : android/app/build/outputs/bundle/release/app-release.aab
```

### 🖥️ 4. Application Desktop (Electron)

```bash
# 1. Installation Electron
mkdir desktop
cd desktop
npm init -y
npm install electron electron-builder

# 2. Configuration package.json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "dist": "npm run build"
  },
  "build": {
    "appId": "com.deepsroller.maraude",
    "productName": "Deeps Roller Maraude",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "main.js",
      "preload.js"
    ]
  }
}

# 3. Build multi-plateforme
npm run dist
```

## 🔧 Configuration CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main, dev ]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: cd frontend && pnpm install
    - name: Build
      run: cd frontend && pnpm build
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './frontend/build'
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-api:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Railway
      uses: bervProject/railway-deploy@v1.2.0
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        service: 'backend'
```

## 🌐 Configuration DNS et Domaines

### Configuration personnalisée

```bash
# 1. Acheter un domaine (ex: deepsroller.org)

# 2. Configuration DNS
# A record: @ -> IP Netlify/Vercel
# CNAME: api -> votre-backend.railway.app
# CNAME: www -> @

# 3. Certificats SSL automatiques (Let's Encrypt)
# Netlify/Vercel le gèrent automatiquement
```

## 📊 Monitoring et Analytics

### Configuration Sentry (Erreurs)

```bash
# Installation
cd frontend
pnpm add @sentry/react @sentry/tracing

cd backend  
gem 'sentry-ruby'
gem 'sentry-rails'
```

### Google Analytics

```html
<!-- Dans public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Variables d'Environnement de Production

### Frontend (Netlify/Vercel)
```bash
NODE_ENV=production
REACT_APP_API_URL=https://api.deepsroller.org
REACT_APP_FIREBASE_API_KEY=prod-firebase-key
REACT_APP_SENTRY_DSN=https://sentry-dsn
GENERATE_SOURCEMAP=false
```

### Backend (Railway/Heroku)
```bash
RAILS_ENV=production
SECRET_KEY_BASE=your-secret-key
DATABASE_URL=postgresql://prod-db-url
CORS_ORIGINS=https://deepsroller.org,https://www.deepsroller.org
SENTRY_DSN=https://sentry-dsn-backend
```

## ✅ Checklist de Déploiement

- [ ] Tests passés en local
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] CORS configuré correctement
- [ ] HTTPS activé
- [ ] Monitoring en place
- [ ] Backup automatique
- [ ] Documentation mise à jour

## 🚨 Rollback en cas de Problème

```bash
# Netlify
netlify env:set REACT_APP_API_URL "https://old-api-url"

# Railway  
railway rollback

# Heroku
heroku releases:rollback v123
```

## 📱 Publication sur les Stores

### App Store (iOS)
1. Compte Apple Developer (99€/an)
2. App Store Connect
3. TestFlight pour les bêta
4. Révision Apple (1-7 jours)

### Google Play (Android)  
1. Compte Google Play Console (25€ unique)
2. Upload AAB
3. Tests internes/fermés/ouverts
4. Publication (2-3 heures)

---

🎉 **Votre application Deeps Roller Maraude sera disponible sur tous les canaux !**