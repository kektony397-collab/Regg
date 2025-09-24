import { useEffect, useRef } from 'react';
import KalmanFilter from 'kalman-filter';
import { useBoundStore } from '../../../store/useBoundStore';
import useGeolocation from './useGeolocation';
import { haversineDistance } from '../../../lib/haversine';
import type { GpsPosition } from '../../../types';

// This hook is the core data processing engine. It consumes raw GPS data,
// smooths it with a Kalman filter, calculates distance, and updates the global state.
const useGpsProcessor = () => {
  const { position, isAvailable: isGpsHardwareAvailable } = useGeolocation();

  const setGpsStatus = useBoundStore((state) => state.actions.setGpsStatus);
  const updatePosition = useBoundStore((state) => state.actions.updatePosition);

  const kalmanFilter = useRef<KalmanFilter | null>(null);
  const lastPosition = useRef<GpsPosition | null>(null);

  useEffect(() => {
    setGpsStatus(isGpsHardwareAvailable && !!position);

    if (!position) {
      return;
    }

    if (!kalmanFilter.current) {
      kalmanFilter.current = new KalmanFilter({
        observation: 2, 
        dynamic: 'constant-speed',
      });
    }

    const smoothedCoords = kalmanFilter.current.filter({
      previousCorrected: null, 
      observation: [position.latitude, position.longitude],
    });

    // BUG FIX: Correctly destructure the smoothed coordinates array.
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

    const speedKph = (position.speed || 0) * 3.6;
    updatePosition(speedKph, distanceDeltaKm);
    lastPosition.current = smoothedPosition;
  }, [position, isGpsHardwareAvailable, setGpsStatus, updatePosition]);

  return null; 
};

export default useGpsProcessor;
