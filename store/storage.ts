
import type { StateStorage } from 'zustand/middleware';
import { db } from '../services/db';

// This custom storage adapter allows Zustand's persist middleware to save state to IndexedDB via Dexie.
// It conforms to the StateStorage interface required by Zustand.
export const dexieStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const item = await db.zustandState.get(name);
    // Zustand's persist middleware expects a string, so we serialize the state object.
    // The state object itself contains the actual state and a version number.
    return item ? JSON.stringify(item.state) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // The value from Zustand is a stringified object containing state and version.
    // We parse it to store it as an object in Dexie.
    await db.zustandState.put({
      name,
      state: JSON.parse(value),
    });
  },
  removeItem: async (name: string): Promise<void> => {
    await db.zustandState.delete(name);
  },
};
