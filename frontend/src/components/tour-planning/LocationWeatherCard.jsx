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
} from 'lucide-react';
import {
  fetchCurrentWeather,
  isRainyWeather,
  weatherCodeToIconType,
} from '../../utils/weatherUtils';

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: CloudSun,
  foggy: CloudFog,
  rainy: CloudRain,
  snowy: Snowflake,
  stormy: CloudLightning,
};

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

  const WeatherIcon = weather
    ? WEATHER_ICONS[weatherCodeToIconType(weather.weatherCode)] || Cloud
    : CloudSun;
  const locationLabel = location.address?.split(',').slice(0, 2).join(',') || title;
  const rainy = weather ? isRainyWeather(weather.weatherCode) : false;

  return (
    <div className={`location-weather-card location-weather-${variant}`}>
      <div className="location-weather-card-header">
        <div className="location-weather-title">
          {variant === 'start' ? <Navigation size={16} /> : <MapPin size={16} />}
          <span>{title}</span>
        </div>
        {weather && !loading && (
          <span className={`rain-status-badge ${rainy ? 'rain-status-yes' : 'rain-status-no'}`}>
            {rainy ? <Umbrella size={14} /> : <UmbrellaOff size={14} />}
            {rainy ? 'Rainy' : 'Not Rainy'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="location-weather-loading">
          <Loader2 size={18} className="spin" />
          <span>Loading weather...</span>
        </div>
      ) : error ? (
        <p className="location-weather-muted">{error}</p>
      ) : weather ? (
        <div className="location-weather-body">
          <div className="location-weather-main">
            <WeatherIcon size={28} className="location-weather-icon" />
            <div>
              <strong>{Math.round(weather.temperature)}{weather.unit}</strong>
              <span>{weather.condition}</span>
            </div>
          </div>
          <p className="location-weather-place">{locationLabel}</p>
          <div className="location-weather-meta">
            <span>Humidity {weather.humidity}%</span>
            <span>Wind {weather.windSpeed} km/h</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LocationWeatherCard;
