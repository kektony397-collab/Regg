
import type { StateCreator } from 'zustand';
import type { AllSlices } from '../useBoundStore';
import type { RefuelRecord, TripLog } from '../../types';
import { db } from '../../services/db';

export interface HistorySlice {
  // Note: The source of truth for history is IndexedDB.
  // This slice primarily holds actions to modify the database.
  // We don't need to hold the arrays in Zustand state because
  // dexie-react-hooks will provide live queries directly to components.
  actions: {
    addRefuelRecord: (record: Omit<RefuelRecord, 'id'>) => Promise<void>;
    deleteRefuelRecord: (id: number) => Promise<void>;
    addTripLog: (log: Omit<TripLog, 'id'>) => Promise<void>;
  };
}

export const createHistorySlice: StateCreator<
  AllSlices,
  [],
  [],
  HistorySlice
> = () => ({
  actions: {
    addRefuelRecord: async (record) => {
      await db.refuelRecords.add(record as RefuelRecord);
    },
    deleteRefuelRecord: async (id) => {
      await db.refuelRecords.delete(id);
    },
    addTripLog: async (log) => {
      await db.tripLogs.add(log as TripLog);
    },
  },
});
