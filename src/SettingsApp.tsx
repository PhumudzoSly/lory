import { useEffect, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { load as loadStore } from "@tauri-apps/plugin-store";
import {
  buildDefaultSettings,
  type AppSettings,
  type BuddySkin,
} from "./lib/buddyConfig";
import Appbar from "./components/sidebar/app-bar";

const APP_STORAGE_KEY = "Lory.settings.v1";
const STORE_FILE = "Lory.json";
const STORE_SETTINGS_KEY = "settings.data";

function readInitialSettings(): AppSettings {
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
}

export default function SettingsApp() {
  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);

  useEffect(() => {
    const syncSettings = async () => {
      await emit("buddy-settings-updated", settings);
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(settings));
      const store = await loadStore(STORE_FILE, {
        defaults: {},
        autoSave: true,
      });
      await store.set(STORE_SETTINGS_KEY, settings);
    };
    void syncSettings();
  }, [settings]);

  const skinSwatchClass: Record<BuddySkin, string> = {
    sunny: "bg-gradient-to-br from-amber-200 to-orange-300",
    mint: "bg-gradient-to-br from-emerald-100 to-emerald-300",
    sky: "bg-gradient-to-br from-sky-100 to-blue-300",
    rose: "bg-gradient-to-br from-pink-100 to-rose-300",
  };

  return <Appbar settings={settings} setSettings={setSettings} skinSwatchClass={skinSwatchClass} />;
}
