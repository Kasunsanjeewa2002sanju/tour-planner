import React, { useEffect, useState } from 'react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Loader2,
  MapPin,
  Navigation,
  Snowflake,
  Sun,
  Umbrella,
  UmbrellaOff,
  Droplets,
  Wind
} from 'lucide-react';
import {
  fetchCurrentWeather,
  isRainyWeather,
  weatherCodeToIconType,
} from '../../utils/weatherUtils';
import { motion, AnimatePresence } from 'framer-motion';

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: CloudSun,
  foggy: CloudFog,
  rainy: CloudRain,
  snowy: Snowflake,
  stormy: CloudLightning,
};

function getWeatherMeta(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny'))
    return { emoji: '☀️', bg: 'linear-gradient(135deg, #FF6B35 0%, #f59e0b 100%)' };
  if (c.includes('partly') || c.includes('cloud'))
    return { emoji: '⛅', bg: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)' };
  if (c.includes('rain') || c.includes('drizzle'))
    return { emoji: '🌧️', bg: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)' };
  if (c.includes('storm'))
    return { emoji: '⛈️', bg: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)' };
  return { emoji: '🌤️', bg: 'linear-gradient(135deg, #FF6B35 0%, #f97316 100%)' };
}

const LocationWeatherCard = ({ location, title, variant = 'start' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location?.lat || !location?.lng) {
      setWeather(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCurrentWeather(location.lat, location.lng)
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) {
          setWeather(null);
          setError('Weather unavailable');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng]);

  if (!location?.lat || !location?.lng) return null;

  const meta = getWeatherMeta(weather?.condition);
  const locationLabel = location.address?.split(',').slice(0, 2).join(',') || title;
  const rainy = weather ? isRainyWeather(weather.weatherCode) : false;

  return (
    <motion.div 
      className={`premium-weather-card v2-${variant}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        background: weather ? meta.bg : 'var(--bg-card)',
        borderRadius: '1.25rem',
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        color: weather ? 'white' : 'var(--text-main)',
        boxShadow: weather ? '0 12px 30px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
        border: weather ? 'none' : '1px solid var(--border)',
        minHeight: '140px'
      }}
    >
      {weather && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(2px)',
          zIndex: 1
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {variant === 'start' ? <Navigation size={14} /> : <MapPin size={14} />}
            <span>{title}</span>
          </div>
          {weather && (
            <div style={{ padding: '0.25rem 0.6rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
               {rainy ? <Umbrella size={12} /> : <UmbrellaOff size={12} />}
               {rainy ? 'Rainy' : 'No Rain'}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}
            >
              <Loader2 size={18} className="spin" />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Analyzing atmosphere...</span>
            </motion.div>
          ) : error ? (
            <motion.div key="error" style={{ opacity: 0.6, fontSize: '0.9rem', padding: '1rem 0' }}>{error}</motion.div>
          ) : weather ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <motion.span 
                  style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {Math.round(weather.temperature)}°
                </motion.span>
                <div style={{ paddingBottom: '0.25rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{weather.condition}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{locationLabel}</div>
                </div>
                <motion.span 
                  style={{ marginLeft: 'auto', fontSize: '2.5rem' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {meta.emoji}
                </motion.span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', opacity: 0.9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Droplets size={12}/>{weather.humidity}%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Wind size={12}/>{weather.windSpeed} km/h</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LocationWeatherCard;
