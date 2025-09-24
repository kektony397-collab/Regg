import type { StateCreator } from 'zustand';
import type { AllSlices } from '../useBoundStore';
import type { Settings } from '../../types';

export interface SettingsSlice {
  settings: Settings;
  actions: {
    setSettings: (newSettings: Partial<Settings>) => void;
    toggleEcoModeTips: () => void;
  };
}

const defaultSettings: Settings = {
  bikeModel: 'CyberBike 2077',
  tankCapacityL: 15,
  fuelEconomyKmPerL: 25,
  reserveLiters: 3,
  ecoModeTipsEnabled: false,
};

export const createSettingsSlice: StateCreator<
  AllSlices,
  [],
  [],
  SettingsSlice
> = (set) => ({
  settings: defaultSettings,
  actions: {
    setSettings: (newSettings) =>
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    toggleEcoModeTips: () =>
      set((state) => ({
        settings: { ...state.settings, ecoModeTipsEnabled: !state.settings.ecoModeTipsEnabled },
      })),
  },
});
