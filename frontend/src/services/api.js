import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const personService = {
  // Récupérer toutes les personnes
  async getAllPersons () {
    try {
      const response = await api.get('/persons');
      const data = response.data || [];

      // Normaliser les données et mapper les champs backend vers frontend
      return data.map(person => ({
        ...person,
        ageCategory: person.age_category,
        dateEncounter: person.date_encounter,
        locationVisited: Boolean(person.location_visited),
        firstName: person.first_name,
        lastName: person.last_name,
        consentGiven: Boolean(person.consent_given),
        latitude: person.latitude ? parseFloat(person.latitude) : null,
        longitude: person.longitude ? parseFloat(person.longitude) : null
      }));
    } catch (error) {
      console.error('Erreur API getAllPersons:', error);
      // Retourner des données de test si l'API n'est pas disponible
      return [
        {
          id: 1,
          description: 'Personne de test - homme âgé',
          gender: 'homme',
          ageCategory: 'adulte',
          dateEncounter: new Date().toISOString(),
          locationVisited: false,
          latitude: 48.8566,
          longitude: 2.3522
        },
        {
          id: 2,
          description: 'Personne de test - femme avec enfant',
          gender: 'femme',
          ageCategory: 'adulte',
          dateEncounter: new Date(Date.now() - 86400000).toISOString(),
          locationVisited: true,
          latitude: 48.8606,
          longitude: 2.3376
        }
      ];
    }
  },

  // Créer une nouvelle personne avec fichiers
  async createPerson (personData) {
    const formData = new FormData();

    // Mapper les champs frontend vers backend
    const fieldMapping = {
      'ageCategory': 'age_category',
      'dateEncounter': 'date_encounter',
      'locationVisited': 'location_visited',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'consentGiven': 'consent_given'
    };

    // Ajouter les données de base avec mapping des champs
    Object.keys(personData).forEach(key => {
      if (key !== 'photoFile' && key !== 'documentFile' && personData[key] !== null && personData[key] !== undefined) {
        const backendKey = fieldMapping[key] || key;
        formData.append(`person[${backendKey}]`, personData[key]);
      }
    });

    // Ajouter les fichiers s'ils existent
    if (personData.photoFile) {
      formData.append('person[photo]', personData.photoFile);
    }
    if (personData.documentFile) {
      formData.append('person[document]', personData.documentFile);
    }

    const response = await api.post('/persons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour une personne
  async updatePerson (id, personData) {
    const formData = new FormData();

    // Mapper les champs frontend vers backend
    const fieldMapping = {
      'ageCategory': 'age_category',
      'dateEncounter': 'date_encounter',
      'locationVisited': 'location_visited',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'consentGiven': 'consent_given'
    };

    // Ajouter les données de base avec mapping des champs
    Object.keys(personData).forEach(key => {
      if (key !== 'photoFile' && key !== 'documentFile' && personData[key] !== null && personData[key] !== undefined) {
        const backendKey = fieldMapping[key] || key;
        formData.append(`person[${backendKey}]`, personData[key]);
      }
    });

    if (personData.photoFile) {
      formData.append('person[photo]', personData.photoFile);
    }
    if (personData.documentFile) {
      formData.append('person[document]', personData.documentFile);
    }

    const response = await api.put(`/persons/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer une personne
  async deletePerson (id) {
    await api.delete(`/persons/${id}`);
  },

  // Récupérer une personne par ID
  async getPersonById (id) {
    const response = await api.get(`/persons/${id}`);
    const person = response.data;

    // Mapper les champs backend vers frontend
    return {
      ...person,
      ageCategory: person.age_category,
      dateEncounter: person.date_encounter,
      locationVisited: Boolean(person.location_visited),
      firstName: person.first_name,
      lastName: person.last_name,
      consentGiven: Boolean(person.consent_given),
      latitude: person.latitude ? parseFloat(person.latitude) : null,
      longitude: person.longitude ? parseFloat(person.longitude) : null
    };
  },

  // Récupérer les statistiques du dashboard
  async getDashboardStats () {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;