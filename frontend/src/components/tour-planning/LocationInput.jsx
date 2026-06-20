import React from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

const LocationInput = ({
  label,
  value,
  onChange,
  onSelectOnMap,
  onUseCurrentLocation,
  loadingGeo = false,
  placeholder = 'Enter address or coordinates (lat, lng)',
}) => {
  return (
    <div className="location-input-group">
      <label className="location-label">{label}</label>
      <div className="location-input-row">
        <div className="location-input-wrap">
          <MapPin size={18} className="location-input-icon" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="location-text-input"
          />
        </div>
        <button type="button" className="btn-map-select" onClick={onSelectOnMap}>
          Select on Map
        </button>
      </div>
      {onUseCurrentLocation && (
        <button
          type="button"
          className="btn-use-location"
          onClick={onUseCurrentLocation}
          disabled={loadingGeo}
        >
          {loadingGeo ? (
            <Loader2 size={16} className="spin" />
          ) : (
            <Navigation size={16} />
          )}
          Use Current Location
        </button>
      )}
    </div>
  );
};

export default LocationInput;
