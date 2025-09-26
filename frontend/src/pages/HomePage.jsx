import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { personService } from '../services/api';

const HomePage = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await personService.getAllPersons();
      setPersons(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching persons:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: persons.length,
    adults: persons.filter(p => p.ageCategory === 'adulte').length,
    children: persons.filter(p => p.ageCategory === 'enfant').length,
    visited: persons.filter(p => p.locationVisited).length,
    recentEncounters: persons
      .sort((a, b) => new Date(b.dateEncounter).getTime() - new Date(a.dateEncounter).getTime())
      .slice(0, 5),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchPersons}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container space-y-6 pb-20 md:pb-6">
      {/* Bienvenue simple */}
      <div className="welcome-section">
        <h1 className="welcome-title">Deeps Roller Maraude</h1>
        <p className="welcome-subtitle">
          Aide aux personnes en situation de rue
        </p>
        
        <div className="main-counter">
          <div className="main-counter-number">{stats.total}</div>
          <div className="main-counter-label">Personnes rencontrées</div>
        </div>
      </div>

      {/* Statistiques simples */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-number">{stats.adults}</div>
          <div className="stat-label">Adultes</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.children}</div>
          <div className="stat-label">Enfants</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.visited}</div>
          <div className="stat-label">Visités</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.total - stats.visited}</div>
          <div className="stat-label">À visiter</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <Link to="/add" className="quick-action">
          <div className="quick-action-icon">
            <PlusIcon className="w-5 h-5" />
          </div>
          <div className="quick-action-text">
            <h3>Ajouter</h3>
            <p>Nouvelle personne</p>
          </div>
        </Link>

        <Link to="/map" className="quick-action">
          <div className="quick-action-icon">
            <MapIcon className="w-5 h-5" />
          </div>
          <div className="quick-action-text">
            <h3>Carte</h3>
            <p>Voir les lieux</p>
          </div>
        </Link>
      </div>



      {/* Message si aucune donnée */}
      {stats.total === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune personne enregistrée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter votre première rencontre.
          </p>
          <div className="mt-6">
            <Link
              to="/add"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Ajouter une personne
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;