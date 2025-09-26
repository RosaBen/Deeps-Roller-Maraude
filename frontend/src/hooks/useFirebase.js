// Hook personnalisé pour Firebase Realtime Database
import { useState, useEffect } from 'react';
import personsRealtimeService from '../services/personsRealtime';
import authService from '../services/auth';

// Hook pour les personnes en temps réel
export const usePersonsRealtime = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const setupRealtimeListener = () => {
      try {
        unsubscribe = personsRealtimeService.onPersonsChange((personsData) => {
          setPersons(personsData);
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const createPerson = async (personData) => {
    try {
      return await personsRealtimeService.createPerson(personData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePerson = async (personId, updates) => {
    try {
      return await personsRealtimeService.updatePerson(personId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePerson = async (personId) => {
    try {
      return await personsRealtimeService.deletePerson(personId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    persons,
    loading,
    error,
    createPerson,
    updatePerson,
    deletePerson
  };
};

// Hook pour les statistiques en temps réel
export const useStatsRealtime = () => {
  const [stats, setStats] = useState({
    totalPersons: 0,
    activeVolunteers: 0,
    todayEncounters: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = personsRealtimeService.onStatsChange((statsData) => {
      setStats(statsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { stats, loading };
};

// Hook pour l'authentification
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        const data = await authService.getCurrentUserData();
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    return await authService.signIn(email, password);
  };

  const signUp = async (email, password, userData) => {
    return await authService.signUp(email, password, userData);
  };

  const signOut = async () => {
    return await authService.signOut();
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const isAdmin = async () => {
    return await authService.isAdmin();
  };

  return {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
    isAuthenticated: !!user
  };
};