import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
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
import styles from './AddPersonPage.module.css';

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
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#dcfce7', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <svg style={{ width: '24px', height: '24px', color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
            Personne ajoutée avec succès
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Redirection en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* En-tête */}
      <div className={styles.header}>
        <h1 className={styles.title}>Nouvelle rencontre</h1>
        <p className={styles.subtitle}>Enregistrez les informations d'une personne rencontrée</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <DocumentTextIcon className="w-4 h-4 text-gray-600 mr-2" />
              Description
            </h2>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la personne *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Apparence, vêtements, situation..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dateEncounter" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="dateEncounter"
                    name="dateEncounter"
                    value={formData.dateEncounter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="locationVisited"
                      checked={formData.locationVisited}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                    />
                    Lieu déjà visité
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Informations personnelles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <UserIcon className="w-4 h-4 text-gray-600 mr-2" />
              Informations
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="non-specifie">Non spécifié</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="ageCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Âge
                </label>
                <select
                  id="ageCategory"
                  name="ageCategory"
                  value={formData.ageCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="adulte">Adulte</option>
                  <option value="enfant">Enfant</option>
                </select>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optionnel"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Localisation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <MapPinIcon className="w-4 h-4 text-gray-600 mr-2" />
              Localisation
            </h2>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition-colors"
              >
                {geoLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Localisation...
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Obtenir ma position
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="48.8566"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Médias et documents (optionnel) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <CameraIcon className="w-4 h-4 text-gray-600 mr-2" />
              Photos et documents (optionnel)
            </h2>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:ring-1 focus:ring-blue-500"
                >
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Photo
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowConsentForm(true)}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:ring-1 focus:ring-blue-500"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Consentement
                </button>
              </div>
              
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes="image/*,application/pdf,.doc,.docx"
                label="Documents (PDF, images...)"
                icon={PhotoIcon}
              />
              
              {/* Confirmations compactes */}
              {(formData.photoFile || formData.consentGiven) && (
                <div className="space-y-1">
                  {formData.photoFile && (
                    <div className="text-xs text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Photo: {formData.photoFile.name}
                    </div>
                  )}
                  
                  {formData.consentGiven && (
                    <div className="text-xs text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Consentement: {formData.firstName} {formData.lastName}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-1 focus:ring-gray-500"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md text-sm hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                  Enregistrement...
                </span>
              ) : (
                'Enregistrer'
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