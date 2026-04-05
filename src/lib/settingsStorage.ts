import { buildDefaultSettings, type AppSettings } from "./buddyConfig";

export const APP_STORAGE_KEY = "Lory.settings.v1";

export const readInitialSettings = (): AppSettings => {
  const fallback = buildDefaultSettings();
  const raw = window.localStorage.getItem(APP_STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    return { ...fallback, ...JSON.parse(raw) } as AppSettings;
  } catch {
    return fallback;
  }
};
