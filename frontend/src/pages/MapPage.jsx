import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchPersons} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="map-page">
      {/* En-tête */}
      <div className="page-header">
        <div className="header-content">
          <h1>Carte des rencontres</h1>
          <p className="subtitle">
            {filteredPersons.length} personne{filteredPersons.length !== 1 ? 's' : ''} affichée{filteredPersons.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add" className="add-button">
            <span className="button-icon">➕</span>
            Ajouter une personne
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-container">
        <div className="filters-header">
          <span className="filter-icon">🔍</span>
          <h3>Filtres</h3>
        </div>
        
        <div className="filters-grid">
          {/* Statut de visite */}
          <div className="filter-group">
            <label className="filter-label">
              Statut de visite
            </label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.showVisited}
                  onChange={(e) => handleFilterChange('showVisited', e.target.checked)}
                />
                <span>Lieux visités</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.showUnvisited}
                  onChange={(e) => handleFilterChange('showUnvisited', e.target.checked)}
                />
                <span>Lieux non visités</span>
              </label>
            </div>
          </div>

          {/* Genre */}
          <div className="filter-group">
            <label htmlFor="gender-filter" className="filter-label">
              Genre
            </label>
            <select
              id="gender-filter"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les genres</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
              <option value="non-specifie">Non spécifié</option>
            </select>
          </div>

          {/* Catégorie d'âge */}
          <div className="filter-group">
            <label htmlFor="age-filter" className="filter-label">
              Catégorie d'âge
            </label>
            <select
              id="age-filter"
              value={filters.ageCategory}
              onChange={(e) => handleFilterChange('ageCategory', e.target.value)}
              className="filter-select"
            >
              <option value="all">Toutes les catégories</option>
              <option value="adulte">Adulte</option>
              <option value="enfant">Enfant</option>
            </select>
          </div>

          {/* Statistiques rapides */}
          <div className="stats-summary">
            <div className="stats-title">Résumé</div>
            <div className="stats-item">Total: {persons.length}</div>
            <div className="stats-item">Visités: {persons.filter(p => p.locationVisited).length}</div>
            <div className="stats-item">Non visités: {persons.filter(p => !p.locationVisited).length}</div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="map-container">
        <InteractiveMap
          persons={filteredPersons}
          onMarkerClick={handleMarkerClick}
          center={[48.8566, 2.3522]} // Paris
          zoom={12}
        />
      </div>

      {/* Détail de la personne sélectionnée */}
      {selectedPerson && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Personne #{selectedPerson.id}</h3>
              <button onClick={closePersonDetail} className="close-button">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-item">
                <label>Description</label>
                <p>{selectedPerson.description}</p>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Genre</label>
                  <p className="capitalize">{selectedPerson.gender}</p>
                </div>
                <div className="detail-item">
                  <label>Âge</label>
                  <p className="capitalize">{selectedPerson.ageCategory}</p>
                </div>
              </div>

              <div className="detail-item">
                <label>Date de rencontre</label>
                <p>
                  {new Date(selectedPerson.dateEncounter).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="detail-item">
                <label>Position</label>
                <p className="position-text">
                  {selectedPerson.latitude && !isNaN(selectedPerson.latitude) ? 
                    Number(selectedPerson.latitude).toFixed(6) : 'N/A'}, {selectedPerson.longitude && !isNaN(selectedPerson.longitude) ? 
                    Number(selectedPerson.longitude).toFixed(6) : 'N/A'}
                </p>
              </div>

              <div className="status-item">
                <span>Lieu visité</span>
                <button
                  onClick={() => toggleLocationVisited(selectedPerson)}
                  className={`status-button ${
                    selectedPerson.locationVisited ? 'visited' : 'not-visited'
                  }`}
                >
                  <span className="status-icon">
                    {selectedPerson.locationVisited ? '👁️' : '👁️‍🗨️'}
                  </span>
                  {selectedPerson.locationVisited ? 'Visité' : 'Non visité'}
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closePersonDetail} className="cancel-button">
                Fermer
              </button>
              <Link to="/dashboard" className="primary-button">
                Voir détails
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;