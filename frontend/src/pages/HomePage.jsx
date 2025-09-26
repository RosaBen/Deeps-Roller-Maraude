import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
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
    <div className="space-y-6 pb-20 md:pb-6">
      {/* En-tête avec compteur principal */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bienvenue sur Deeps Roller Maraude</h1>
        <p className="text-primary-100 mb-4">
          Application de suivi pour l'aide aux personnes en situation de rue
        </p>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Nombre total de personnes rencontrées</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-primary-200" />
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Adultes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.adults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Enfants</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.children}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Lieux visités</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.visited}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">À visiter</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total - stats.visited}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/add"
          className="bg-primary-600 hover:bg-primary-700 text-white p-6 rounded-lg shadow transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">Ajouter une personne</h3>
            <p className="text-primary-200 text-sm">Enregistrer une nouvelle rencontre</p>
          </div>
          <PlusIcon className="w-8 h-8" />
        </Link>

        <Link
          to="/map"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">Voir la carte</h3>
            <p className="text-green-200 text-sm">Localiser toutes les personnes</p>
          </div>
          <MapIcon className="w-8 h-8" />
        </Link>
      </div>

      {/* Rencontres récentes */}
      {stats.recentEncounters.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Rencontres récentes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentEncounters.map((person) => (
              <div key={person.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Personne #{person.id}
                    </p>
                    <p className="text-sm text-gray-600">{person.description}</p>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-xs text-gray-500">
                        {person.gender === 'homme' ? 'Homme' : 
                         person.gender === 'femme' ? 'Femme' : 
                         person.gender === 'autre' ? 'Autre' : 'Non spécifié'} • 
                        {person.ageCategory === 'adulte' ? ' Adulte' : ' Enfant'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(person.dateEncounter).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {person.locationVisited ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-center">
            <Link 
              to="/dashboard" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Voir toutes les rencontres →
            </Link>
          </div>
        </div>
      )}

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