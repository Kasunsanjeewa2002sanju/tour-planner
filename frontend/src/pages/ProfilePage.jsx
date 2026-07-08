import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchPreferences, updatePreferences, fetchMe } from '../features/users/userSlice';
import { toggleTheme } from '../features/theme/themeSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { User, Car, MapPin, Palette, Sun, Moon } from 'lucide-react';
import { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_DEFAULTS, reverseGeocode, geocodeAddress, parseCoordinates } from '../features/tour-planning/tourUtils';
import LocationInput from '../components/tour-planning/LocationInput';
import MapPicker from '../components/tour-planning/MapPicker';
import '../styles/layout.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, preferences, loading } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);

  const [profileData, setProfileData] = useState({
    email: '',
    phone_number: '',
    current_address: '',
    country: ''
  });

  const [prefData, setPrefData] = useState({
    default_start_location: { address: '', lat: null, lng: null },
    preferred_distance_unit: 'km',
    vehicle_type: '',
    fuel_efficiency: '',
    fuel_type: ''
  });

  const [vehicleSaved, setVehicleSaved] = useState(false);
  const [mapMode, setMapMode] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        current_address: profile.current_address || '',
        country: profile.country || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      const loc = preferences.default_start_location;
      setPrefData({
        default_start_location: typeof loc === 'object' && loc !== null
          ? { address: loc.address || '', lat: loc.lat || null, lng: loc.lng || null }
          : { address: loc || '', lat: null, lng: null },
        preferred_distance_unit: preferences.preferred_distance_unit || 'km',
        vehicle_type: preferences.vehicle_type || '',
        fuel_efficiency: preferences.fuel_efficiency ?? '',
        fuel_type: preferences.fuel_type || ''
      });
      if (typeof loc === 'object' && loc !== null && loc.address) {
        setCurrentText(loc.address);
      } else if (typeof loc === 'string') {
        setCurrentText(loc);
      }
    }
  }, [preferences]);

  useEffect(() => {
    if (!currentText.trim()) {
      setPrefData(prev => ({
        ...prev,
        default_start_location: { address: '', lat: null, lng: null }
      }));
      return;
    }
    const timer = setTimeout(async () => {
      const coords = parseCoordinates(currentText);
      const resolved = coords || await geocodeAddress(currentText);
      if (resolved) {
        setPrefData(prev => ({
          ...prev,
          default_start_location: resolved
        }));
      } else {
        setPrefData(prev => ({
          ...prev,
          default_start_location: { ...prev.default_start_location, address: currentText }
        }));
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [currentText]);

  const onProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const onVehicleTypeChange = (e) => {
    const type = e.target.value;
    const defaults = VEHICLE_DEFAULTS[type];
    setPrefData({
      ...prefData,
      vehicle_type: type,
      fuel_efficiency: defaults?.fuel_efficiency ?? prefData.fuel_efficiency,
      fuel_type: defaults?.fuel_type ?? prefData.fuel_type,
    });
    setVehicleSaved(false);
  };

  const onPrefChange = (e) => {
    setPrefData({ ...prefData, [e.target.name]: e.target.value });
    setVehicleSaved(false);
  };

  const onStartLocationChange = (val) => {
    setCurrentText(val);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setCurrentText(location.address);
        setPrefData({ ...prefData, default_start_location: location });
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true }
    );
  };

  const handleMapSelect = (location) => {
    setCurrentText(location.address);
    setPrefData({ ...prefData, default_start_location: location });
    setMapMode(false);
  };

  const onProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const onPrefSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePreferences({
      default_start_location: prefData.default_start_location,
      preferred_distance_unit: prefData.preferred_distance_unit,
      vehicle_type: prefData.vehicle_type,
      fuel_efficiency: parseFloat(prefData.fuel_efficiency),
      fuel_type: prefData.fuel_type,
    })).then((result) => {
      if (updatePreferences.fulfilled.match(result)) {
        setVehicleSaved(true);
      }
    });
  };

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #334155'
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page-title">Account Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <User color="#6366f1" />
            <h2 style={{ margin: 0 }}>Personal Information</h2>
          </div>

          <form onSubmit={onProfileSubmit}>
            <Input label="Email" name="email" value={profileData.email} onChange={onProfileChange} />
            <Input label="Phone Number" name="phone_number" value={profileData.phone_number} onChange={onProfileChange} />
            <Input label="Address" name="current_address" value={profileData.current_address} onChange={onProfileChange} />
            <Input label="Country" name="country" value={profileData.country} onChange={onProfileChange} />
            <Button type="submit" loading={loading}>Save Profile</Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Car color="#6366f1" />
            <h2 style={{ margin: 0 }}>Vehicle Profile</h2>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Required before planning trips. Fuel efficiency is measured in Kilometers per Liter (km/L).
          </p>

          <form onSubmit={onPrefSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                Vehicle Type *
              </label>
              <select
                name="vehicle_type"
                value={prefData.vehicle_type}
                onChange={onVehicleTypeChange}
                required
                style={selectStyle}
              >
                <option value="">Select vehicle type</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                Fuel Efficiency (km/L) *
              </label>
              <input
                type="number"
                name="fuel_efficiency"
                step="0.1"
                min="0.1"
                required
                value={prefData.fuel_efficiency}
                onChange={onPrefChange}
                placeholder="e.g. 12 for car, 40 for bike"
                style={selectStyle}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                Fuel Type *
              </label>
              <select
                name="fuel_type"
                value={prefData.fuel_type}
                onChange={onPrefChange}
                required
                style={selectStyle}
              >
                <option value="">Select fuel type</option>
                {FUEL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={loading}>Save Vehicle Profile</Button>
            {vehicleSaved && (
              <p style={{ color: '#34d399', marginTop: '1rem', fontSize: '0.875rem' }}>
                Vehicle profile saved successfully.
              </p>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <MapPin color="#6366f1" />
            <h2 style={{ margin: 0 }}>Trip Preferences</h2>
          </div>

          <form onSubmit={onPrefSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <LocationInput
                label="Default Start Location"
                value={currentText}
                onChange={onStartLocationChange}
                onSelectOnMap={() => setMapMode('current')}
                onUseCurrentLocation={handleUseCurrentLocation}
                loadingGeo={geoLoading}
                placeholder="Enter address or pick on map"
              />
            </div>
            
            {mapMode && (
              <div className="map-mode-panel" style={{ marginBottom: '1.25rem' }}>
                <div className="map-mode-header">
                  <span>Click on the map to set your default start location</span>
                  <button type="button" onClick={() => setMapMode(null)}>Done</button>
                </div>
                <MapPicker
                  center={prefData.default_start_location?.lat ? prefData.default_start_location : { lat: 7.8731, lng: 80.7718 }}
                  marker={prefData.default_start_location?.lat ? prefData.default_start_location : undefined}
                  onSelect={handleMapSelect}
                  height="300px"
                />
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Distance Unit</label>
              <select
                name="preferred_distance_unit"
                value={prefData.preferred_distance_unit}
                onChange={onPrefChange}
                style={selectStyle}
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <Button type="submit" loading={loading} variant="secondary">Update Preferences</Button>
          </form>
        </motion.div>

        {/* --- Theme Preferences Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%', gridColumn: '1 / -1' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Palette color="#FF6B35" />
            <h2 style={{ margin: 0, color: 'var(--text-main)' }}>App Appearance</h2>
          </div>

          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '1.5rem', background: 'var(--input-bg)', 
            borderRadius: '1rem', border: '1px solid var(--border)',
            flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 600 }}>Theme Mode</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Select your preferred theme for the app interface.</p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
                border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600',
                transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {mode === 'dark' ? <Moon size={18} color="var(--primary)" /> : <Sun size={18} color="var(--primary)" />}
              {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;
