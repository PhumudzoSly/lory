import { buildDefaultSettings, migrateLegacySettings, type AppSettings } from "./buddyConfig";

export const APP_STORAGE_KEY = "Lory.settings.v1";

export const readInitialSettings = (): AppSettings => {
  const raw = window.localStorage.getItem(APP_STORAGE_KEY);
  if (!raw) {
    return buildDefaultSettings();
  }

  try {
    return migrateLegacySettings(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return buildDefaultSettings();
  }
};
