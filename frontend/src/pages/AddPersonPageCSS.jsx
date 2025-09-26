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
        <p className={styles.subtitle}>Informations sur une personne rencontrée</p>
      </div>

      {/* Alertes */}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <svg className={styles.alertIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {geoError && (
        <div className={`${styles.alert} ${styles.alertWarning}`}>
          <svg className={styles.alertIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
          </svg>
          <span>{geoError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Section Description */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <DocumentTextIcon className={styles.sectionIcon} />
            Description
          </h2>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Description de la personne *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Apparence, vêtements, situation..."
                required
              />
            </div>
            <div className={styles.gridTwo}>
              <div className={styles.field}>
                <label className={styles.label}>Date de rencontre</label>
                <input
                  type="date"
                  name="dateEncounter"
                  value={formData.dateEncounter}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="locationVisited"
                  checked={formData.locationVisited}
                  onChange={handleInputChange}
                  className={styles.checkboxInput}
                />
                <span>Lieu déjà visité</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Informations */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <UserIcon className={styles.sectionIcon} />
            Informations
          </h2>
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label className={styles.label}>Genre</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="non-specifie">Non spécifié</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Âge</label>
              <select
                name="ageCategory"
                value={formData.ageCategory}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="adulte">Adulte</option>
                <option value="enfant">Enfant</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optionnel"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optionnel"
              />
            </div>
          </div>
        </div>

        {/* Section Localisation */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <MapPinIcon className={styles.sectionIcon} />
            Localisation
          </h2>
          <div className={styles.fieldGroup}>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={geoLoading}
              className={styles.locationButton}
            >
              {geoLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  Localisation...
                </>
              ) : (
                <>
                  <MapPinIcon className={styles.locationIcon} />
                  Obtenir ma position
                </>
              )}
            </button>
            <div className={styles.coordsGrid}>
              <div className={styles.coordField}>
                <label className={styles.coordLabel}>Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  step="any"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className={styles.coordInput}
                  placeholder="48.8566"
                />
              </div>
              <div className={styles.coordField}>
                <label className={styles.coordLabel}>Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  step="any"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className={styles.coordInput}
                  placeholder="2.3522"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Médias (optionnel) */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <CameraIcon className={styles.sectionIcon} />
            Photos et documents (optionnel)
          </h2>
          <div className={styles.fieldGroup}>
            <div className={styles.mediaButtons}>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className={styles.mediaButton}
              >
                <CameraIcon className={styles.mediaIcon} />
                Photo
              </button>
              <button
                type="button"
                onClick={() => setShowConsentForm(true)}
                className={styles.mediaButton}
              >
                <DocumentTextIcon className={styles.mediaIcon} />
                Consentement
              </button>
            </div>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes="image/*,application/pdf,.doc,.docx"
              label="Documents (PDF, images...)"
              icon={PhotoIcon}
            />

            {/* Confirmations */}
            {(formData.photoFile || formData.consentGiven) && (
              <div className={styles.fieldGroup}>
                {formData.photoFile && (
                  <div className={styles.confirmation}>
                    <div className={styles.confirmationDot}></div>
                    Photo: {formData.photoFile.name}
                  </div>
                )}
                {formData.consentGiven && (
                  <div className={styles.confirmation}>
                    <div className={styles.confirmationDot}></div>
                    Consentement: {formData.firstName} {formData.lastName}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={resetForm}
            className={styles.resetButton}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>

      {/* Modals */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

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