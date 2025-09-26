import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { personService } from '../services/api';
import { createPersonFormData } from '../types';
import CameraCapture from '../components/CameraCapture';
import ConsentForm from '../components/ConsentForm';
import FileUpload from '../components/FileUpload';

const AddPersonPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = Boolean(editId);
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

  // Charger les données de la personne à éditer
  useEffect(() => {
    if (editId) {
      const loadPersonForEdit = async () => {
        try {
          setLoading(true);
          const person = await personService.getPersonById(editId);
          setFormData(createPersonFormData({
            ...person,
            photoFile: null,
            documentFile: null
          }));
        } catch (err) {
          setError('Erreur lors du chargement des données de la personne');
          console.error('Error loading person:', err);
        } finally {
          setLoading(false);
        }
      };
      loadPersonForEdit();
    }
  }, [editId]);

  // Mettre à jour les coordonnées quand la position change
  useEffect(() => {
    if (position && !isEditing) {
      setFormData(prev => ({
        ...prev,
        latitude: position.latitude,
        longitude: position.longitude,
      }));
    }
  }, [position, isEditing]);

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
    
    // Validation : seule la description et la position sont obligatoires
    if (!formData.description || formData.description.trim().length < 10) {
      setError('La description est obligatoire et doit contenir au moins 10 caractères');
      return;
    }

    if (!formData.latitude || !formData.longitude || formData.latitude === 0 || formData.longitude === 0) {
      setError('La géolocalisation est obligatoire');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await personService.updatePerson(editId, formData);
      } else {
        await personService.createPerson(formData);
      }
      setSuccess(true);
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(`Erreur lors de ${isEditing ? 'la modification' : 'l\'ajout'} de la personne : ` + (err.message || 'Erreur inconnue'));
      console.error(`Error ${isEditing ? 'updating' : 'creating'} person:`, err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(createPersonFormData({
      latitude: position?.latitude || 0,
      longitude: position?.longitude || 0,
      dateEncounter: new Date().toISOString().split('T')[0],
    }));
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="add-person-success">
        <div className="success-content">
          <div className="success-icon">
            ✅
          </div>
          <h3>Personne ajoutée avec succès</h3>
          <p>Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-person-page">
      <div className="add-person-container">
        <h1 className="page-title">
          {isEditing ? '✏️ Modifier la personne' : '➕ Ajouter une personne'}
        </h1>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {geoError && (
          <div className="warning-message">
            <span>📍 {geoError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-person-form">
          {/* Description - OBLIGATOIRE */}
          <div className="form-group">
            <label htmlFor="description" className="form-label required">
              📝 Description de la personne *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Décrivez la personne (minimum 10 caractères) : apparence, vêtements, situation observée..."
              required
            />
            <div className="form-help">
              {formData.description ? formData.description.length : 0}/10 caractères minimum
            </div>
          </div>

          {/* Géolocalisation - OBLIGATOIRE */}
          <div className="form-group">
            <label className="form-label required">
              📍 Position géographique *
            </label>
            
            <div className="location-controls">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="location-button"
              >
                {geoLoading ? (
                  <>
                    <div className="spinner"></div>
                    Obtention de la position...
                  </>
                ) : (
                  <>
                    📍 Obtenir ma position actuelle
                  </>
                )}
              </button>

              <div className="coordinates-grid">
                <div>
                  <label htmlFor="latitude" className="coordinate-label">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="form-input coordinate-input"
                    placeholder="48.8566"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="coordinate-label">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="form-input coordinate-input"
                    placeholder="2.3522"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Genre - OPTIONNEL */}
          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              👤 Genre (optionnel)
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="non-specifie">Non spécifié</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Catégorie d'âge - OPTIONNEL */}
          <div className="form-group">
            <label htmlFor="ageCategory" className="form-label">
              🎂 Catégorie d'âge (optionnel)
            </label>
            <select
              id="ageCategory"
              name="ageCategory"
              value={formData.ageCategory}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="adulte">Adulte</option>
              <option value="enfant">Enfant</option>
            </select>
          </div>

          {/* Date de rencontre */}
          <div className="form-group">
            <label htmlFor="dateEncounter" className="form-label">
              📅 Date de rencontre
            </label>
            <input
              type="date"
              id="dateEncounter"
              name="dateEncounter"
              value={formData.dateEncounter}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Informations personnelles - OPTIONNELLES */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Prénom (optionnel)
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Prénom"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Nom (optionnel)
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nom"
              />
            </div>
          </div>

          {/* Photo - OPTIONNELLE */}
          <div className="form-group">
            <label className="form-label">
              📷 Photo de la personne (optionnel)
            </label>
            <div className="photo-controls">
              <div className="button-row">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="secondary-button"
                >
                  📷 Prendre une photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsentForm(true)}
                  className="secondary-button"
                >
                  📄 Formulaire consentement
                </button>
              </div>
              
              {formData.photoFile && (
                <div className="file-status success">
                  ✓ Photo sélectionnée: {formData.photoFile.name}
                </div>
              )}
              
              {formData.consentGiven && (
                <div className="file-status success">
                  ✓ Consentement obtenu de {formData.firstName} {formData.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Documents - OPTIONNELS */}
          <div className="form-group">
            <label className="form-label">
              📎 Documents (optionnel)
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes="image/*,application/pdf,.doc,.docx"
              label="Images ou documents PDF/Word acceptés"
            />
          </div>

          {/* Lieu déjà visité - OPTIONNEL */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="locationVisited"
                checked={formData.locationVisited || false}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>📍 Ce lieu a déjà été visité pour une distribution</span>
            </label>
          </div>

          {/* Boutons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={resetForm}
              className="secondary-button"
            >
              🔄 Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="primary-button"
            >
              {loading 
                ? `⏳ ${isEditing ? 'Modification' : 'Ajout'}...` 
                : `${isEditing ? '✅ Modifier la personne' : '✅ Ajouter la personne'}`
              }
            </button>
          </div>
        </form>
      </div>

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