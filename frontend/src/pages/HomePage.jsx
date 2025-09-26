import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des données...</p>
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
    <div className="home-page">
      {/* En-tête avec compteur principal */}
      <div className="welcome-section">
        <h1 className="welcome-title">Bienvenue sur Deeps Roller Maraude</h1>
        <p className="welcome-subtitle">
          Application de suivi pour l'aide aux personnes en situation de rue
        </p>
        
        <div className="main-counter">
          <div className="counter-content">
            <div>
              <p className="counter-label">Nombre total de personnes rencontrées</p>
              <p className="main-counter-number">{stats.total}</p>
            </div>
            <div className="counter-icon">👥</div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon blue-icon">👨</div>
            <div>
              <p className="stat-label">Adultes</p>
              <p className="stat-number">{stats.adults}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon yellow-icon">👶</div>
            <div>
              <p className="stat-label">Enfants</p>
              <p className="stat-number">{stats.children}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon green-icon">✅</div>
            <div>
              <p className="stat-label">Lieux visités</p>
              <p className="stat-number">{stats.visited}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon red-icon">⏰</div>
            <div>
              <p className="stat-label">À visiter</p>
              <p className="stat-number">{stats.total - stats.visited}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <Link to="/add" className="quick-action primary-action">
          <div>
            <h3>Ajouter une personne</h3>
            <p>Enregistrer une nouvelle rencontre</p>
          </div>
          <span className="action-icon">➕</span>
        </Link>

        <Link to="/map" className="quick-action secondary-action">
          <div>
            <h3>Voir la carte</h3>
            <p>Localiser toutes les personnes</p>
          </div>
          <span className="action-icon">🗺️</span>
        </Link>
      </div>

      {/* Rencontres récentes */}
      {stats.recentEncounters.length > 0 && (
        <div className="recent-encounters">
          <div className="section-header">
            <h2>Rencontres récentes</h2>
          </div>
          <div className="encounters-list">
            {stats.recentEncounters.map((person) => (
              <div key={person.id} className="encounter-item">
                <div className="encounter-content">
                  <div>
                    <p className="person-id">Personne #{person.id}</p>
                    <p className="person-description">{person.description}</p>
                    <div className="person-details">
                      <span className="person-info">
                        {person.gender === 'homme' ? 'Homme' : 
                         person.gender === 'femme' ? 'Femme' : 
                         person.gender === 'autre' ? 'Autre' : 'Non spécifié'} • 
                        {person.ageCategory === 'adulte' ? ' Adulte' : ' Enfant'}
                      </span>
                      <span className="encounter-date">
                        {new Date(person.dateEncounter).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="status-icon">
                    {person.locationVisited ? '✅' : '⏰'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/dashboard" className="view-all-link">
              Voir toutes les rencontres →
            </Link>
          </div>
        </div>
      )}

      {/* Message si aucune donnée */}
      {stats.total === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Aucune personne enregistrée</h3>
          <p>Commencez par ajouter votre première rencontre.</p>
          <Link to="/add" className="add-first-button">
            <span>➕</span>
            Ajouter une personne
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;