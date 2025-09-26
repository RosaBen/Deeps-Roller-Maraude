# Guide Utilisateur - Deeps Roller Maraude

## 👥 À qui s'adresse cette application ?

Cette application est destinée aux **bénévoles autorisés** travaillant avec les personnes en situation de rue à Paris. Elle permet de cartographier, suivre et coordonner l'aide apportée aux personnes sans domicile fixe.

---

## 🏠 Page d'Accueil

### Vue d'ensemble
La page d'accueil affiche :
- **Compteur principal** : Nombre total de personnes rencontrées
- **Statistiques rapides** : Adultes, enfants, lieux visités, lieux à visiter
- **Actions rapides** : Boutons pour ajouter une personne ou voir la carte
- **Rencontres récentes** : Liste des 5 dernières personnes ajoutées

### Actions possibles
- ➕ **Ajouter une personne** : Enregistrer une nouvelle rencontre
- 🗺️ **Voir la carte** : Visualiser toutes les personnes géolocalisées
- 📊 **Accéder au dashboard** : Gestion complète des données

---

## ➕ Ajouter une Personne

### Informations obligatoires
1. **Description physique** (minimum 10 caractères)
   - Vêtements, traits distinctifs, situation observée
   - Exemple : "Homme âgé, manteau marron, assis près métro"

2. **Genre** : Homme, Femme, Autre, Non spécifié

3. **Catégorie d'âge** : Adulte ou Enfant

