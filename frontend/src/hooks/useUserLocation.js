import { useState, useEffect } from 'react';
import { geocodeAddress, reverseGeocode } from '../features/tour-planning/tourUtils';

export function useUserLocation(profile, preferences) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      setLoading(true);
      setError(null);

      try {
        const prefLoc = preferences?.default_start_location;
        if (prefLoc?.lat && prefLoc?.lng) {
          if (!cancelled) {
            setLocation({
              lat: prefLoc.lat,
              lng: prefLoc.lng,
              address: prefLoc.address || 'Your location',
            });
            setLoading(false);
          }
          return;
        }

        if (profile?.current_address) {
          const query = [profile.current_address, profile.country].filter(Boolean).join(', ');
          const geocoded = await geocodeAddress(query);
          if (geocoded && !cancelled) {
            setLocation(geocoded);
            setLoading(false);
            return;
          }
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              if (cancelled) return;
              try {
                const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                setLocation(loc);
              } catch {
                setError('Could not determine location');
              } finally {
                setLoading(false);
              }
            },
            () => {
              if (!cancelled) {
                setError('Location permission denied');
                setLoading(false);
              }
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
          return;
        }

        if (!cancelled) {
          setError('No location available');
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Could not resolve location');
          setLoading(false);
        }
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [profile, preferences]);

  return { location, loading, error };
}
