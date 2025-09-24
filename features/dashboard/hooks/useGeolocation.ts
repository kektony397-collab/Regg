
import { useState, useEffect } from 'react';
import type { GpsPosition, GpsError } from '../../../types';

const useGeolocation = (
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  },
) => {
  const [position, setPosition] = useState<GpsPosition | null>(null);
  const [error, setError] = useState<GpsError | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // By stringifying the options, we create a stable dependency for useEffect.
  // This prevents the hook from tearing down and re-creating the geolocation
  // watch on every render, which was the likely cause of the flickering.
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser.',
      });
      setIsAvailable(false);
      return;
    }

    setIsAvailable(true);

    const watchOptions = JSON.parse(optionsString);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError({
          code: err.code,
          message: err.message,
        });
      },
      watchOptions, // Use the parsed options
    );

    // Cleanup function to clear the watch when the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsString]); // Dependency is now the stable string

  return { position, error, isAvailable };
};

export default useGeolocation;
