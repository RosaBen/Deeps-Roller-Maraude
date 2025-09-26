# Guide Technique - Deeps Roller Maraude

## 🏗️ Architecture Générale

### Frontend (React PWA)
- **Framework** : React 18+ avec JavaScript (ES6+)
- **Styling** : Tailwind CSS + Heroicons
- **Routing** : React Router DOM
- **PWA** : Service Worker + Manifest
- **Cartes** : Leaflet + React-Leaflet
- **Graphiques** : Chart.js + React-Chartjs-2
- **Build Tool** : Create React App
- **Package Manager** : pnpm

### Backend (Rails API)
- **Framework** : Ruby on Rails 8.0.3
- **Database** : PostgreSQL
- **File Storage** : Active Storage
- **API Format** : JSON REST
- **CORS** : Rack-CORS
- **Authentication** : À implémenter (JWT recommandé)

---

## 📁 Structure des Fichiers

```
deeps-roller-maraude/
├── frontend/                   # Application React PWA
│   ├── public/
│   │   ├── manifest.json      # Configuration PWA
│   │   ├── sw.js             # Service Worker
│   │   └── index.html        # Point d'entrée
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── CameraCapture.jsx
│   │   │   ├── ConsentForm.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/           # Pages principales
│   │   │   ├── HomePage.jsx
│   │   │   ├── AddPersonPage.jsx
│   │   │   ├── MapPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/        # Logique métier
│   │   │   └── api.js      # Client API
│   │   ├── hooks/          # Hooks personnalisés
│   │   │   └── useGeolocation.js
│   │   └── types/          # Types/Constants JS
│   │       └── index.js
│   ├── package.json        # Dépendances npm
│   └── tailwind.config.js  # Configuration Tailwind
└── backend/                # API Rails
    ├── app/
    │   ├── controllers/
    │   │   └── api/v1/     # Controllers API versionnés
    │   │       ├── persons_controller.rb
    │   │       └── dashboard_controller.rb
    │   └── models/
    │       └── person.rb   # Modèle principal
    ├── config/
    │   ├── routes.rb       # Routes API
    │   ├── database.yml    # Configuration DB
    │   └── initializers/
    │       └── cors.rb     # Configuration CORS
    └── db/
        ├── migrate/        # Migrations DB
        └── seeds.rb        # Données de test
```

---

## 🗄️ Base de Données

### Modèle Person
```ruby
# Schema: people table
create_table "people", force: :cascade do |t|
  t.string   "first_name"           # Prénom (optionnel)
  t.string   "last_name"            # Nom (optionnel)
  t.text     "description"          # Description physique (obligatoire)
  t.string   "gender"               # Genre: male/female/other/unspecified
  t.string   "age_category"         # Âge: adult/child
  t.decimal  "latitude"             # Latitude GPS (obligatoire)
  t.decimal  "longitude"            # Longitude GPS (obligatoire)
  t.datetime "encountered_at"       # Date de rencontre
  t.boolean  "visited", default: false # Lieu visité ou non
  t.text     "notes"                # Notes additionnelles
  t.boolean  "has_consent", default: false # Consentement photo signé
  t.text     "consent_signature"    # Signature base64
  t.datetime "created_at"           # Métadonnées Rails
  t.datetime "updated_at"           # Métadonnées Rails
end

# Active Storage associations
- has_one_attached :photo          # Photo de la personne
- has_one_attached :consent_form   # Formulaire de consentement PDF
- has_many_attached :documents     # Documents additionnels
```

### Validations
```ruby
class Person < ApplicationRecord
  validates :description, presence: true, length: { minimum: 10 }
  validates :gender, inclusion: { in: %w[male female other unspecified] }
  validates :age_category, inclusion: { in: %w[adult child] }
  validates :latitude, presence: true, numericality: { in: -90..90 }
  validates :longitude, presence: true, numericality: { in: -180..180 }
  validates :encountered_at, presence: true
  
  # Si photo attachée, consentement requis
  validate :consent_required_for_photo
end
```

---

## 🔌 API Endpoints

### Base URL
- **Développement** : `http://localhost:3001/api/v1`
- **Production** : `https://api.deepsroller.org/api/v1`

### Routes disponibles

#### Persons Controller
```
GET    /api/v1/persons           # Liste toutes les personnes
POST   /api/v1/persons           # Crée une nouvelle personne
GET    /api/v1/persons/:id       # Détails d'une personne
PATCH  /api/v1/persons/:id       # Met à jour une personne
DELETE /api/v1/persons/:id       # Supprime une personne
```

#### Dashboard Controller
```
GET    /api/v1/dashboard/stats   # Statistiques générales
```

### Format des réponses

