import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import Appbar from "../components/sidebar/app-bar";
import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { type AppSettings, type BuddySkin } from "../lib/buddyConfig";
import {
  readInitialSettings,
  readPersistedSettings,
} from "../lib/settingsStorage";
import { useSettingsSync } from "../hooks/useSettingsSync";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { AuthGate } from "../components/auth/auth-gate";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const currentWindow = getCurrentWindow();
    if (currentWindow.label !== "settings") {
      throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});

type AppContextType = {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
};

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppLayout");
  }
  return context;
}

const skinSwatchClass: Record<BuddySkin, string> = {
  sunny: "bg-gradient-to-br from-amber-200 to-orange-300",
  mint: "bg-gradient-to-br from-emerald-100 to-emerald-300",
  sky: "bg-gradient-to-br from-sky-100 to-blue-300",
  rose: "bg-gradient-to-br from-pink-100 to-rose-300",
  lavender: "bg-gradient-to-br from-purple-100 to-purple-300",
  peach: "bg-gradient-to-br from-orange-100 to-red-200",
  slate: "bg-gradient-to-br from-slate-200 to-slate-400",
  charcoal: "bg-gradient-to-br from-zinc-700 to-zinc-900",
};

function AppLayout() {
  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  const appContextValue = useMemo(
    () => ({ settings, setSettings, skinSwatchClass }),
    [settings],
  );

  useSettingsSync({
    settings,
    setSettings,
    origin: "settings",
    isReady: settingsHydrated,
  });

  useEffect(() => {
    const hydrateSettings = async () => {
      const persisted = await readPersistedSettings();
      if (persisted) {
        setSettings(persisted);
      }
      setSettingsHydrated(true);
    };

    void hydrateSettings();
  }, []);

  return (
    <AuthGate>
      <AppContext.Provider value={appContextValue}>
        <Appbar>
          <Outlet />
        </Appbar>
      </AppContext.Provider>
    </AuthGate>
  );
}
