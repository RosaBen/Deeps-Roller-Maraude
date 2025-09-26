import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="w-6 h-6 mr-2" />
              Formulaire de consentement
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Texte de consentement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Autorisation de prise de photographie
            </h3>
            <p className="text-sm text-blue-800">
              Je soussigné(e), autorise les bénévoles de l'association à prendre des photographies 
              dans le cadre de l'aide sociale et de la distribution. Ces photos servent uniquement 
              à l'identification et au suivi des personnes aidées dans un but humanitaire.
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Ces données seront traitées de manière confidentielle et ne seront pas diffusées 
              publiquement sans autorisation explicite.
            </p>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Prénom"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Consentement */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="consentGiven"
                checked={formData.consentGiven}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Je donne mon consentement libre et éclairé pour la prise de photographie 
                dans les conditions décrites ci-dessus. *
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-600 text-xs mt-1">{errors.consent}</p>
            )}
          </div>

          {/* Zone de signature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature *
            </label>
            
            {signatureData ? (
              <div className="relative">
                <img 
                  src={signatureData} 
                  alt="Signature" 
                  className="w-full border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSignatureData('');
                    sigPad.current?.clear();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-md">
                <SignatureCanvas
                  ref={sigPad}
                  canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas w-full'
                  }}
                  backgroundColor="rgb(249, 250, 251)"
                />
                <div className="flex justify-between p-2 bg-gray-50 border-t">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Effacer
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
                  >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Valider
                  </button>
                </div>
              </div>
            )}
            
            {errors.signature && (
              <p className="text-red-600 text-xs mt-1">{errors.signature}</p>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Signez dans la zone ci-dessus avec votre doigt ou votre stylet
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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