#### GET /api/v1/persons
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Jean",
      "last_name": "Doe", 
      "description": "Homme âgé, manteau marron, assis près métro",
      "gender": "male",
      "age_category": "adult",
      "latitude": "48.8566",
      "longitude": "2.3522",
      "encountered_at": "2024-01-15T10:30:00.000Z",
      "visited": false,
      "notes": "Semble avoir besoin d'aide médicale",
      "has_consent": true,
      "photo_url": "https://storage.url/photo.jpg",
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    }
  ],
  "meta": {
    "total": 125,
    "page": 1,
    "per_page": 50
  }
}
```

#### POST /api/v1/persons
```json
// Request body
{
  "person": {
    "first_name": "Marie",
    "description": "Femme jeune avec sac à dos rouge",
    "gender": "female",
    "age_category": "adult", 
    "latitude": 48.8566,
    "longitude": 2.3522,
    "encountered_at": "2024-01-15T14:20:00.000Z",
    "visited": false,
    "notes": "Parle anglais",
    "photo": "data:image/jpeg;base64,...", // Base64 image
    "has_consent": true,
    "consent_signature": "data:image/png;base64,..." // Base64 signature
  }
}

// Response
{
  "data": {
    "id": 126,
    // ... autres champs
  },
  "message": "Person created successfully"
}
```

#### GET /api/v1/dashboard/stats
```json
{
  "data": {
    "total_persons": 125,
    "adults": 98,
    "children": 27,
    "visited_locations": 45,
    "unvisited_locations": 80,
    "gender_distribution": {
      "male": 65,
      "female": 35,
      "other": 2,
      "unspecified": 23
    },
    "monthly_encounters": [
      { "month": "2024-01", "count": 23 },
      { "month": "2024-02", "count": 31 }
    ],
    "recent_encounters": [
      // 5 dernières personnes ajoutées
    ]
  }
}
```

---

## 🔧 Configuration Technique

### Variables d'Environnement

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1

# Map Configuration  
REACT_APP_MAP_CENTER_LAT=48.8566
REACT_APP_MAP_CENTER_LNG=2.3522
REACT_APP_MAP_ZOOM=13

# PWA Configuration
REACT_APP_NAME="Deeps Roller Maraude"
REACT_APP_SHORT_NAME="DeepsRoller"

# Development
REACT_APP_DEBUG=true
```

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost/deeps_roller_development

# Rails
RAILS_ENV=development
SECRET_KEY_BASE=your_secret_key_here

# Active Storage (production)
RAILS_ACTIVE_STORAGE_VARIANT_PROCESSOR=mini_magick

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://app.deepsroller.org
```

### Configuration CORS (backend)
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['ALLOWED_ORIGINS']&.split(',') || 'http://localhost:3000'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

---

## 🎨 Composants Frontend

### CameraCapture.jsx
**Responsabilité** : Capture photo via webcam
```javascript
// Props
{
  onPhotoCapture: (photoBlob) => void,
  onError: (error) => void
}

// États internes
- devices: Array<MediaDeviceInfo>  // Caméras disponibles
- stream: MediaStream              // Flux vidéo actuel
- isCapturing: boolean            // État capture
```

### ConsentForm.jsx  
**Responsabilité** : Formulaire consentement + signature
```javascript
// Props
{
  personData: Object,              // Données de la personne
  onConsentSubmit: (signature, formData) => void,
  isVisible: boolean
}

// États internes
- signature: String               // Signature base64
- isFormValid: boolean           // Validité formulaire
- consentGiven: boolean          // Case cochée
```

### InteractiveMap.jsx
**Responsabilité** : Carte Leaflet avec markers
```javascript
// Props
{
  persons: Array<Person>,          // Données à afficher
  filters: Object,                 // Filtres actifs
  onMarkerClick: (person) => void  // Callback clic
}

