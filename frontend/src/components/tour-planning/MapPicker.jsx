import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline } from 'react-leaflet';
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
      </MapContainer>
    </div>
  );
};

export default MapPicker;
