
import { useEffect, useRef } from 'react';
import { KalmanFilter } from 'kalman-filter';
import { useBoundStore } from '../../../store/useBoundStore';
import useGeolocation from './useGeolocation';
import { haversineDistance } from '../../../lib/haversine';
import type { GpsPosition } from '../../../types';

// This hook is the core data processing engine. It consumes raw GPS data,
// smooths it with a Kalman filter, calculates distance, and updates the global state.
const useGpsProcessor = () => {
  const { position, isAvailable: isGpsHardwareAvailable } = useGeolocation();
  const { setGpsStatus, updatePosition } = useBoundStore(
    (state) => state.actions,
  );

  const kalmanFilter = useRef<KalmanFilter | null>(null);
  const lastPosition = useRef<GpsPosition | null>(null);

  useEffect(() => {
    setGpsStatus(isGpsHardwareAvailable && !!position);
  }, [isGpsHardwareAvailable, position, setGpsStatus]);

  useEffect(() => {
    if (!position) return;

    // Initialize the Kalman filter on the first valid position
    if (!kalmanFilter.current) {
      kalmanFilter.current = new KalmanFilter({
        observation: 2, // We are observing 2 dimensions: [latitude, longitude]
        dynamic: 'constant-speed', // Assumes the bike moves at a roughly constant speed between measurements
      });
    }

    // Predict the next state and get the corrected (smoothed) state
    const smoothedCoords = kalmanFilter.current.filter({
      previousCorrected: null, // Let the filter manage its own state
      observation: [position.latitude, position.longitude],
    });

    const smoothedPosition: GpsPosition = {
      ...position,
      latitude: smoothedCoords[0],
      longitude: smoothedCoords[1],
    };

    let distanceDeltaKm = 0;
    if (lastPosition.current) {
      distanceDeltaKm = haversineDistance(
        {
          lat: lastPosition.current.latitude,
          lon: lastPosition.current.longitude,
        },
        {
          lat: smoothedPosition.latitude,
          lon: smoothedPosition.longitude,
        },
      );
    }

    // Convert speed from m/s to km/h
    const speedKph = (position.speed || 0) * 3.6;

    // Update the global store with the processed data
    updatePosition(speedKph, distanceDeltaKm);

    // Store the current smoothed position for the next calculation
    lastPosition.current = smoothedPosition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, updatePosition]);

  return null; // This hook does not return anything, it only produces side effects.
};

export default useGpsProcessor;
