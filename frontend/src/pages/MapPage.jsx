import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import InteractiveMap from '../components/InteractiveMap';
import { personService } from '../services/api';

const MapPage = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [filters, setFilters] = useState({
    showVisited: true,
    showUnvisited: true,
    gender: 'all',
    ageCategory: 'all',
  });

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

  const applyFilters = React.useCallback(() => {
    let filtered = persons;

    // Filtre par statut de visite
    if (!filters.showVisited) {
      filtered = filtered.filter(p => !p.locationVisited);
    }
    if (!filters.showUnvisited) {
      filtered = filtered.filter(p => p.locationVisited);
    }

    // Filtre par genre
    if (filters.gender !== 'all') {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }

    // Filtre par catégorie d'âge
    if (filters.ageCategory !== 'all') {
      filtered = filtered.filter(p => p.ageCategory === filters.ageCategory);
    }

    setFilteredPersons(filtered);
  }, [persons, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleMarkerClick = (person) => {
    setSelectedPerson(person);
  };

  const closePersonDetail = () => {
    setSelectedPerson(null);
  };

  const toggleLocationVisited = async (person) => {
    try {
      await personService.updatePerson(person.id, {
        locationVisited: !person.locationVisited
      });
      
      // Mettre à jour localement
      setPersons(prev => 
        prev.map(p => 
          p.id === person.id 
            ? { ...p, locationVisited: !p.locationVisited }
            : p
        )
      );
      
      if (selectedPerson && selectedPerson.id === person.id) {
        setSelectedPerson(prev => prev ? { ...prev, locationVisited: !prev.locationVisited } : null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
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
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carte des rencontres</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredPersons.length} personne{filteredPersons.length !== 1 ? 's' : ''} affichée{filteredPersons.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter une personne
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center mb-4">
          <FunnelIcon className="w-5 h-5 mr-2 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Statut de visite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut de visite
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showVisited}
                  onChange={(e) => handleFilterChange('showVisited', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Lieux visités</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showUnvisited}
                  onChange={(e) => handleFilterChange('showUnvisited', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Lieux non visités</span>
              </label>
            </div>
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="gender-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              id="gender-filter"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tous les genres</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
              <option value="non-specifie">Non spécifié</option>
            </select>
          </div>

          {/* Catégorie d'âge */}
          <div>
            <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie d'âge
            </label>
            <select
              id="age-filter"
              value={filters.ageCategory}
              onChange={(e) => handleFilterChange('ageCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="adulte">Adulte</option>
              <option value="enfant">Enfant</option>
            </select>
          </div>

          {/* Statistiques rapides */}
          <div className="flex flex-col justify-end">
            <div className="text-sm text-gray-600">
              <div>Total: {persons.length}</div>
              <div>Visités: {persons.filter(p => p.locationVisited).length}</div>
              <div>Non visités: {persons.filter(p => !p.locationVisited).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-lg shadow border p-4">
        <InteractiveMap
          persons={filteredPersons}
          onMarkerClick={handleMarkerClick}
          center={[48.8566, 2.3522]} // Paris
          zoom={12}
        />
      </div>

      {/* Détail de la personne sélectionnée */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personne #{selectedPerson.id}
                </h3>
                <button
                  onClick={closePersonDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{selectedPerson.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Genre</label>
                    <p className="text-gray-900 capitalize">{selectedPerson.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Âge</label>
                    <p className="text-gray-900 capitalize">{selectedPerson.ageCategory}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Date de rencontre</label>
                  <p className="text-gray-900">
                    {new Date(selectedPerson.dateEncounter).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="text-gray-900 text-sm">
                    {selectedPerson.latitude.toFixed(6)}, {selectedPerson.longitude.toFixed(6)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Lieu visité</span>
                  <button
                    onClick={() => toggleLocationVisited(selectedPerson)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPerson.locationVisited
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedPerson.locationVisited ? (
                      <>
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Visité
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="w-4 h-4 mr-1" />
                        Non visité
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closePersonDetail}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
                <Link
                  to={`/dashboard`}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center"
                >
                  Voir détails
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;