// Firebase Realtime Database service for persons
import { ref, push, set, get, onValue, off, remove, update } from 'firebase/database';
import { database } from './firebase';

class PersonsRealtimeService {
  constructor () {
    this.personsRef = ref(database, 'persons');
    this.countersRef = ref(database, 'counters');
  }

  // Créer une nouvelle personne
  async createPerson (personData) {
    try {
      const newPersonRef = push(this.personsRef);
      const personWithId = {
        ...personData,
        id: newPersonRef.key,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(newPersonRef, personWithId);

      // Mettre à jour les compteurs
      await this.incrementCounter('totalPersons');
      await this.incrementCounter('todayEncounters');

      return { id: newPersonRef.key, ...personWithId };
    } catch (error) {
      console.error('Erreur lors de la création de la personne:', error);
      throw error;
    }
  }

  // Lire toutes les personnes
  async getAllPersons () {
    try {
      const snapshot = await get(this.personsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des personnes:', error);
      throw error;
    }
  }

  // Écouter les changements en temps réel
  onPersonsChange (callback) {
    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const persons = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        callback(persons);
      } else {
        callback([]);
      }
    };

    onValue(this.personsRef, handleData);

    // Retourner une fonction de nettoyage
    return () => off(this.personsRef, 'value', handleData);
  }

  // Mettre à jour une personne
  async updatePerson (personId, updates) {
    try {
      const personRef = ref(database, `persons/${personId}`);
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };

      await update(personRef, updateData);
      return { id: personId, ...updates };
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  // Supprimer une personne
  async deletePerson (personId) {
    try {
      const personRef = ref(database, `persons/${personId}`);
      await remove(personRef);

      // Décrémenter le compteur
      await this.decrementCounter('totalPersons');

      return personId;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Obtenir une personne par ID
  async getPersonById (personId) {
    try {
      const personRef = ref(database, `persons/${personId}`);
      const snapshot = await get(personRef);

      if (snapshot.exists()) {
        return { id: personId, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la personne:', error);
      throw error;
    }
  }

  // Filtrer les personnes par critères
  async getPersonsByFilter (filterCriteria = {}) {
    try {
      const allPersons = await this.getAllPersons();

      return allPersons.filter(person => {
        let matches = true;

        if (filterCriteria.gender && person.gender !== filterCriteria.gender) {
          matches = false;
        }

        if (filterCriteria.ageCategory && person.ageCategory !== filterCriteria.ageCategory) {
          matches = false;
        }

        if (filterCriteria.locationVisited !== undefined && person.locationVisited !== filterCriteria.locationVisited) {
          matches = false;
        }

        if (filterCriteria.dateFrom && person.dateEncounter < filterCriteria.dateFrom) {
          matches = false;
        }

        if (filterCriteria.dateTo && person.dateEncounter > filterCriteria.dateTo) {
          matches = false;
        }

        return matches;
      });
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
      throw error;
    }
  }

  // Gérer les compteurs
  async incrementCounter (counterName) {
    try {
      const counterRef = ref(database, `counters/${counterName}`);
      const snapshot = await get(counterRef);
      const currentValue = snapshot.exists() ? snapshot.val() : 0;
      await set(counterRef, currentValue + 1);
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation du compteur:', error);
    }
  }

  async decrementCounter (counterName) {
    try {
      const counterRef = ref(database, `counters/${counterName}`);
      const snapshot = await get(counterRef);
      const currentValue = snapshot.exists() ? snapshot.val() : 0;
      await set(counterRef, Math.max(0, currentValue - 1));
    } catch (error) {
      console.error('Erreur lors de la décrémentation du compteur:', error);
    }
  }

  // Obtenir les statistiques
  async getStats () {
    try {
      const snapshot = await get(this.countersRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {
        totalPersons: 0,
        activeVolunteers: 0,
        todayEncounters: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return {
        totalPersons: 0,
        activeVolunteers: 0,
        todayEncounters: 0
      };
    }
  }

  // Écouter les changements de statistiques en temps réel
  onStatsChange (callback) {
    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback({
          totalPersons: 0,
          activeVolunteers: 0,
          todayEncounters: 0
        });
      }
    };

    onValue(this.countersRef, handleData);
    return () => off(this.countersRef, 'value', handleData);
  }
}

const personsRealtimeService = new PersonsRealtimeService();
export default personsRealtimeService;