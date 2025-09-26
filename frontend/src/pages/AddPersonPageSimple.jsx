import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { personService } from '../services/api';
import { createPersonFormData } from '../types';
import CameraCapture from '../components/CameraCapture';
import ConsentForm from '../components/ConsentForm';
import FileUpload from '../components/FileUpload';

// Icônes inline SVG pour contrôler la taille
const DocumentIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MapIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CameraIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

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
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', textAlign: 'center', marginTop: '40px' }}>
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
    );
  }

  const containerStyle = {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '16px',
    paddingBottom: '100px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '24px'
  };

  const sectionStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '12px'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    flex: 1
  };

  return (
    <div style={containerStyle}>
      {/* En-tête */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
          Nouvelle rencontre
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Informations sur une personne rencontrée
        </p>
      </div>

      {/* Alertes */}
      {error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px', 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          border: '1px solid #fecaca',
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '14px' 
        }}>
          <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section Description */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>
            <DocumentIcon />
            Description
          </h2>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Description de la personne *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Apparence, vêtements, situation..."
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Date de rencontre
              </label>
              <input
                type="date"
                name="dateEncounter"
                value={formData.dateEncounter}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <input
                type="checkbox"
                name="locationVisited"
                checked={formData.locationVisited}
                onChange={handleInputChange}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Lieu déjà visité</span>
            </div>
          </div>
        </div>

        {/* Section Informations */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>
            <UserIcon />
            Informations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Genre
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="non-specifie">Non spécifié</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Âge
              </label>
              <select
                name="ageCategory"
                value={formData.ageCategory}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="adulte">Adulte</option>
                <option value="enfant">Enfant</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Optionnel"
              />
            </div>
          </div>
        </div>

        {/* Section Localisation */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>
            <MapIcon />
            Localisation
          </h2>
          <div style={{ marginBottom: '12px' }}>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={geoLoading}
              style={{
                ...buttonStyle,
                background: '#3b82f6',
                color: 'white',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {geoLoading ? (
                <>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Localisation...
                </>
              ) : (
                <>
                  <MapIcon />
                  Obtenir ma position
                </>
              )}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
                style={{ ...inputStyle, fontSize: '12px', padding: '6px 8px' }}
                placeholder="48.8566"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
                style={{ ...inputStyle, fontSize: '12px', padding: '6px 8px' }}
                placeholder="2.3522"
              />
            </div>
          </div>
        </div>

        {/* Section Médias */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>
            <CameraIcon />
            Photos et documents (optionnel)
          </h2>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              style={{
                ...buttonStyle,
                background: '#f9fafb',
                color: '#374151',
                border: '1px solid #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CameraIcon />
              Photo
            </button>
            <button
              type="button"
              onClick={() => setShowConsentForm(true)}
              style={{
                ...buttonStyle,
                background: '#f9fafb',
                color: '#374151',
                border: '1px solid #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <DocumentIcon />
              Consentement
            </button>
          </div>
          
          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedTypes="image/*,application/pdf,.doc,.docx"
            label="Documents (PDF, images...)"
          />

          {/* Confirmations */}
          {(formData.photoFile || formData.consentGiven) && (
            <div style={{ marginTop: '12px' }}>
              {formData.photoFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#059669', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#059669', borderRadius: '50%' }}></div>
                  Photo: {formData.photoFile.name}
                </div>
              )}
              {formData.consentGiven && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#059669' }}>
                  <div style={{ width: '6px', height: '6px', background: '#059669', borderRadius: '50%' }}></div>
                  Consentement: {formData.firstName} {formData.lastName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button
            type="button"
            onClick={resetForm}
            style={{
              ...buttonStyle,
              background: '#ffffff',
              color: '#6b7280',
              border: '1px solid #d1d5db'
            }}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
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

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AddPersonPage;