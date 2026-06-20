const EARTH_RADIUS_KM = 6371;
const ROUTE_CORRIDOR_KM = 2;
const MAX_ROUTE_PLACES = 14;

export const ATTRACTION_TYPES = {
  viewpoint: { label: 'Viewpoint', icon: 'viewpoint' },
  photo_spot: { label: 'Photo Spot', icon: 'photo_spot' },
  waterfall: { label: 'Waterfall', icon: 'waterfall' },
  lake: { label: 'Lake', icon: 'lake' },
  river: { label: 'River', icon: 'river' },
  bungalow: { label: 'Bungalow', icon: 'bungalow' },
  landmark: { label: 'Landmark', icon: 'landmark' },
  cultural: { label: 'Cultural SITE', icon: 'cultural' },
  food: { label: 'Food & Drink', icon: 'food' },
};

export function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getRouteBbox(routeCoords, padding = 0.08) {
  const lats = routeCoords.map(([lat]) => lat);
  const lngs = routeCoords.map(([, lng]) => lng);
  return {
    south: Math.min(...lats) - padding,
    west: Math.min(...lngs) - padding,
    north: Math.max(...lats) + padding,
    east: Math.max(...lngs) + padding,
  };
}

function minDistanceToRouteKm(lat, lng, routeCoords) {
  if (!routeCoords?.length) return Infinity;

  let min = Infinity;
  for (let i = 0; i < routeCoords.length - 1; i++) {
    const [lat1, lng1] = routeCoords[i];
    const [lat2, lng2] = routeCoords[i + 1];
    for (let step = 0; step <= 50; step++) {
      const t = step / 50;
      const sampleLat = lat1 + t * (lat2 - lat1);
      const sampleLng = lng1 + t * (lng2 - lng1);
      min = Math.min(min, haversineDistanceKm(lat, lng, sampleLat, sampleLng));
    }
  }
  return min;
}

function distanceAlongRouteKm(lat, lng, routeCoords) {
  let bestProgress = 0;
  let minDist = Infinity;
  let cumulative = 0;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const [lat1, lng1] = routeCoords[i];
    const [lat2, lng2] = routeCoords[i + 1];
    const segLen = haversineDistanceKm(lat1, lng1, lat2, lng2);

    for (let step = 0; step <= 50; step++) {
      const t = step / 50;
      const sampleLat = lat1 + t * (lat2 - lat1);
      const sampleLng = lng1 + t * (lng2 - lng1);
      const dist = haversineDistanceKm(lat, lng, sampleLat, sampleLng);
      if (dist < minDist) {
        minDist = dist;
        bestProgress = cumulative + segLen * t;
      }
    }
    cumulative += segLen;
  }

  return bestProgress;
}

function categorizeFromTags(tags = {}) {
  const name = (tags.name || '').toLowerCase();

  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (name.includes('viewpoint') || name.includes('view point')) return 'viewpoint';
  if (tags.natural === 'waterfall' || name.includes('waterfall')) return 'waterfall';
  if (tags.water === 'lake' || tags.water === 'reservoir' || name.includes('lake') || name.includes('reservoir')) return 'lake';
  if (tags.waterway === 'river' || tags.waterway === 'stream' || name.includes('river')) return 'river';
  
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'bar') return 'food';
  if (tags.tourism === 'museum' || tags.tourism === 'artwork') return 'cultural';
  if (tags.tourism === 'attraction' || tags.natural === 'peak' || tags.natural === 'rock') return 'landmark';
  
  if (
    tags.tourism === 'guest_house' ||
    tags.tourism === 'hotel' ||
    tags.building === 'bungalow' ||
    name.includes('bungalow')
  ) return 'bungalow';
  
  if (tags.historic || tags.tourism === 'picnic_site') return 'photo_spot';
  return null;
}

function categorizeAppDestination(dest) {
  const map = {
    mountain: 'viewpoint',
    beach: 'photo_spot',
    forest: 'photo_spot',
    historic: 'photo_spot',
    city: 'photo_spot',
    other: 'photo_spot',
  };
  return map[dest.category] || 'photo_spot';
}

function dedupePlaces(places) {
  const seen = new Set();
  return places.filter((place) => {
    const key = `${place.name.trim().toLowerCase()}-${Math.round(place.lat * 100)}-${Math.round(place.lng * 100)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchOverpassPlaces(bbox) {
  const { south, west, north, east } = bbox;
  const query = `
    [out:json][timeout:30];
    (
      node["natural"~"waterfall|peak|rock|cave_entrance"](${south},${west},${north},${east});
      way["natural"~"waterfall|peak|rock|cave_entrance"](${south},${west},${north},${east});
      node["tourism"~"viewpoint|attraction|museum|artwork|zoo|theme_park"](${south},${west},${north},${east});
      way["tourism"~"viewpoint|attraction|museum|artwork|zoo|theme_park"](${south},${west},${north},${east});
      node["water"~"lake|reservoir"](${south},${west},${north},${east});
      way["water"~"lake|reservoir"](${south},${west},${north},${east});
      node["waterway"~"river|stream"](${south},${west},${north},${east});
      way["waterway"~"river|stream"](${south},${west},${north},${east});
      node["tourism"~"guest_house|hotel"](${south},${west},${north},${east});
      node["amenity"~"restaurant|cafe|bar"](${south},${west},${north},${east});
    );
    out center 100;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Overpass unavailable');

  const data = await response.json();
  return (data.elements || [])
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      const tags = el.tags || {};
      const type = categorizeFromTags(tags);
      if (!lat || !lng || !type || !tags.name) return null;
      return {
        name: tags.name,
        lat,
        lng,
        type,
        source: 'osm',
      };
    })
    .filter(Boolean);
}

function filterPlacesOnRoute(places, routeCoords) {
  return places
    .map((place) => {
      const offRouteKm = minDistanceToRouteKm(place.lat, place.lng, routeCoords);
      if (offRouteKm > ROUTE_CORRIDOR_KM) return null;
      return {
        ...place,
        offRouteKm: Math.round(offRouteKm * 10) / 10,
        routeKm: Math.round(distanceAlongRouteKm(place.lat, place.lng, routeCoords) * 10) / 10,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.routeKm - b.routeKm);
}

function getAppDestinationsOnRoute(appDestinations, routeCoords) {
  return appDestinations
    .filter((dest) => dest.coordinates?.lat && dest.coordinates?.lng && dest.name)
    .map((dest) => ({
      name: dest.name,
      lat: dest.coordinates.lat,
      lng: dest.coordinates.lng,
      location: dest.location,
      type: categorizeAppDestination(dest),
      source: 'app',
    }));
}

export async function fetchRouteAttractions(routeCoords, appDestinations = [], limit = MAX_ROUTE_PLACES) {
  if (!routeCoords?.length || routeCoords.length < 2) return [];

  const bbox = getRouteBbox(routeCoords);
  const appPlaces = getAppDestinationsOnRoute(appDestinations, routeCoords);

  let osmPlaces = [];
  try {
    osmPlaces = await fetchOverpassPlaces(bbox);
  } catch {
    osmPlaces = [];
  }

  const combined = dedupePlaces([...appPlaces, ...osmPlaces]);
  const onRoute = filterPlacesOnRoute(combined, routeCoords);

  return onRoute.slice(0, limit).map((place) => ({
    ...place,
    typeLabel: ATTRACTION_TYPES[place.type]?.label || 'Place',
  }));
}
