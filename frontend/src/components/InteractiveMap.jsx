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

// Icône personnalisée pour les personnes déjà visitées
const visitedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMxMEI5ODEiLz4KPGV0aGQgZD0iTTEyLjUgNDFMMCA0MUwxMi41IDI1TDI1IDQxSDE2LjVIMTIuNVoiIGZpbGw9IiMxMEI5ODEiLz4KPHN2ZyBjbGFzcz0idy02IGgtNiB0ZXh0LXdoaXRlIiBmaWxsPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0xNi43MDcgNS4yOTMgYSAxIDEgMCAwIDEgMCAxLjQxNGwtOCA4YTEgMSAwIDAgMS0xLjQxNCAwbC00LTRhMSAxIDAgMSAxIDEuNDE0LTEuNDE0TDggMTIuNTg2bDcuMjkzLTcuMjkzYTEgMSAwIDAgMSAxLjQxNCAweiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPgo8L3N2Zz4KPC9zdmc+',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const InteractiveMap = ({
  persons,
  onMarkerClick,
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 12,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    return ageCategory === 'adulte' ? 'Adulte' : 'Enfant';
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
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
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Personne #{person.id}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.locationVisited
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {person.locationVisited ? 'Visitée' : 'Non visitée'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p><strong>Description:</strong> {person.description}</p>
                  <p><strong>Genre:</strong> {getGenderLabel(person.gender)}</p>
                  <p><strong>Âge:</strong> {getAgeCategoryLabel(person.ageCategory)}</p>
                  <p><strong>Rencontré le:</strong> {formatDate(person.dateEncounter)}</p>
                  <p><strong>Position:</strong> {person.latitude.toFixed(6)}, {person.longitude.toFixed(6)}</p>
                </div>
                
                {onMarkerClick && (
                  <button
                    onClick={() => onMarkerClick(person)}
                    className="mt-2 w-full bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition-colors"
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