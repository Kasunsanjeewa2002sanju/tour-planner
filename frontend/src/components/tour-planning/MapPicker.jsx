import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../../features/tour-planning/tourUtils';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const attractionIcon = L.divIcon({
  className: 'custom-attraction-marker',
  html: `<div style="background: #f59e0b; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -7],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const location = await reverseGeocode(lat, lng);
      onSelect(location);
    },
  });
  return null;
}

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

const MapPicker = ({
  center = { lat: 7.8731, lng: 80.7718 },
  marker,
  routeCoords = [],
  attractionMarkers = [],
  onSelect,
  height = '400px',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="map-skeleton" style={{ height }} />;
  }

  return (
    <div className="map-picker-wrapper" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={8}
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={onSelect} />
        <MapCenterUpdater center={marker || center} />
        {marker?.lat && marker?.lng && (
          <Marker position={[marker.lat, marker.lng]} icon={defaultIcon} />
        )}
        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="#6366f1" weight={4} opacity={0.8} />
        )}
        {attractionMarkers.map((place, idx) => (
          <Marker 
            key={`${place.name}-${idx}`} 
            position={[place.lat, place.lng]} 
            icon={attractionIcon}
          >
            <Popup>
              <div style={{ padding: '0.25rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{place.name}</strong>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>{place.typeLabel}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
