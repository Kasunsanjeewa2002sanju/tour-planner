import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Fuel, CloudSun, Loader2 } from 'lucide-react';
import { fetchPreferences } from '../../features/users/userSlice';
import { fetchFuelPrices } from '../../features/tour-planning/fuelSlice';
import { getCurrencySymbol } from '../../features/tour-planning/tourUtils';
import { useUserLocation } from '../../hooks/useUserLocation';
import { fetchCurrentWeather } from '../../utils/weatherUtils';

const InsightStatCards = () => {
  const dispatch = useDispatch();
  const { profile, preferences } = useSelector((state) => state.user);
  const { prices: fuelPrices, loading: fuelLoading } = useSelector((state) => state.fuel);
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
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setWeatherError('Weather unavailable');
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng]);

  const symbol = getCurrencySymbol(fuelPrices?.currency);
  const locationLabel = location?.address?.split(',').slice(0, 2).join(',') || 'Your area';

  return (
    <>
      <div className="insight-stat-card insight-stat-fuel">
        <div className="insight-stat-header">
          <Fuel size={22} className="insight-stat-icon fuel-icon" />
          <span className="insight-stat-title">Current Fuel Prices</span>
        </div>
        {fuelLoading ? (
          <div className="insight-stat-loading"><Loader2 size={20} className="spin" /></div>
        ) : fuelPrices ? (
          <div className="insight-stat-body">
            <div className="fuel-price-row">
              <span>Petrol</span>
              <strong>{symbol}{fuelPrices.petrol_price?.toFixed(2)}/L</strong>
            </div>
            <div className="fuel-price-row">
              <span>Diesel</span>
              <strong>{symbol}{fuelPrices.diesel_price?.toFixed(2)}/L</strong>
            </div>
          </div>
        ) : (
          <p className="insight-stat-muted">Fuel prices not available</p>
        )}
      </div>

      <div className="insight-stat-card insight-stat-weather">
        <div className="insight-stat-header">
          <CloudSun size={22} className="insight-stat-icon weather-icon" />
          <span className="insight-stat-title">Current Weather</span>
        </div>
        {locationLoading || weatherLoading ? (
          <div className="insight-stat-loading"><Loader2 size={20} className="spin" /></div>
        ) : weatherError || locationError ? (
          <p className="insight-stat-muted">{weatherError || locationError}</p>
        ) : weather ? (
          <div className="insight-stat-body">
            <div className="weather-main">
              <strong className="weather-temp">{Math.round(weather.temperature)}{weather.unit}</strong>
              <span className="weather-condition">{weather.condition}</span>
            </div>
            <p className="insight-stat-location">{locationLabel}</p>
            <div className="weather-meta">
              <span>Humidity {weather.humidity}%</span>
              <span>Wind {weather.windSpeed} km/h</span>
            </div>
          </div>
        ) : (
          <p className="insight-stat-muted">Set your location in Profile</p>
        )}
      </div>
    </>
  );
};

export default InsightStatCards;
