
import { useEffect, useRef } from 'react';
import { useBoundStore } from '../../../store/useBoundStore';

// This hook connects the physical world (distance traveled) to the application's
// business logic (fuel consumption). It subscribes to distance changes and
// calculates fuel usage based on user settings.
const useFuelCalculator = () => {
  const tripKm = useBoundStore((state) => state.tripKm);
  const fuelEconomyKmPerL = useBoundStore(
    (state) => state.settings.fuelEconomyKmPerL,
  );
  const { consumeFuel } = useBoundStore((state) => state.actions);

  const lastTripKm = useRef(tripKm);

  useEffect(() => {
    const distanceDelta = tripKm - lastTripKm.current;

    if (distanceDelta > 0 && fuelEconomyKmPerL > 0) {
      const fuelConsumed = distanceDelta / fuelEconomyKmPerL;
      consumeFuel(fuelConsumed);
    }

    lastTripKm.current = tripKm;
  }, [tripKm, fuelEconomyKmPerL, consumeFuel]);

  return null; // This hook also only produces side effects.
};

export default useFuelCalculator;
