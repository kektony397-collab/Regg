import Dexie, { type Table } from 'dexie';
import type { Settings, RefuelRecord, TripLog } from '../types';

// This table is specifically for the Zustand persist middleware
interface ZustandState {
  name: string;
  state: unknown;
}

export class SmartBikeDB extends Dexie {
  settings!: Table<Settings, number>;
  refuelRecords!: Table<RefuelRecord, number>;
  tripLogs!: Table<TripLog, number>;
  zustandState!: Table<ZustandState, string>;

  constructor() {
    super('SmartBikeDB');
    // FIX: Cast 'this' to Dexie to resolve a typing issue where the 'version' method was not being found on the subclass.
    (this as Dexie).version(1).stores({
      settings: '++id, key',
      refuelRecords: '++id, timestamp',
      tripLogs: '++id, startTimestamp',
      zustandState: 'name', // Primary key is the store name
    });
  }
}

export const db = new SmartBikeDB();