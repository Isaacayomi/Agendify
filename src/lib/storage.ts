import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface StringStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const memoryStore = new Map<string, string>();

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
      return await AsyncStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      memoryStore.set(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // fall through to in-memory cleanup
    } finally {
      memoryStore.delete(key);
    }
  },
};

export function getSafeStorage(): StringStorage {
  if (Platform.OS === "web") {
    return webStorage;
  }

  return nativeStorage;
}
