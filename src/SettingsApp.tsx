import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { type AppSettings, type BuddySkin } from "./lib/buddyConfig";
import {
  readInitialSettings,
  readPersistedSettings,
} from "./lib/settingsStorage";
import { useSettingsSync } from "./hooks/useSettingsSync";
import Appbar from "./components/sidebar/app-bar";
import type { SidebarSection } from "./components/sidebar/app-sidebar";

export default function SettingsApp() {
  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);
  const [settingsHydrated, setSettingsHydrated] = useState(false);
  const [requestedSection, setRequestedSection] =
    useState<SidebarSection>("work");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  useSettingsSync({
    settings,
    setSettings,
    origin: "settings",
    isReady: settingsHydrated,
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const section = search.get("section");
    const pendingId = search.get("pendingActionId");
    const allowed: SidebarSection[] = [
      "work",
      "wellbeing",
      "customization",
      "reminders",
      "about",
    ];

    if (section && allowed.includes(section as SidebarSection)) {
      setRequestedSection(section as SidebarSection);
    }

    if (pendingId) {
      setPendingActionId(pendingId);
    }
  }, []);

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

  useEffect(() => {
    const unlistenTargetPromise = listen<{
      section?: SidebarSection;
      pendingActionId?: string;
    }>("buddy-open-target", (event) => {
      if (event.payload.section) {
        setRequestedSection(event.payload.section);
      }
      if (event.payload.pendingActionId) {
        setPendingActionId(event.payload.pendingActionId);
      }
    });

    return () => {
      void unlistenTargetPromise.then((unlisten) => unlisten());
    };
  }, []);

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

  return (
    <Appbar
      settings={settings}
      setSettings={setSettings}
      skinSwatchClass={skinSwatchClass}
      requestedSection={requestedSection}
      highlightedPendingActionId={pendingActionId}
      onPendingActionHandled={() => setPendingActionId(null)}
    />
  );
}
