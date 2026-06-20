import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Settings } from 'lucide-react';
import { fetchPreferences } from '../../features/users/userSlice';
import { fetchFuelPrices } from '../../features/tour-planning/fuelSlice';
import { fetchDestinations } from '../../features/destination-management/destinationSlice';
import LocationInput from '../../components/tour-planning/LocationInput';
import LocationWeatherCard from '../../components/tour-planning/LocationWeatherCard';
import RouteAttractionsPanel from '../../components/tour-planning/RouteAttractionsPanel';
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
  const { items: destinations } = useSelector((state) => state.destinations);

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
  const [routePlaces, setRoutePlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  const vehicleReady = isVehicleSetupComplete(preferences);
  const distanceUnit = preferences?.preferred_distance_unit || 'km';

  useEffect(() => {
    dispatch(fetchPreferences());
    dispatch(fetchFuelPrices());
    dispatch(fetchDestinations());
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
          const coords = routeData.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRouteCoords(coords);
          
          // Fetch route attractions here
          setPlacesLoading(true);
          try {
            const { fetchRouteAttractions } = await import('../../utils/attractionsUtils');
            const places = await fetchRouteAttractions(coords, destinations);
            setRoutePlaces(places);
          } catch (err) {
            console.error('Failed to fetch attractions:', err);
            setRoutePlaces([]);
          } finally {
            setPlacesLoading(false);
          }
        }
      } catch {
        setDistance(null);
        setRouteCoords([]);
        setRoutePlaces([]);
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

  const effectiveRouteCoords = routeCoords.length >= 2
    ? routeCoords
    : currentLocation?.lat && destination?.lat
      ? [
          [currentLocation.lat, currentLocation.lng],
          [destination.lat, destination.lng],
        ]
      : [];

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

        <div className="plan-tour-layout-container">
          <motion.section
            className="plan-input-panel glass-card wide-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Route Details</h2>
            <div className="plan-route-grid">
              <div className="plan-route-column">
                <LocationInput
                  label="Current Location"
                  value={currentText}
                  onChange={setCurrentText}
                  onSelectOnMap={() => setMapMode('current')}
                  onUseCurrentLocation={handleUseCurrentLocation}
                  loadingGeo={geoLoading}
                />
                <LocationWeatherCard
                  location={currentLocation}
                  title="Current Location Weather"
                  variant="start"
                />
              </div>

              <div className="plan-route-column">
                <LocationInput
                  label="Destination / Want to Go"
                  value={destinationText}
                  onChange={setDestinationText}
                  onSelectOnMap={() => setMapMode('destination')}
                  placeholder={destinationLoading ? 'Loading destination...' : 'Enter destination address'}
                />
                <LocationWeatherCard
                  location={destination}
                  title="Destination Weather"
                  variant="end"
                />
              </div>
            </div>

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="summary-top-row">
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

              {costResult && (
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
              )}
            </div>

            <div className="plan-preview-section">
              {!mapMode && currentLocation?.lat && destination?.lat && (
                <div className="route-map-preview">
                  <h3>Route Preview</h3>
                  <MapPicker
                    center={mapCenter}
                    marker={destination}
                    routeCoords={routeCoords}
                    attractionMarkers={routePlaces}
                    onSelect={() => {}}
                    height="400px"
                  />
                </div>
              )}

              {currentLocation?.lat && destination?.lat && (
                <RouteAttractionsPanel
                  places={routePlaces}
                  loading={placesLoading}
                  loadingRoute={distanceLoading && routeCoords.length < 2}
                />
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PlanTourPage;
