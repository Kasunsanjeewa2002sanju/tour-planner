export const VEHICLE_TYPES = ['Bus', 'Car', 'Van', 'Bike', 'Three Wheeler'];
export const FUEL_TYPES = ['Petrol', 'Diesel'];

export const VEHICLE_DEFAULTS = {
  Bus: { fuel_efficiency: 3, fuel_type: 'Diesel' },
  Car: { fuel_efficiency: 12, fuel_type: 'Petrol' },
  Van: { fuel_efficiency: 7, fuel_type: 'Diesel' },
  Bike: { fuel_efficiency: 40, fuel_type: 'Petrol' },
  'Three Wheeler': { fuel_efficiency: 20, fuel_type: 'Petrol' },
};

/** Normalize stored efficiency to km/L (handles legacy L/km values < 1). */
export function toKmPerLiter(efficiency) {
  if (!efficiency || efficiency <= 0) return null;
  if (efficiency < 1) return 1 / efficiency;
  return efficiency;
}

export function isVehicleSetupComplete(preferences) {
  if (!preferences) return false;
  return Boolean(
    preferences.vehicle_type &&
    preferences.fuel_efficiency != null &&
    preferences.fuel_efficiency > 0 &&
    preferences.fuel_type
  );
}

export function calculateTripCost(distanceKm, fuelEfficiency, fuelType, fuelPrices) {
  const kmPerLiter = toKmPerLiter(fuelEfficiency);
  if (!distanceKm || !kmPerLiter || !fuelPrices) return null;

  const fuelRequired = distanceKm / kmPerLiter;
  const pricePerLiter = fuelType === 'Diesel'
    ? fuelPrices.diesel_price
    : fuelPrices.petrol_price;
  const totalCost = fuelRequired * pricePerLiter;

  return {
    fuelRequired: Math.round(fuelRequired * 100) / 100,
    pricePerLiter,
    totalCost: Math.round(totalCost * 100) / 100,
    currency: fuelPrices.currency || 'USD',
    kmPerLiter,
  };
}

export async function geocodeAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  const data = await response.json();
  if (!data.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    address: data[0].display_name,
  };
}

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  const data = await response.json();
  return {
    lat,
    lng,
    address: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
  };
}

export async function fetchRouteDistance(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('Unable to calculate route distance');
  }

  const distanceMeters = data.routes[0].distance;
  return {
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    distanceMiles: Math.round((distanceMeters / 1609.34) * 10) / 10,
  };
}

export function parseCoordinates(text) {
  const match = text.trim().match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng, address: text.trim() };
}

export function formatLocationDisplay(location) {
  if (!location) return '';
  if (typeof location === 'string') return location;
  return location.address || `${location.lat?.toFixed(5)}, ${location.lng?.toFixed(5)}`;
}

export function getCurrencySymbol(currency = 'USD') {
  const symbols = { USD: '$', EUR: '€', GBP: '£', LKR: 'Rs' };
  return symbols[currency] || currency;
}
