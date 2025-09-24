import type { StateCreator } from 'zustand';
import type { AllSlices } from '../useBoundStore';

export interface BikeStateSlice {
  currentFuelL: number;
  tripKm: number;
  totalOdometerKm: number;
  currentSpeedKph: number;
  isGpsAvailable: boolean;
  isNetworkAvailable: boolean; // For future use
  // State for AI Assistant
  aiTip: string | null;
  isGeneratingTip: boolean;
  aiError: string | null;
  actions: {
    updatePosition: (speedKph: number, distanceDeltaKm: number) => void;
    consumeFuel: (fuelConsumedL: number) => void;
    setGpsStatus: (isAvailable: boolean) => void;
    addFuel: (liters: number) => void;
    resetTrip: () => void;
    setAiIsGenerating: (isGenerating: boolean) => void;
    setAiTip: (tip: string | null, error?: string | null) => void;
  };
}

export const createBikeStateSlice: StateCreator<
  AllSlices,
  [],
  [],
  BikeStateSlice
> = (set, get) => ({
  currentFuelL: 10, // Default value
  tripKm: 0,
  totalOdometerKm: 12345, // Default value
  currentSpeedKph: 0,
  isGpsAvailable: false,
  isNetworkAvailable: navigator.onLine,
  aiTip: null,
  isGeneratingTip: false,
  aiError: null,
  actions: {
    updatePosition: (speedKph, distanceDeltaKm) =>
      set((state) => ({
        currentSpeedKph: speedKph,
        tripKm: state.tripKm + distanceDeltaKm,
        totalOdometerKm: state.totalOdometerKm + distanceDeltaKm,
      })),
    consumeFuel: (fuelConsumedL) =>
      set((state) => ({
        currentFuelL: Math.max(0, state.currentFuelL - fuelConsumedL),
      })),
    setGpsStatus: (isAvailable) => set({ isGpsAvailable: isAvailable }),
    addFuel: (liters) => {
      const tankCapacity = get().settings.tankCapacityL;
      set((state) => ({
        currentFuelL: Math.min(tankCapacity, state.currentFuelL + liters),
      }));
    },
    resetTrip: () => set({ tripKm: 0 }),
    setAiIsGenerating: (isGenerating) => set({ isGeneratingTip: isGenerating, aiError: null }),
    setAiTip: (tip, error = null) => set({ aiTip: tip, aiError: error, isGeneratingTip: false }),
  },
});
