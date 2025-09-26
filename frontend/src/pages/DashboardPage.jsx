import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { personService } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
      return;
    }

    try {
      await personService.deletePerson(id);
      setPersons(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleVisited = async (person) => {
    try {
      await personService.updatePerson(person.id, {
        locationVisited: !person.locationVisited
      });
      
      setPersons(prev => 
        prev.map(p => 
          p.id === person.id 
            ? { ...p, locationVisited: !p.locationVisited }
            : p
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Données pour les graphiques
  const genderStats = {
    labels: ['Homme', 'Femme', 'Autre', 'Non spécifié'],
    datasets: [
      {
        data: [
          persons.filter(p => p.gender === 'homme').length,
          persons.filter(p => p.gender === 'femme').length,
          persons.filter(p => p.gender === 'autre').length,
          persons.filter(p => p.gender === 'non-specifie').length,
        ],
        backgroundColor: [
          '#3B82F6',
          '#EF4444',
          '#10B981',
          '#F59E0B',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const ageStats = {
    labels: ['Adultes', 'Enfants'],
    datasets: [
      {
        data: [
          persons.filter(p => p.ageCategory === 'adulte').length,
          persons.filter(p => p.ageCategory === 'enfant').length,
        ],
        backgroundColor: [
          '#3B82F6',
          '#F59E0B',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const visitStats = {
    labels: ['Visités', 'Non visités'],
    datasets: [
      {
        data: [
          persons.filter(p => p.locationVisited).length,
          persons.filter(p => !p.locationVisited).length,
        ],
        backgroundColor: [
          '#10B981',
          '#EF4444',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Données pour le graphique temporel (par semaine)
  const getWeeklyData = () => {
    const weeks = {};
    
    persons.forEach(person => {
      const date = new Date(person.dateEncounter);
      const week = `S${Math.ceil(date.getDate() / 7)}-${date.getMonth() + 1}`;
      weeks[week] = (weeks[week] || 0) + 1;
    });

    return {
      labels: Object.keys(weeks).sort(),
      datasets: [
        {
          label: 'Nouvelles rencontres',
          data: Object.values(weeks),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-message">{error}</div>
        <button 
          onClick={fetchPersons}
          className="dashboard-retry-btn"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* En-tête */}
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Gestion et statistiques des rencontres
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Link
            to="/add"
            className="dashboard-add-btn"
          >
            ➕ Ajouter une personne
          </Link>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par genre */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par genre</h3>
          <div className="h-64">
            <Pie data={genderStats} options={chartOptions} />
          </div>
        </div>

        {/* Répartition par âge */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par âge</h3>
          <div className="h-64">
            <Pie data={ageStats} options={chartOptions} />
          </div>
        </div>

        {/* Statut des visites */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des visites</h3>
          <div className="h-64">
            <Pie data={visitStats} options={chartOptions} />
          </div>
        </div>

        {/* Évolution temporelle */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rencontres par semaine</h3>
          <div className="h-64">
            <Bar data={getWeeklyData()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <p className="text-2xl font-bold text-primary-600">{persons.length}</p>
          <p className="text-sm text-gray-500">Total personnes</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <p className="text-2xl font-bold text-green-600">
            {persons.filter(p => p.locationVisited).length}
          </p>
          <p className="text-sm text-gray-500">Lieux visités</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <p className="text-2xl font-bold text-red-600">
            {persons.filter(p => !p.locationVisited).length}
          </p>
          <p className="text-sm text-gray-500">Lieux non visités</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {persons.filter(p => p.ageCategory === 'enfant').length}
          </p>
          <p className="text-sm text-gray-500">Enfants</p>
        </div>
      </div>

      {/* Liste des personnes */}
      <div className="bg-white shadow border rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Liste des personnes</h2>
        </div>
        
        {persons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune personne enregistrée</p>
            <Link
              to="/add"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
            >
              Ajouter la première personne
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Âge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {persons.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{person.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {person.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {person.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {person.ageCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(person.dateEncounter).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVisited(person)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          person.locationVisited
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {person.locationVisited ? (
                          <>
                            👁️ Visité
                          </>
                        ) : (
                          <>
                            🚫 Non visité
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/add?edit=${person.id}`}
                          className="dashboard-edit-btn"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(person.id)}
                          className="dashboard-delete-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;