// États internes
- map: L.Map                     // Instance carte Leaflet
- markers: Array<L.Marker>       // Markers sur la carte
- userLocation: LatLng           // Position utilisateur
```

---

## 📱 PWA Configuration

### Manifest.json
```json
{
  "name": "Deeps Roller Maraude",
  "short_name": "DeepsRoller",
  "description": "Application d'aide aux personnes sans domicile fixe",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1f2937",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "logo192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (sw.js)
```javascript
const CACHE_NAME = 'deeps-roller-v1';
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Cache-first strategy pour les assets statiques
// Network-first pour les données API
```

---

## 🚀 Développement Local

### Prérequis
- **Node.js** 18+ et pnpm
- **Ruby** 3.2+ et Rails 8.0.3  
- **PostgreSQL** 13+
- **Git** pour versioning

### Installation
```bash
# Cloner le projet
git clone <repo-url>
cd deeps-roller-maraude

# Backend
cd backend
bundle install
rails db:setup
rails db:seed

# Frontend  
cd ../frontend
pnpm install

# Lancer les serveurs
# Terminal 1: Backend
cd backend && rails server -p 3001

# Terminal 2: Frontend
cd frontend && pnpm start
```

### Workflow de développement
1. **Créer une branche feature** : `git checkout -b feature/nom-feature`
2. **Développer et tester** localement
3. **Commit et push** : `git push origin feature/nom-feature`
4. **Merge vers dev** après validation
5. **Deploy en production** depuis main

---

## 🧪 Tests

### Frontend (Jest + Testing Library)
```bash
cd frontend
pnpm test                    # Tests unitaires
pnpm test:coverage          # Coverage
pnpm test:e2e               # Tests E2E (à implémenter)
```

### Backend (RSpec)
```bash
cd backend
bundle exec rspec           # Tests unitaires
bundle exec rspec --format documentation
```

### Tests recommandés
- **Composants React** : Rendu, interactions, props
- **API Controllers** : CRUD operations, validations
- **Models Rails** : Validations, associations
- **Integration** : Workflow complet ajout personne

---

## 📊 Monitoring & Performance

### Métriques à surveiller
- **Response time API** < 200ms
- **Bundle size** < 2MB
- **Lighthouse score** > 90
- **Database queries** optimisées
- **Image compression** automatique

### Outils recommandés
- **Sentry** : Error tracking
- **New Relic** : Performance monitoring  
- **Google Analytics** : Usage tracking
- **Lighthouse CI** : Performance continue

---

## 🔒 Sécurité

### Authentification (à implémenter)
```ruby
# Recommandation: JWT avec Devise
gem 'devise'
gem 'jwt'

# Middleware d'authentification
class AuthenticateUser
  def initialize(app)
    @app = app
  end
  
  def call(env)
    # Vérifier JWT token
    # Charger utilisateur courant
  end
end
```

### Validation des données
```javascript
// Frontend: Validation avant envoi
const validatePerson = (data) => {
  const errors = {};
  
  if (!data.description || data.description.length < 10) {
    errors.description = 'Description trop courte';
  }
  
  if (!data.latitude || !data.longitude) {
    errors.location = 'Géolocalisation requise';
  }
  
  return errors;
};
```

### Protection CSRF
```ruby
# Rails: Protection automatique
protect_from_forgery with: :exception, unless: -> { request.format.json? }

# API: Utiliser JWT au lieu de sessions
```

---

## 🚚 Déploiement

### Frontend (Netlify/Vercel)
```bash
# Build de production
pnpm run build

# Variables d'environnement production
REACT_APP_API_BASE_URL=https://api.deepsroller.org/api/v1
REACT_APP_MAP_CENTER_LAT=48.8566
REACT_APP_MAP_CENTER_LNG=2.3522
```

### Backend (Railway/Heroku/AWS)
```bash
# Préparation production
bundle exec rails assets:precompile
bundle exec rails db:migrate

# Variables d'environnement
DATABASE_URL=postgresql://...
RAILS_MASTER_KEY=...
ALLOWED_ORIGINS=https://app.deepsroller.org
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
    
jobs:
  test:
    # Run tests
  deploy-backend:
    # Deploy Rails API
  deploy-frontend:  
    # Deploy React App
```

---

## 🐛 Dépannage

### Problèmes courants

#### Erreurs CORS
```bash
# Vérifier configuration CORS
# backend/config/initializers/cors.rb
# Redémarrer serveur Rails
```

#### Géolocalisation non disponible
```javascript
// Vérifier HTTPS en production
// Demander permission explicitement
navigator.geolocation.getCurrentPosition(
  success,
  error, 
  { enableHighAccuracy: true, timeout: 10000 }
);
```

#### Images non uploadées
```bash
# Vérifier Active Storage configuration
rails active_storage:install
rails db:migrate

# Vérifier permissions de fichiers
```

### Logs utiles
```bash
# Backend logs
tail -f backend/log/development.log

# Frontend console
# Ouvrir DevTools > Console

# Base de données
rails db
\dt  -- Lister tables
```

---

## 📚 Ressources

### Documentation officielle
- [React](https://react.dev/)
- [Rails Guides](https://guides.rubyonrails.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet](https://leafletjs.com/reference.html)

### Dépendances principales
```json
// Frontend package.json (extraits)
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.2.0",
    "chart.js": "^4.2.0",
    "react-webcam": "^7.0.1",
    "react-signature-canvas": "^1.0.6"
  }
}
```

```ruby
# Backend Gemfile (extraits)
gem 'rails', '~> 8.0.3'
gem 'pg', '~> 1.1'
gem 'rack-cors'
gem 'image_processing', '~> 1.2'
gem 'bootsnap', '>= 1.4.4', require: false
```

---

## 🔄 Mise à Jour

### Versioning
- **Frontend** : Semantic versioning dans package.json
- **Backend** : Migrations Rails pour la DB
- **API** : Versioning via `/api/v1`, `/api/v2`

### Process de mise à jour
1. **Tests** sur branche feature
2. **Review** code sur dev
3. **Staging** deployment pour tests
4. **Production** deployment depuis main
5. **Rollback** plan en cas de problème

---

✨ **Cette documentation technique est maintenue à jour avec l'évolution du projet. Consultez régulièrement pour les derniers changements.**