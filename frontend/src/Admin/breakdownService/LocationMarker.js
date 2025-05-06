import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const LocationMarker = ({ onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      // Remove any existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new marker
      const marker = L.marker([lat, lng], {
        icon: new L.Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(map);

      // Get address using reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          onLocationSelect(lat, lng, address);
        })
        .catch(error => {
          console.error('Error getting address:', error);
          onLocationSelect(lat, lng, `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        });
    }
  });

  return null;
};

export default LocationMarker;