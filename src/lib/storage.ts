import AsyncStorage from "@react-native-async-storage/async-storage";
import { SQLiteStorage } from "expo-sqlite/kv-store";
import { Platform } from "react-native";

interface StringStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const memoryStore = new Map<string, string>();
const sqliteStorage = new SQLiteStorage("agendify-storage");

const webStorage: StringStorage = {
  getItem: async (key) => {
    try {
      return globalThis.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      globalThis.localStorage.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  removeItem: async (key) => {
    try {
      globalThis.localStorage.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};

const nativeStorage: StringStorage = {
  getItem: async (key) => {
    try {
      const storedValue = await sqliteStorage.getItem(key);
      if (storedValue !== null) {
        await AsyncStorage.removeItem(key).catch(() => {
          // Legacy key may already be gone.
        });
        return storedValue;
      }
    } catch {
      // Fall through to the legacy/native fallback paths below.
    }

    try {
      const legacyValue = await AsyncStorage.getItem(key);
      if (legacyValue !== null) {
        await sqliteStorage.setItem(key, legacyValue);
        await AsyncStorage.removeItem(key).catch(() => {
          // Legacy key may already be gone.
        });
        memoryStore.set(key, legacyValue);
        return legacyValue;
      }
    } catch {
      // Ignore legacy storage errors and fall back to memory.
    }

    return memoryStore.get(key) ?? null;
  },
  setItem: async (key, value) => {
    try {
      await sqliteStorage.setItem(key, value);
      memoryStore.set(key, value);
    } catch {
      memoryStore.set(key, value);
    }

    await AsyncStorage.removeItem(key).catch(() => {
      // Legacy key may already be gone.
    });
  },
  removeItem: async (key) => {
    try {
      await sqliteStorage.removeItem(key);
    } catch {
      // Fall through to in-memory cleanup.
    } finally {
      memoryStore.delete(key);
    }

    await AsyncStorage.removeItem(key).catch(() => {
      // Legacy key may already be gone.
    });
  },
};

export function getSafeStorage(): StringStorage {
  if (Platform.OS === "web") {
    return webStorage;
  }

  return nativeStorage;
}
