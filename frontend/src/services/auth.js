// Firebase Authentication service
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from './firebase';

class AuthService {
  constructor () {
    this.currentUser = null;
    this.authStateListeners = [];

    // Écouter les changements d'état d'authentification
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach(listener => listener(user));
    });
  }

  // Inscription d'un nouvel utilisateur
  async signUp (email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Mettre à jour le profil
      await updateProfile(user, {
        displayName: userData.displayName || 'Bénévole'
      });

      // Sauvegarder les données utilisateur dans Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        email: user.email,
        displayName: userData.displayName || 'Bénévole',
        role: userData.role || 'volunteer',
        isActive: true,
        createdAt: Date.now()
      });

      return user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Connexion
  async signIn (email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Mettre à jour le statut actif
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        await set(userRef, {
          ...snapshot.val(),
          lastLogin: Date.now(),
          isActive: true
        });
      }

      return user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  // Déconnexion
  async signOut () {
    try {
      if (this.currentUser) {
        // Mettre à jour le statut inactif
        const userRef = ref(database, `users/${this.currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          await set(userRef, {
            ...snapshot.val(),
            lastLogout: Date.now(),
            isActive: false
          });
        }
      }

      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  // Réinitialisation du mot de passe
  async resetPassword (email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw error;
    }
  }

  // Obtenir les données de l'utilisateur actuel
  async getCurrentUserData () {
    try {
      if (!this.currentUser) return null;

      const userRef = ref(database, `users/${this.currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChange (callback) {
    this.authStateListeners.push(callback);

    // Retourner une fonction de nettoyage
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        listener => listener !== callback
      );
    };
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser () {
    return this.currentUser;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated () {
    return !!this.currentUser;
  }

  // Vérifier si l'utilisateur est admin
  async isAdmin () {
    try {
      const userData = await this.getCurrentUserData();
      return userData && userData.role === 'admin';
    } catch (error) {
      console.error('Erreur lors de la vérification admin:', error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;