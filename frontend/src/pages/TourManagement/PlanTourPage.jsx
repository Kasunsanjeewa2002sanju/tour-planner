import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Settings } from 'lucide-react';
import { fetchPreferences } from '../../features/users/userSlice';
import { fetchFuelPrices } from '../../features/tour-planning/fuelSlice';
import LocationInput from '../../components/tour-planning/LocationInput';
import MapPicker from '../../components/tour-planning/MapPicker';
import CostDashboard from '../../components/tour-planning/CostDashboard';
import {
  VEHICLE_DEFAULTS,
  isVehicleSetupComplete,
  calculateTripCost,
  geocodeAddress,
  reverseGeocode,
  fetchRouteDistance,
  parseCoordinates,
} from '../../features/tour-planning/tourUtils';
import api from '../../api/api';

const PlanTourPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get('destination');

  const { preferences } = useSelector((state) => state.user);
  const { prices: fuelPrices } = useSelector((state) => state.fuel);

  const [currentText, setCurrentText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mapMode, setMapMode] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState('Car');
  const [fuelEfficiency, setFuelEfficiency] = useState(12);
  const [fuelType, setFuelType] = useState('Petrol');
  const [efficiencyOverride, setEfficiencyOverride] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [costResult, setCostResult] = useState(null);

  const vehicleReady = isVehicleSetupComplete(preferences);
  const distanceUnit = preferences?.preferred_distance_unit || 'km';

  useEffect(() => {
    dispatch(fetchPreferences());
    dispatch(fetchFuelPrices());
  }, [dispatch]);

  useEffect(() => {
    if (preferences?.vehicle_type && preferences?.fuel_efficiency && preferences?.fuel_type) {
      setVehicleType(preferences.vehicle_type);
      setFuelEfficiency(preferences.fuel_efficiency);
      setFuelType(preferences.fuel_type);
    }
  }, [preferences]);

  useEffect(() => {
    if (currentLocation?.address) setCurrentText(currentLocation.address);
  }, [currentLocation?.address]);

  useEffect(() => {
    if (destination?.address) setDestinationText(destination.address);
  }, [destination?.address]);

  useEffect(() => {
    if (!destinationId) return;

    const loadDestination = async () => {
      setDestinationLoading(true);
      try {
        const response = await api.get(`/destinations/${destinationId}`);
        const dest = response.data;
        const coords = dest.coordinates;
        if (coords?.lat && coords?.lng && coords.lat !== 0 && coords.lng !== 0) {
          const destLocation = {
            lat: coords.lat,
            lng: coords.lng,
            address: `${dest.name}, ${dest.location}`,
          };
          setDestination(destLocation);
          setDestinationText(destLocation.address);
        } else {
          const geocoded = await geocodeAddress(`${dest.name}, ${dest.location}`);
          const destLocation = geocoded || { address: `${dest.name}, ${dest.location}` };
          setDestination(destLocation);
          setDestinationText(destLocation.address || `${dest.name}, ${dest.location}`);
        }
      } catch {
        setDestination(null);
      } finally {
        setDestinationLoading(false);
      }
    };

    loadDestination();
  }, [destinationId]);

  useEffect(() => {
    if (preferences?.default_start_location?.lat && !currentLocation) {
      setCurrentLocation(preferences.default_start_location);
      setCurrentText(preferences.default_start_location.address || '');
    }
  }, [preferences, currentLocation]);

  useEffect(() => {
    if (!currentText.trim()) {
      setCurrentLocation(null);
      return;
    }
    const timer = setTimeout(async () => {
      const coords = parseCoordinates(currentText);
      const resolved = coords || await geocodeAddress(currentText);
      if (resolved) setCurrentLocation(resolved);
    }, 700);
    return () => clearTimeout(timer);
  }, [currentText]);

  useEffect(() => {
    if (!destinationText.trim()) {
      setDestination(null);
      return;
    }
    const timer = setTimeout(async () => {
      const coords = parseCoordinates(destinationText);
      const resolved = coords || await geocodeAddress(destinationText);
      if (resolved) setDestination(resolved);
    }, 700);
    return () => clearTimeout(timer);
  }, [destinationText]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setCurrentLocation(location);
        setCurrentText(location.address);
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true }
    );
  };

  const handleVehicleChange = (type) => {
    setVehicleType(type);
    const defaults = VEHICLE_DEFAULTS[type];
    if (defaults) {
      setFuelEfficiency(defaults.fuel_efficiency);
      setFuelType(defaults.fuel_type);
      setEfficiencyOverride(false);
    }
  };

  useEffect(() => {
    if (!currentLocation?.lat || !destination?.lat) {
      setDistance(null);
      setRouteCoords([]);
      setCostResult(null);
      return;
    }

    const calculateDistance = async () => {
      setDistanceLoading(true);
      try {
        const result = await fetchRouteDistance(currentLocation, destination);
        setDistance(result);

        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${currentLocation.lng},${currentLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        const routeRes = await fetch(routeUrl);
        const routeData = await routeRes.json();
        if (routeData.routes?.[0]?.geometry?.coordinates) {
          setRouteCoords(routeData.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        }
      } catch {
        setDistance(null);
        setRouteCoords([]);
      } finally {
        setDistanceLoading(false);
      }
    };

    const timer = setTimeout(calculateDistance, 500);
    return () => clearTimeout(timer);
  }, [currentLocation, destination]);

  useEffect(() => {
    if (!distance?.distanceKm || !fuelEfficiency || !fuelType || !fuelPrices) {
      setCostResult(null);
      return;
    }
    setCostResult(calculateTripCost(distance.distanceKm, fuelEfficiency, fuelType, fuelPrices));
  }, [distance, fuelEfficiency, fuelType, fuelPrices]);

  const handleMapSelect = (location) => {
    if (mapMode === 'current') {
      setCurrentLocation(location);
      setCurrentText(location.address);
    }
    if (mapMode === 'destination') {
      setDestination(location);
      setDestinationText(location.address);
    }
    setMapMode(null);
  };

  const mapCenter = mapMode === 'destination' && destination?.lat
    ? destination
    : currentLocation?.lat
      ? currentLocation
      : { lat: 7.8731, lng: 80.7718 };

  if (!vehicleReady) {
    return (
      <div className="plan-tour-page plan-tour-page-in-layout">
        <div className="plan-tour-container">
          <div className="vehicle-prompt glass-card">
            <AlertCircle size={48} color="#f59e0b" />
            <h2>Complete Your Vehicle Profile</h2>
            <p>
              Before planning a trip, please set up your vehicle type, fuel efficiency, and fuel type in your profile.
            </p>
            <Link to="/profile" className="btn-primary plan-profile-link">
              <Settings size={18} /> Go to Profile Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-tour-page plan-tour-page-in-layout">
      <div className="plan-tour-container">
        <header className="plan-tour-header">
          <h1>Plan Your Tour</h1>
          <p>Calculate route distance and estimated fuel costs for your journey.</p>
        </header>

        <div className="plan-tour-layout">
          <motion.section
            className="plan-input-panel glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Route Details</h2>

            <LocationInput
              label="Current Location"
              value={currentText}
              onChange={setCurrentText}
              onSelectOnMap={() => setMapMode('current')}
              onUseCurrentLocation={handleUseCurrentLocation}
              loadingGeo={geoLoading}
            />

            <LocationInput
              label="Destination / Want to Go"
              value={destinationText}
              onChange={setDestinationText}
              onSelectOnMap={() => setMapMode('destination')}
              placeholder={destinationLoading ? 'Loading destination...' : 'Enter destination address'}
            />

            {mapMode && (
              <div className="map-mode-panel">
                <div className="map-mode-header">
                  <span>Click on the map to select {mapMode === 'current' ? 'start' : 'destination'} point</span>
                  <button type="button" onClick={() => setMapMode(null)}>Done</button>
                </div>
                <MapPicker
                  center={mapCenter}
                  marker={mapMode === 'current' ? currentLocation : destination}
                  routeCoords={routeCoords}
                  onSelect={handleMapSelect}
                />
              </div>
            )}

            <div className="vehicle-override-section">
              <h3>Vehicle Settings</h3>
              <div className="vehicle-override-grid">
                <div>
                  <label>Fuel Efficiency (km/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={fuelEfficiency}
                    onChange={(e) => {
                      setEfficiencyOverride(true);
                      setFuelEfficiency(parseFloat(e.target.value) || 0);
                    }}
                  />
                </div>
                <div>
                  <label>Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="plan-summary-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {distanceLoading ? (
              <div className="distance-banner distance-loading">
                <div className="skeleton-line skeleton-distance" />
                <p>Calculating route distance...</p>
              </div>
            ) : distance ? (
              <div className="distance-banner">
                <span className="distance-label">Total Travel Distance</span>
                <strong className="distance-value">
                  {distanceUnit === 'miles' ? distance.distanceMiles : distance.distanceKm}
                  {' '}{distanceUnit === 'miles' ? 'miles' : 'km'}
                </strong>
              </div>
            ) : null}

            <CostDashboard
              distance={distance}
              distanceUnit={distanceUnit}
              vehicleType={vehicleType}
              onVehicleChange={handleVehicleChange}
              fuelRequired={costResult?.fuelRequired}
              totalCost={costResult?.totalCost}
              currency={costResult?.currency}
              fuelType={fuelType}
              loading={distanceLoading}
            />

            {!mapMode && currentLocation?.lat && destination?.lat && (
              <div className="route-map-preview">
                <h3>Route Preview</h3>
                <MapPicker
                  center={mapCenter}
                  marker={destination}
                  routeCoords={routeCoords}
                  onSelect={() => {}}
                  height="280px"
                />
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PlanTourPage;