4. **Date de rencontre** (pré-remplie avec aujourd'hui)

5. **Géolocalisation** (obligatoire)
   - Cliquez sur "Obtenir ma position actuelle"
   - Ou saisissez manuellement latitude/longitude

### Informations optionnelles

#### 👤 Informations personnelles
- **Prénom** et **Nom** (si la personne consent à les donner)

#### 📷 Photo et Documents
- **Prendre une photo** : Utilise la caméra de votre appareil
- **Formulaire de consentement** : Obligatoire si photo prise
- **Télécharger des documents** : Images, PDF, documents Word

#### ✅ Statut de visite
- Cochez si le lieu a déjà été visité pour une distribution

### 📸 Prendre une Photo

1. Cliquez sur "Prendre une photo"
2. Autorisez l'accès à la caméra
3. Positionnez l'appareil et prenez la photo
4. Confirmez ou reprenez si nécessaire

**⚠️ Important** : Une photo nécessite obligatoirement un consentement signé.

### ✍️ Formulaire de Consentement

Le formulaire apparaît automatiquement si vous prenez une photo :

1. **Informations requises** :
   - Prénom et nom de la personne
   - Date (pré-remplie)

2. **Texte de consentement** :
   - Explique l'usage des photos
   - Garantit la confidentialité
   - Précise le but humanitaire

3. **Signature électronique** :
   - Dessinez avec votre doigt ou stylet
   - Bouton "Effacer" pour recommencer
   - "Valider" pour sauvegarder

4. **Confirmation** : Cochez "Je donne mon consentement"

---

## 🗺️ Carte Interactive

### Vue générale
- **Marqueurs** : Chaque personne est représentée par un marqueur
- **Couleurs** :
  - 🔴 Rouge : Lieu non visité
  - 🟢 Vert : Lieu déjà visité

### Navigation
- **Zoom** : Molette ou boutons +/-
- **Déplacement** : Clic et glissé
- **Centrage** : Double-clic pour centrer

### Informations détaillées
Cliquez sur un marqueur pour voir :
- Numéro de la personne
- Description
- Genre et âge  
- Date de rencontre
- Coordonnées GPS
- Statut de visite

### Filtres disponibles
- **Par statut** : Visités / Non visités
- **Par genre** : Homme, Femme, Autre, Non spécifié
- **Par âge** : Adultes, Enfants

---

## 📊 Dashboard (Administration)

### Vue d'ensemble
- **Graphiques statistiques** :
  - Répartition par genre (graphique en secteurs)
  - Répartition par âge (graphique en secteurs) 
  - Statut des visites
  - Évolution temporelle (graphique en barres)

- **Statistiques numériques** :
  - Total personnes
  - Lieux visités
  - Lieux non visités
  - Nombre d'enfants

### Gestion des données

#### Liste complète
Tableau avec toutes les personnes enregistrées :
- ID, Description, Genre, Âge, Date, Statut

#### Actions possibles
- ✏️ **Modifier** : Cliquez sur l'icône crayon
- 🗑️ **Supprimer** : Cliquez sur l'icône poubelle (avec confirmation)
- 👁️ **Changer le statut de visite** : Cliquez sur le badge statut

---

## 📱 Utilisation Mobile (PWA)

### Installation
1. Ouvrez l'app dans votre navigateur mobile
2. Menu navigateur > "Ajouter à l'écran d'accueil"
3. L'app apparaît comme une vraie application mobile

### Fonctionnalités offline
- ✅ Consultation des données en cache
- ✅ Prise de photos
- ❌ Ajout de nouvelles personnes (nécessite internet)

### Navigation mobile
- **Menu bas** : Navigation tactile optimisée
- **Boutons larges** : Facilité d'utilisation au doigt
- **Formulaires adaptatifs** : Clavier optimisé selon le champ

---

## 🔐 Sécurité et Confidentialité

### Protection des données
- **Données chiffrées** en transit et au repos
- **Accès restreint** aux bénévoles autorisés uniquement
- **Photos sécurisées** avec consentement obligatoire
- **Géolocalisation** : Stockage sécurisé des coordonnées

### Bonnes pratiques
1. **Ne jamais partager** vos identifiants de connexion
2. **Demander toujours le consentement** avant de prendre une photo
3. **Vérifier les informations** avant validation
4. **Se déconnecter** en fin de session sur appareil partagé

### Respect de la dignité
- Approche respectueuse et bienveillante
- Explication claire de l'objectif d'aide
- Respect du refus de la personne
- Confidentialité totale des informations

---

## 🚨 Résolution de Problèmes

### Problèmes courants

#### "Géolocalisation non disponible"
1. Vérifiez les permissions de localisation dans votre navigateur
2. Activez le GPS de votre appareil
3. Rafraîchissez la page
4. En cas d'échec, saisissez les coordonnées manuellement

#### "Erreur lors de l'envoi"
1. Vérifiez votre connexion internet
2. Réessayez dans quelques instants
3. Si persistant, contactez l'administrateur

#### "Photo non sauvegardée"
1. Vérifiez l'espace de stockage de votre appareil
2. Autorisez l'accès à la caméra
3. Réduisez la qualité photo si nécessaire

#### "Signature non reconnue" 
1. Tracez la signature plus lentement
2. Utilisez un trait plus épais
3. Évitez les mouvements trop rapides

### Contact Support
En cas de problème persistant :
- 📧 Email : admin@deepsroller.org
- 📱 Téléphone : [Numéro d'urgence]
- 💬 Chat : Bouton d'aide dans l'application

---

## 📋 Workflow Recommandé

### 1. Préparation de la maraude
- [ ] Vérifier la charge de la batterie
- [ ] Tester la connexion internet
- [ ] Ouvrir l'application et se connecter

### 2. Sur le terrain
- [ ] Approche respectueuse de la personne
- [ ] Explication de l'objectif d'aide
- [ ] Demande de consentement si photo nécessaire
- [ ] Enregistrement des informations
- [ ] Géolocalisation précise

### 3. Après la rencontre
- [ ] Vérification des informations saisies
- [ ] Ajout d'éventuelles notes complémentaires
- [ ] Synchronisation des données

### 4. Fin de maraude
- [ ] Consultation du dashboard pour bilan
- [ ] Planification des prochaines visites
- [ ] Déconnexion sécurisée

---

## 🎯 Conseils d'Utilisation Optimale

### Efficacité sur le terrain
1. **Préparez des phrases type** pour expliquer votre démarche
2. **Utilisez la géolocalisation automatique** pour gagner du temps
3. **Prenez des photos de l'environnement** (avec consentement) pour contexte
4. **Utilisez les filtres de carte** pour optimiser vos tournées

### Qualité des données
1. **Descriptions précises** facilitent l'identification future
2. **Coordonnées exactes** essentielles pour retrouver les personnes
3. **Mise à jour du statut de visite** aide la coordination équipe
4. **Photos respectueuses** de la dignité des personnes

---

✨ **Cette application est un outil au service de la solidarité. Utilisez-la avec respect et bienveillance pour aider efficacement les personnes en situation de rue.**