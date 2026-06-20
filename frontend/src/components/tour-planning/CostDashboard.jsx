import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { VEHICLE_TYPES, getCurrencySymbol } from '../../features/tour-planning/tourUtils';

const CostDashboard = ({
  distance,
  distanceUnit = 'km',
  vehicleType,
  onVehicleChange,
  fuelRequired,
  totalCost,
  currency = 'USD',
  fuelType,
  loading = false,
}) => {
  const symbol = getCurrencySymbol(currency);
  const distanceLabel = distanceUnit === 'miles' ? 'mi' : 'km';
  const displayDistance = distanceUnit === 'miles' && distance?.distanceMiles != null
    ? distance.distanceMiles
    : distance?.distanceKm;

  const costPercent = totalCost ? Math.min(100, (totalCost / (totalCost + 50)) * 100) : 0;
  const distancePercent = displayDistance ? Math.min(100, (displayDistance / (displayDistance + 100)) * 100) : 0;

  if (loading) {
    return (
      <div className="cost-dashboard cost-dashboard-loading">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-bar" />
      </div>
    );
  }

  if (!displayDistance) {
    return (
      <div className="cost-dashboard cost-dashboard-empty">
        <p>Enter both locations to see distance and fuel cost estimates.</p>
      </div>
    );
  }

  return (
    <div className="cost-dashboard">
      <h2 className="cost-dashboard-title">Trip Cost Summary</h2>

      <div className="cost-stat-grid">
        <div className="cost-stat-card">
          <div className="cost-stat-icon">📍</div>
          <div>
            <span className="cost-stat-label">Total Distance</span>
            <strong className="cost-stat-value">{displayDistance} {distanceLabel}</strong>
          </div>
        </div>

        <div className="cost-stat-card">
          <div className="cost-stat-icon">🚗</div>
          <div className="cost-stat-vehicle">
            <span className="cost-stat-label">Selected Vehicle</span>
            <select
              value={vehicleType}
              onChange={(e) => onVehicleChange(e.target.value)}
              className="vehicle-select"
            >
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cost-stat-card">
          <div className="cost-stat-icon">⛽</div>
          <div>
            <span className="cost-stat-label">Fuel Required ({fuelType})</span>
            <strong className="cost-stat-value">{fuelRequired ?? '—'} Liters</strong>
          </div>
        </div>

        <div className="cost-stat-card cost-stat-highlight">
          <div className="cost-stat-icon">💵</div>
          <div>
            <span className="cost-stat-label">Estimated Fuel Cost</span>
            <strong className="cost-stat-value cost-highlight">
              {totalCost != null ? `${symbol}${totalCost.toFixed(2)}` : '—'}
            </strong>
          </div>
        </div>
      </div>

      <div className="cost-breakdown">
        <h3>Visual Breakdown</h3>
        <div className="breakdown-item">
          <div className="breakdown-header">
            <MapPin size={16} />
            <span>Distance traveled</span>
            <strong>{displayDistance} {distanceLabel}</strong>
          </div>
          <div className="breakdown-bar">
            <div className="breakdown-fill distance-fill" style={{ width: `${distancePercent}%` }} />
          </div>
        </div>
        <div className="breakdown-item">
          <div className="breakdown-header">
            <DollarSign size={16} />
            <span>Fuel cost portion</span>
            <strong>{totalCost != null ? `${symbol}${totalCost.toFixed(2)}` : '—'}</strong>
          </div>
          <div className="breakdown-bar">
            <div className="breakdown-fill cost-fill" style={{ width: `${costPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostDashboard;
