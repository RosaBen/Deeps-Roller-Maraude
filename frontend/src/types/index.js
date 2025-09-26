// Constantes pour les validations
export const GENDERS = ['homme', 'femme', 'autre', 'non-specifie'];
export const AGE_CATEGORIES = ['adulte', 'enfant'];

// Fonctions utilitaires pour valider les données
export const createPerson = (data = {}) => ({
  id: data.id || null,
  description: data.description || '',
  latitude: parseFloat(data.latitude) || 0,
  longitude: parseFloat(data.longitude) || 0,
  gender: data.gender || 'non-specifie',
  ageCategory: data.ageCategory || 'adulte',
  dateEncounter: data.dateEncounter || new Date().toISOString().split('T')[0],
  locationVisited: Boolean(data.locationVisited),
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  photoUrl: data.photoUrl || '',
  documentUrl: data.documentUrl || '',
  consentGiven: Boolean(data.consentGiven),
  signature: data.signature || '',
  createdAt: data.createdAt || '',
  updatedAt: data.updatedAt || ''
});

export const createPersonFormData = (data = {}) => ({
  description: data.description || '',
  latitude: parseFloat(data.latitude) || 0,
  longitude: parseFloat(data.longitude) || 0,
  gender: data.gender || 'non-specifie',
  ageCategory: data.ageCategory || 'adulte',
  dateEncounter: data.dateEncounter || new Date().toISOString().split('T')[0],
  locationVisited: Boolean(data.locationVisited),
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  photoFile: data.photoFile || null,
  documentFile: data.documentFile || null,
  consentGiven: Boolean(data.consentGiven),
  signature: data.signature || ''
});

export const createConsentFormData = (data = {}) => ({
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  consentGiven: Boolean(data.consentGiven),
  signature: data.signature || '',
  date: data.date || new Date().toISOString().split('T')[0]
});

export const createGeolocationPosition = (data = {}) => ({
  latitude: parseFloat(data.latitude) || 0,
  longitude: parseFloat(data.longitude) || 0
});

export const createDashboardStats = (data = {}) => ({
  totalPersons: parseInt(data.totalPersons) || 0,
  adultsCount: parseInt(data.adultsCount) || 0,
  childrenCount: parseInt(data.childrenCount) || 0,
  visitedLocations: parseInt(data.visitedLocations) || 0,
  recentEncounters: Array.isArray(data.recentEncounters) ? data.recentEncounters : []
});

// Validation helpers
export const isValidGender = (gender) => GENDERS.includes(gender);
export const isValidAgeCategory = (ageCategory) => AGE_CATEGORIES.includes(ageCategory);
export const isValidCoordinate = (lat, lng) =>
  !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;