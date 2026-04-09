import { useEffect, useState } from "react";
import { emit, listen } from "@tauri-apps/api/event";
import { load as loadStore } from "@tauri-apps/plugin-store";
import { type AppSettings, type BuddySkin } from "./lib/buddyConfig";
import { readInitialSettings } from "./lib/settingsStorage";
import Appbar from "./components/sidebar/app-bar";
import type { SidebarSection } from "./components/sidebar/app-sidebar";

const APP_STORAGE_KEY = "Lory.settings.v1";
const STORE_FILE = "Lory.json";
const STORE_SETTINGS_KEY = "settings.data";

export default function SettingsApp() {
  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);
  const [requestedSection, setRequestedSection] =
    useState<SidebarSection>("work");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

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

  // Pick up lastFiredAt updates written by the buddy window (separate WebviewWindow)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== APP_STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as Partial<AppSettings>;
        if (parsed.lastFiredAt) {
          setSettings((prev) => ({
            ...prev,
            lastFiredAt: parsed.lastFiredAt!,
          }));
        }
      } catch {
        // ignore malformed data
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const unlistenPromise = listen<{
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
      void unlistenPromise.then((unlisten) => unlisten());
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
