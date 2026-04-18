import {
  buildDefaultSettings,
  migrateLegacySettings,
  type AppSettings,
} from "./buddyConfig";
import { readSqliteJson, SQLITE_KEYS } from "./sqliteStorage";

export const readInitialSettings = (): AppSettings => {
  return buildDefaultSettings();
};

export const readPersistedSettings = async (): Promise<AppSettings | null> => {
  const raw = await readSqliteJson<Record<string, unknown>>(
    SQLITE_KEYS.settings,
  );
  if (!raw) {
    return null;
  }

  try {
    return migrateLegacySettings(raw);
  } catch {
    return null;
  }
};
