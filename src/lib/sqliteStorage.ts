import { invoke } from "@tauri-apps/api/core";

const SQLITE_SETTINGS_KEY = "settings.data";
const SQLITE_THEME_KEY = "settings.theme";
const SQLITE_WINDOW_POSITION_KEY = "window.position";

export type SavedWindowPosition = {
  x: number;
  y: number;
};

const sqliteGet = async (key: string): Promise<string | null> => {
  const value = await invoke<string | null>("sqlite_get", { key });
  return value ?? null;
};

const sqliteSet = async (key: string, value: string): Promise<void> => {
  await invoke("sqlite_set", { key, value });
};

export const readSqliteJson = async <T>(key: string): Promise<T | null> => {
  const raw = await sqliteGet(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeSqliteJson = async <T>(
  key: string,
  value: T,
): Promise<void> => {
  await sqliteSet(key, JSON.stringify(value));
};

export const readSqliteString = async (key: string): Promise<string | null> => {
  return await sqliteGet(key);
};

export const writeSqliteString = async (
  key: string,
  value: string,
): Promise<void> => {
  await sqliteSet(key, value);
};

export const SQLITE_KEYS = {
  settings: SQLITE_SETTINGS_KEY,
  theme: SQLITE_THEME_KEY,
  windowPosition: SQLITE_WINDOW_POSITION_KEY,
} as const;
