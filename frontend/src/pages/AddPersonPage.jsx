import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  CameraIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useGeolocation } from '../hooks/useGeolocation';
import { personService } from '../services/api';
import { createPersonFormData } from '../types';
import CameraCapture from '../components/CameraCapture';
import ConsentForm from '../components/ConsentForm';
import FileUpload from '../components/FileUpload';

const AddPersonPage = () => {
  const navigate = useNavigate();
  const { position, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();
  
  const [formData, setFormData] = useState(() => createPersonFormData({
    latitude: position?.latitude || 0,
    longitude: position?.longitude || 0,
    dateEncounter: new Date().toISOString().split('T')[0],
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);

  // Mettre à jour les coordonnées quand la position change
  React.useEffect(() => {
    if (position) {
      setFormData(prev => ({
        ...prev,
        latitude: position.latitude,
        longitude: position.longitude,
      }));
    }
  }, [position]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGetLocation = async () => {
    try {
      const newPosition = await getCurrentPosition();
      setFormData(prev => ({
        ...prev,
        latitude: newPosition.latitude,
        longitude: newPosition.longitude,
      }));
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleCameraCapture = (photoFile) => {
    setFormData(prev => ({ ...prev, photoFile }));
    setShowCamera(false);
  };

  const handleConsentSubmit = (consentData) => {
    setFormData(prev => ({
      ...prev,
      firstName: consentData.firstName,
      lastName: consentData.lastName,
      consentGiven: consentData.consentGiven,
      signature: consentData.signature,
    }));
    setShowConsentForm(false);
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({ ...prev, documentFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      return;
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      setError('La géolocalisation est obligatoire');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await personService.createPerson(formData);
      setSuccess(true);
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError('Erreur lors de l\'ajout de la personne');
      console.error('Error creating person:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      latitude: position?.latitude || 0,
      longitude: position?.longitude || 0,
      gender: 'non-specifie',
      ageCategory: 'adulte',
      dateEncounter: new Date().toISOString().split('T')[0],
      locationVisited: false,
    });
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Personne ajoutée avec succès</h3>
          <p className="mt-1 text-sm text-gray-500">
            Redirection en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-24 md:pb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter une personne</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {geoError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="text-yellow-800 text-sm">{geoError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Description de la personne *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description physique, vêtements, situation observée..."
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="gender" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-5 h-5 mr-2" />
              Genre
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="non-specifie">Non spécifié</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Catégorie d'âge */}
          <div>
            <label htmlFor="ageCategory" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-5 h-5 mr-2" />
              Catégorie d'âge
            </label>
            <select
              id="ageCategory"
              name="ageCategory"
              value={formData.ageCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="adulte">Adulte</option>
              <option value="enfant">Enfant</option>
            </select>
          </div>

          {/* Date de rencontre */}
          <div>
            <label htmlFor="dateEncounter" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Date de rencontre
            </label>
            <input
              type="date"
              id="dateEncounter"
              name="dateEncounter"
              value={formData.dateEncounter}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Géolocalisation */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Position géographique
            </label>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {geoLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    Obtention de la position...
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Obtenir ma position actuelle
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-500">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="48.8566"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-500">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Prénom (optionnel)"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom (optionnel)"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de la personne
            </label>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Prendre une photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsentForm(true)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Formulaire consentement
                </button>
              </div>
              
              {formData.photoFile && (
                <div className="text-sm text-green-600">
                  ✓ Photo sélectionnée: {formData.photoFile.name}
                </div>
              )}
              
              {formData.consentGiven && (
                <div className="text-sm text-green-600">
                  ✓ Consentement obtenu de {formData.firstName} {formData.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents (optionnel)
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes="image/*,application/pdf,.doc,.docx"
              label="Images ou documents PDF/Word acceptés"
              icon={PhotoIcon}
            />
          </div>

          {/* Lieu déjà visité */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="locationVisited"
                checked={formData.locationVisited}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Ce lieu a déjà été visité pour une distribution
              </span>
            </label>
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal caméra */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Modal formulaire de consentement */}
      {showConsentForm && (
        <ConsentForm
          onSubmit={handleConsentSubmit}
          onClose={() => setShowConsentForm(false)}
          initialData={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            consentGiven: formData.consentGiven,
            signature: formData.signature,
          }}
        />
      )}
    </div>
  );
};

export default AddPersonPage;