import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { listen } from "@tauri-apps/api/event";
import type { AppSettings } from "../lib/buddyConfig";
import { APP_STORAGE_KEY } from "../lib/settingsStorage";

type UseSettingsSyncParams = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export const useSettingsSync = ({
  settings,
  setSettings,
}: UseSettingsSyncParams): void => {
  useEffect(() => {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const unlistenPromise = listen<AppSettings>(
      "buddy-settings-updated",
      (event) => {
        setSettings((prev) => ({ ...prev, ...event.payload }));
      },
    );

    return () => {
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, [setSettings]);
};
