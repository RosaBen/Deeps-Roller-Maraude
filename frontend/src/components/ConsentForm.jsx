import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const ConsentForm = ({ onSubmit, onClose, initialData = {} }) => {
  const sigPad = useRef(null);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    consentGiven: initialData.consentGiven || false,
    date: initialData.date || new Date().toISOString().split('T')[0],
  });
  const [signatureData, setSignatureData] = useState(initialData.signature || '');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearSignature = () => {
    sigPad.current.clear();
    setSignatureData('');
  };

  const saveSignature = () => {
    if (sigPad.current.isEmpty()) {
      setErrors(prev => ({ ...prev, signature: 'La signature est obligatoire' }));
      return;
    }
    
    const signature = sigPad.current.getTrimmedCanvas().toDataURL();
    setSignatureData(signature);
    setErrors(prev => ({ ...prev, signature: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }
    
    if (!formData.consentGiven) {
      newErrors.consent = 'Le consentement doit être donné';
    }
    
    if (!signatureData && sigPad.current && sigPad.current.isEmpty()) {
      newErrors.signature = 'La signature est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Sauvegarder la signature si elle n'est pas encore sauvegardée
    let finalSignature = signatureData;
    if (!finalSignature && sigPad.current && !sigPad.current.isEmpty()) {
      finalSignature = sigPad.current.getTrimmedCanvas().toDataURL();
    }
    
    const consentData = {
      ...formData,
      signature: finalSignature
    };
    
    onSubmit(consentData);
  };

  return (
    <div className="consent-modal-overlay">
      <div className="consent-modal">
        <div className="consent-header">
          <div className="consent-header-content">
            <h2 className="consent-title">
              <span className="consent-icon">📋</span>
              Formulaire de consentement
            </h2>
            <button
              onClick={onClose}
              className="close-btn"
            >
              ❌
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="consent-form">
          {/* Texte de consentement */}
          <div className="consent-text-box">
            <h3 className="consent-text-title">
              Autorisation de prise de photographie
            </h3>
            <p className="consent-text">
              Je soussigné(e), autorise les bénévoles de l'association à prendre des photographies 
              dans le cadre de l'aide sociale et de la distribution. Ces photos servent uniquement 
              à l'identification et au suivi des personnes aidées dans un but humanitaire.
            </p>
            <p className="consent-text">
              Ces données seront traitées de manière confidentielle et ne seront pas diffusées 
              publiquement sans autorisation explicite.
            </p>
          </div>

          {/* Informations personnelles */}
          <div className="form-fields-grid">
            <div className="form-field">
              <label htmlFor="firstName" className="form-label">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                placeholder="Prénom"
              />
              {errors.firstName && (
                <p className="error-text">{errors.firstName}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-label">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                placeholder="Nom"
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="form-field">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Consentement */}
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="consentGiven"
                checked={formData.consentGiven}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="checkbox-text">
                Je donne mon consentement libre et éclairé pour la prise de photographie 
                dans les conditions décrites ci-dessus. *
              </span>
            </label>
            {errors.consent && (
              <p className="error-text">{errors.consent}</p>
            )}
          </div>

          {/* Zone de signature */}
          <div className="form-field">
            <label className="form-label">
              Signature *
            </label>
            
            {signatureData ? (
              <div className="signature-display">
                <img 
                  src={signatureData} 
                  alt="Signature" 
                  className="signature-image"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSignatureData('');
                    sigPad.current?.clear();
                  }}
                  className="signature-clear-btn"
                >
                  ❌
                </button>
              </div>
            ) : (
              <div className="signature-container">
                <SignatureCanvas
                  ref={sigPad}
                  canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas'
                  }}
                  backgroundColor="rgb(249, 250, 251)"
                />
                <div className="signature-controls">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="signature-action-btn"
                  >
                    🗑️ Effacer
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    className="signature-action-btn signature-save-btn"
                  >
                    ✅ Valider
                  </button>
                </div>
              </div>
            )}
            
            {errors.signature && (
              <p className="error-text">{errors.signature}</p>
            )}
            
            <p className="signature-help">
              Signez dans la zone ci-dessus avec votre doigt ou votre stylet
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="form-btn form-btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="form-btn form-btn-primary"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsentForm;