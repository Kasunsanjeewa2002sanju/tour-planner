import React, { useEffect, useState } from 'react';
import {
  Camera,
  Eye,
  Home,
  Loader2,
  MapPin,
  Route,
  Waves,
  Droplets,
  Utensils,
  Landmark as LandmarkIcon,
  Castle,
} from 'lucide-react';
import { fetchRouteAttractions } from '../../utils/attractionsUtils';

const TYPE_ICONS = {
  viewpoint: Eye,
  photo_spot: Camera,
  waterfall: Droplets,
  lake: Waves,
  river: Waves,
  bungalow: Home,
  landmark: LandmarkIcon,
  cultural: Castle,
  food: Utensils,
};

const RouteAttractionsPanel = ({ places = [], loading = false, loadingRoute = false }) => {
  const error = null;

  return (
    <div className="route-attractions-panel">
      <div className="route-attractions-header">
        <Route size={20} className="route-attractions-header-icon" />
        <div>
          <h3>Places On Your Route</h3>
          <p>Viewpoints, photo spots, waterfalls, lakes, rivers & bungalows along the way</p>
        </div>
      </div>

      {loadingRoute || loading ? (
        <div className="route-attractions-loading">
          <Loader2 size={20} className="spin" />
          <span>Finding places along your route...</span>
        </div>
      ) : error ? (
        <p className="route-attractions-muted">{error}</p>
      ) : places.length > 0 ? (
        <ul className="route-attractions-list">
          {places.map((place) => {
            const Icon = TYPE_ICONS[place.type] || MapPin;
            return (
              <li key={`${place.name}-${place.routeKm}-${place.source}`} className={`route-attraction-item type-${place.type}`}>
                <div className="route-attraction-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="route-attraction-details">
                  <div className="route-attraction-top">
                    <span className="route-attraction-name">{place.name}</span>
                    <span className="route-attraction-type">{place.typeLabel}</span>
                  </div>
                  {place.location && (
                    <span className="route-attraction-location">{place.location}</span>
                  )}
                  <span className="route-attraction-distance">
                    ~{place.routeKm} km from start · {place.offRouteKm} km off route
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="route-attractions-muted">No matching places found along this route</p>
      )}
    </div>
  );
};

export default RouteAttractionsPanel;
