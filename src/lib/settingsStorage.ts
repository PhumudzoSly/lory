import {
  buildDefaultSettings,
  migrateLegacySettings,
  type AppSettings,
} from "./buddyConfig";
import { applySmartBreakIntervals } from "./breakSchedulingEngine";
import { readSqliteJson, SQLITE_KEYS } from "./sqliteStorage";

export const readInitialSettings = (): AppSettings => {
  const defaults = buildDefaultSettings();
  return {
    ...defaults,
    breaks: applySmartBreakIntervals(defaults.breaks),
  };
};

export const readPersistedSettings = async (): Promise<AppSettings | null> => {
  const raw = await readSqliteJson<Record<string, unknown>>(
    SQLITE_KEYS.settings,
  );
  if (!raw) {
    return null;
  }

  try {
    const migrated = migrateLegacySettings(raw);
    return {
      ...migrated,
      breaks: applySmartBreakIntervals(migrated.breaks),
    };
  } catch {
    return null;
  }
};
