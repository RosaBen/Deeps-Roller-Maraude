import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Icône personnalisée pour les personnes non visitées
const unvisitedIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône personnalisée pour les personnes visitées (verte)
const visitedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDBDMJV2LjU5NjQgNS41OTY0IDI1IDEyLjVTMTkuNDAzNiAyNSAxMi41IDI1UzAgMTkuNDAzNiAwIDEyLjVTNS41OTY0IDAgMTIuNSAwWiIgZmlsbD0iIzEwQjk4MSIvPgo8L3N2Zz4K',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const InteractiveMap = ({
  persons = [],
  center = [48.8566, 2.3522],
  zoom = 13,
  onMarkerClick
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGenderLabel = (gender) => {
    const labels = {
      'homme': 'Homme',
      'femme': 'Femme',
      'autre': 'Autre',
      'non-specifie': 'Non spécifié'
    };
    return labels[gender] || gender;
  };

  const getAgeCategoryLabel = (ageCategory) => {
    const labels = {
      'adulte': 'Adulte',
      'enfant': 'Enfant'
    };
    return labels[ageCategory] || ageCategory;
  };

  return (
    <div className="interactive-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {persons.map((person) => (
          <Marker
            key={person.id}
            position={[person.latitude, person.longitude]}
            icon={person.locationVisited ? visitedIcon : unvisitedIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(person),
            }}
          >
            <Popup>
              <div className="popup-content">
                <div className="popup-header">
                  <h3 className="popup-title">Personne #{person.id}</h3>
                  <span className={`popup-status ${person.locationVisited ? 'popup-status-visited' : 'popup-status-unvisited'}`}>
                    {person.locationVisited ? '✅ Visité' : '❌ Non visité'}
                  </span>
                </div>
                
                <div className="popup-details">
                  <p><strong>Description:</strong> {person.description}</p>
                  <p><strong>Genre:</strong> {getGenderLabel(person.gender)}</p>
                  <p><strong>Âge:</strong> {getAgeCategoryLabel(person.ageCategory)}</p>
                  <p><strong>Rencontré le:</strong> {formatDate(person.dateEncounter)}</p>
                  <p><strong>Position:</strong> {person.latitude.toFixed(6)}, {person.longitude.toFixed(6)}</p>
                </div>
                
                {onMarkerClick && (
                  <button
                    onClick={() => onMarkerClick(person)}
                    className="popup-button"
                  >
                    Voir les détails
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
