
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createBikeStateSlice,
  type BikeStateSlice,
} from './slices/bikeStateSlice';
import {
  createSettingsSlice,
  type SettingsSlice,
} from './slices/settingsSlice';
import { createHistorySlice, type HistorySlice } from './slices/historySlice';
import { dexieStorage } from './storage';

export type AllSlices = BikeStateSlice & SettingsSlice & HistorySlice;

export const useBoundStore = create<AllSlices>()(
  persist(
    (...a) => ({
      ...createBikeStateSlice(...a),
      ...createSettingsSlice(...a),
      ...createHistorySlice(...a),
    }),
    {
      name: 'smart-bike-store', // Unique name for the storage key
      storage: dexieStorage, // Use our custom Dexie storage adapter
      // The `partialize` option lets us select which parts of the state to persist.
      // We only want to persist settings. Volatile bike state is not persisted.
      partialize: (state) => ({
        settings: state.settings,
        totalOdometerKm: state.totalOdometerKm
      }),
    },
  ),
);
