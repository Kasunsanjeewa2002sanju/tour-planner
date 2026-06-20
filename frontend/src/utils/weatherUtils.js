const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

export function weatherCodeToLabel(code) {
  return WMO_CODES[code] || 'Unknown';
}

export function weatherCodeToIconType(code) {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'foggy';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rainy';
  if ([71, 73, 75].includes(code)) return 'snowy';
  if ([95, 96, 99].includes(code)) return 'stormy';
  return 'cloudy';
}

const RAINY_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];

export function isRainyWeather(code) {
  return RAINY_CODES.includes(code);
}

export async function fetchCurrentWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather unavailable');

  const data = await response.json();
  const current = data.current;

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    condition: weatherCodeToLabel(current.weather_code),
    unit: data.current_units?.temperature_2m || '°C',
  };
}
