import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { emit, listen } from "@tauri-apps/api/event";
import type { AppSettings } from "../lib/buddyConfig";
import { SQLITE_KEYS, writeSqliteJson } from "../lib/sqliteStorage";

export const SETTINGS_EVENT = "buddy-settings-updated";

export type SettingsSyncPayload = {
  settings: AppSettings;
  origin: "main" | "settings";
};

type UseSettingsSyncParams = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
  origin: "main" | "settings";
  isReady: boolean;
};

export const useSettingsSync = ({
  settings,
  setSettings,
  origin,
  isReady,
}: UseSettingsSyncParams): void => {
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    const syncSettings = async () => {
      await writeSqliteJson(SQLITE_KEYS.settings, settings);
      await emit(SETTINGS_EVENT, {
        settings,
        origin,
      } satisfies SettingsSyncPayload);
    };

    void syncSettings();
  }, [isReady, origin, settings]);

  useEffect(() => {
    const unlistenPromise = listen<SettingsSyncPayload>(
      SETTINGS_EVENT,
      (event) => {
        if (event.payload.origin === origin) {
          return;
        }

        skipPersistRef.current = true;
        setSettings(event.payload.settings);
      },
    );

    return () => {
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, [origin, setSettings]);
};
