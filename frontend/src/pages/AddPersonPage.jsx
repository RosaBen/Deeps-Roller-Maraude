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
    <div className="max-w-4xl mx-auto p-4 pb-24 md:pb-8">
      {/* En-tête moderne */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <UserIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle rencontre</h1>
        <p className="text-gray-600">Enregistrez les informations d'une personne en situation de rue</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {geoError && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
            </svg>
            <span className="text-yellow-800">{geoError}</span>
          </div>
        </div>
      )}

              <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Description principale */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Description de la rencontre</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la personne *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez la personne: apparence physique, vêtements, situation observée..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dateEncounter" className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Date de rencontre
                </label>
                <input
                  type="date"
                  id="dateEncounter"
                  name="dateEncounter"
                  value={formData.dateEncounter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <UserIcon className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="non-specifie">Non spécifié</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="ageCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie d'âge
                </label>
                <select
                  id="ageCategory"
                  name="ageCategory"
                  value={formData.ageCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="adulte">Adulte</option>
                  <option value="enfant">Enfant</option>
                </select>
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom (optionnel)
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prénom"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (optionnel)
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Localisation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MapPinIcon className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
            </div>
            
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
              >
                {geoLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Obtention de votre position...
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-5 h-5 mr-3" />
                    📍 Obtenir ma position actuelle
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-600">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="48.8566"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-600">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2.3522"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="locationVisited"
                    checked={formData.locationVisited}
                    onChange={handleInputChange}
                    className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">Lieu déjà visité</span>
                    <p className="text-xs text-gray-600 mt-1">Ce lieu a déjà été visité pour une distribution</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Médias et documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CameraIcon className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Photos et documents</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                >
                  <CameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Prendre une photo</span>
                  <span className="text-xs text-gray-500">Appareil photo</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowConsentForm(true)}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200"
                >
                  <DocumentTextIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Consentement</span>
                  <span className="text-xs text-gray-500">Formulaire légal</span>
                </button>
              </div>
              
              <div>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedTypes="image/*,application/pdf,.doc,.docx"
                  label="Ajouter des documents (PDF, images, Word...)"
                  icon={PhotoIcon}
                />
              </div>
              
              {/* Confirmations */}
              <div className="space-y-2">
                {formData.photoFile && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">Photo capturée: {formData.photoFile.name}</span>
                  </div>
                )}
                
                {formData.consentGiven && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">
                      Consentement obtenu de {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              🔄 Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Enregistrement...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  💾 Enregistrer la rencontre
                </span>
              )}
            </button>
          </div>
        </form>

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