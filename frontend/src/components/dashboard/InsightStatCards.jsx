import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2, Droplets, Wind, Fuel, CloudSun } from 'lucide-react';
import { fetchPreferences } from '../../features/users/userSlice';
import { fetchFuelPrices } from '../../features/tour-planning/fuelSlice';
import { getCurrencySymbol } from '../../features/tour-planning/tourUtils';
import { useUserLocation } from '../../hooks/useUserLocation';
import { fetchCurrentWeather } from '../../utils/weatherUtils';
import { motion } from 'framer-motion';

/* ─── Weather condition → gradient + emoji ─────────────────────────── */
function getWeatherMeta(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny'))
    return { emoji: '☀️', bg: 'linear-gradient(135deg,#FF6B35 0%,#f59e0b 60%,#fbbf24 100%)' };
  if (c.includes('partly') || c.includes('cloud'))
    return { emoji: '⛅', bg: 'linear-gradient(135deg,#64748b 0%,#94a3b8 60%,#bfdbfe 100%)' };
  if (c.includes('overcast'))
    return { emoji: '☁️', bg: 'linear-gradient(135deg,#475569 0%,#64748b 60%,#94a3b8 100%)' };
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower'))
    return { emoji: '🌧️', bg: 'linear-gradient(135deg,#1d4ed8 0%,#3b82f6 60%,#60a5fa 100%)' };
  if (c.includes('storm') || c.includes('thunder'))
    return { emoji: '⛈️', bg: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 60%,#7c3aed 100%)' };
  if (c.includes('snow') || c.includes('sleet') || c.includes('ice'))
    return { emoji: '❄️', bg: 'linear-gradient(135deg,#0369a1 0%,#38bdf8 60%,#e0f2fe 100%)' };
  if (c.includes('fog') || c.includes('mist') || c.includes('haze'))
    return { emoji: '🌫️', bg: 'linear-gradient(135deg,#6b7280 0%,#9ca3af 60%,#d1d5db 100%)' };
  if (c.includes('wind'))
    return { emoji: '💨', bg: 'linear-gradient(135deg,#0891b2 0%,#22d3ee 60%,#a5f3fc 100%)' };
  return { emoji: '🌤️', bg: 'linear-gradient(135deg,#FF6B35 0%,#f97316 60%,#fde68a 100%)' };
}

/* ─── Floating decorative blob ─────────────────────────────────────── */
const Blob = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.18)',
      filter: 'blur(28px)',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ─── WEATHER CARD ──────────────────────────────────────────────────── */
const WeatherCard = ({ weather, loading, error, locationLabel }) => {
  const meta = getWeatherMeta(weather?.condition);

  return (
    <motion.div
      className="dash-premium-card"
      style={{ background: meta.bg }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blobs */}
      <Blob style={{ width: 160, height: 160, top: -40, right: -30 }} />
      <Blob style={{ width: 100, height: 100, bottom: -20, left: 20 }} />

      {/* Glass inner overlay */}
      <div className="dash-card-glass" />

      {/* Content layout */}
      <div className="dash-card-content">
        {/* Left: data */}
        <div className="dash-card-info" style={{ zIndex: 2 }}>
          <div className="dash-card-label">
            <CloudSun size={14} />
            <span>Current Weather</span>
          </div>

          {loading ? (
            <div className="dash-card-loading"><Loader2 size={22} className="spin" /><span>Fetching…</span></div>
          ) : error ? (
            <p className="dash-card-empty">{error}</p>
          ) : weather ? (
            <>
              <div className="dash-card-main-value">
                <motion.span
                  className="dash-card-emoji"
                  animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {meta.emoji}
                </motion.span>
                <span className="dash-card-temp">{Math.round(weather.temperature)}{weather.unit}</span>
              </div>
              <p className="dash-card-condition">{weather.condition}</p>
              <p className="dash-card-location">📍 {locationLabel}</p>
              <div className="dash-card-meta-row">
                <span><Droplets size={12} /> {weather.humidity}% humidity</span>
                <span><Wind size={12} /> {weather.windSpeed} km/h</span>
              </div>
            </>
          ) : (
            <p className="dash-card-empty">Set location in Profile to see weather</p>
          )}
        </div>

        {/* Right: illustration */}
        <motion.img
          src="/weather-card.png"
          alt="Weather illustration"
          className="dash-card-illustration"
          animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
};

/* ─── FUEL CARD ─────────────────────────────────────────────────────── */
const FuelCard = ({ fuelPrices, loading, symbol }) => (
  <motion.div
    className="dash-premium-card"
    style={{ background: 'linear-gradient(135deg,#0d9488 0%,#0891b2 55%,#06b6d4 100%)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    {/* Decorative blobs */}
    <Blob style={{ width: 150, height: 150, top: -30, right: -20 }} />
    <Blob style={{ width: 90, height: 90, bottom: -10, left: 30 }} />

    {/* Glass overlay */}
    <div className="dash-card-glass" />

    {/* Content */}
    <div className="dash-card-content">
      {/* Left: data */}
      <div className="dash-card-info" style={{ zIndex: 2 }}>
        <div className="dash-card-label">
          <Fuel size={14} />
          <span>Current Fuel Prices</span>
        </div>

        {loading ? (
          <div className="dash-card-loading"><Loader2 size={22} className="spin" /><span>Loading…</span></div>
        ) : fuelPrices ? (
          <div className="dash-fuel-prices">
            <div className="dash-fuel-item">
              <span className="dash-fuel-type">⛽ Petrol</span>
              <span className="dash-fuel-val">{symbol}{fuelPrices.petrol_price?.toFixed(2)}<small>/L</small></span>
            </div>
            <div className="dash-fuel-item">
              <span className="dash-fuel-type">🛢️ Diesel</span>
              <span className="dash-fuel-val">{symbol}{fuelPrices.diesel_price?.toFixed(2)}<small>/L</small></span>
            </div>
          </div>
        ) : (
          <p className="dash-card-empty">Prices unavailable</p>
        )}
      </div>

      {/* Right: illustration */}
      <motion.img
        src="/fuel-card.png"
        alt="Fuel station illustration"
        className="dash-card-illustration"
        animate={{ x: [0, 4, -4, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  </motion.div>
);

/* ─── Main export ───────────────────────────────────────────────────── */
const InsightStatCards = () => {
  const dispatch = useDispatch();
  const { profile, preferences } = useSelector((s) => s.user);
  const { prices: fuelPrices, loading: fuelLoading } = useSelector((s) => s.fuel);
  const { location, loading: locationLoading, error: locationError } = useUserLocation(profile, preferences);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    dispatch(fetchFuelPrices());
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (!location?.lat || !location?.lng) return;
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(null);
    fetchCurrentWeather(location.lat, location.lng)
      .then((data) => { if (!cancelled) setWeather(data); })
      .catch(() => { if (!cancelled) setWeatherError('Weather unavailable'); })
      .finally(() => { if (!cancelled) setWeatherLoading(false); });
    return () => { cancelled = true; };
  }, [location?.lat, location?.lng]);

  const symbol = getCurrencySymbol(fuelPrices?.currency);
  const locationLabel = location?.address?.split(',').slice(0, 2).join(', ') || 'Your area';

  return (
    /* Two separate cards in one row */
    <div className="dash-cards-grid">
      <WeatherCard
        weather={weather}
        loading={locationLoading || weatherLoading}
        error={weatherError || locationError}
        locationLabel={locationLabel}
      />
      <FuelCard
        fuelPrices={fuelPrices}
        loading={fuelLoading}
        symbol={symbol}
      />
    </div>
  );
};

export default InsightStatCards;
