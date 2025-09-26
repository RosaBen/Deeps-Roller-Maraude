import { useState, useEffect } from 'react';
import { createGeolocationPosition } from '../types';

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'La géolocalisation n\'est pas supportée par ce navigateur.';
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = createGeolocationPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setPosition(coords);
          setLoading(false);
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Erreur inconnue lors de la géolocalisation.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'L\'utilisateur a refusé la demande de géolocalisation.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Les informations de localisation ne sont pas disponibles.';
              break;
            case error.TIMEOUT:
              errorMessage = 'La demande de géolocalisation a expiré.';
              break;
            default:
              errorMessage = 'Erreur inconnue lors de la géolocalisation.';
              break;
          }

          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  };

  useEffect(() => {
    // Obtenir la position initiale au chargement du composant
    getCurrentPosition().catch(() => {
      // Erreur déjà gérée dans getCurrentPosition
    });
  }, []);

  return { position, error, loading, getCurrentPosition };
};