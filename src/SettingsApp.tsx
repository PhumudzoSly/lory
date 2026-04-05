import { useEffect, useMemo, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { load as loadStore } from "@tauri-apps/plugin-store";
import {
  BUDDY_SKINS,
  buildDefaultSettings,
  type AppSettings,
  type BuddySkin,
} from "./lib/buddyConfig";
import { WorkSettings } from "./components/WorkSettings";
import { WellbeingSettings } from "./components/WellbeingSettings";
import { ReminderSettings } from "./components/ReminderSettings";

type SettingsSection =
  | "work"
  | "wellbeing"
  | "customization"
  | "reminders"
  | "about";

const APP_STORAGE_KEY = "Lory.settings.v1";
const STORE_FILE = "Lory.json";
const STORE_SETTINGS_KEY = "settings.data";

const NAV_ITEMS: Array<{ id: SettingsSection; label: string; icon: string }> = [
  { id: "work", label: "Work", icon: "laptop" },
  { id: "wellbeing", label: "Wellbeing", icon: "self_care" },
  { id: "customization", label: "Customization", icon: "palette" },
  { id: "reminders", label: "Reminders", icon: "alarm" },
  { id: "about", label: "About", icon: "info" },
];

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
  const appWindow = useMemo(() => getCurrentWindow(), []);
  const [section, setSection] = useState<SettingsSection>("work");
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

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-emerald-50 dark:bg-slate-950 flex flex-col py-8 gap-y-6 z-40">
        <div className="px-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-teal-900 dark:text-teal-100 font-headline tracking-tighter">
                Lory
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-teal-700/60 font-medium">
                Work Smart
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSection(item.id);
              }}
              className={[
                "flex items-center px-8 py-3 gap-4 font-bold transition-transform duration-500",
                section === item.id
                  ? "text-teal-900 dark:text-teal-50 border-r-4 border-teal-500 hover:translate-x-1"
                  : "text-teal-700/50 dark:text-teal-400/50 hover:translate-x-1",
              ].join(" ")}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-manrope text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto px-8 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-100/30 dark:bg-slate-900/50">
            <p className="text-xs font-medium text-teal-800/70 mb-2">
              Focus Score
            </p>
            <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-4/5"></div>
            </div>
          </div>

          <button
            onClick={() => void appWindow.hide()}
            className="w-full text-center text-sm font-semibold text-teal-800/70 hover:text-teal-900 transition-colors"
          >
            Close Settings
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-12">
        {section === "work" && (
          <WorkSettings settings={settings} setSettings={setSettings} />
        )}

        {section === "wellbeing" && (
          <WellbeingSettings settings={settings} setSettings={setSettings} />
        )}

        {section === "customization" && (
          <>
            <header className="mb-12 max-w-4xl">
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
                Customization
              </h2>
              <p className="text-on-surface-variant text-lg">
                Personalize your Lory buddy.
              </p>
            </header>
            <div className="grid gap-6 max-w-4xl">
              <div className="bg-surface-container-low p-6 rounded-xl">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Buddy Identity
                </h3>
                <label className="block">
                  <span className="block text-sm font-semibold mb-2">
                    Buddy name
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-md focus:ring-2 focus:ring-primary/20 p-3 font-medium"
                    type="text"
                    value={settings.buddyName}
                    maxLength={24}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        buddyName:
                          event.target.value.trimStart().slice(0, 24) || "Lory",
                      }))
                    }
                  />
                </label>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Buddy Look
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {BUDDY_SKINS.map((skin) => (
                    <button
                      key={skin.id}
                      type="button"
                      className={[
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        settings.buddySkin === skin.id
                          ? "border-primary bg-surface-container-lowest shadow-sm"
                          : "border-transparent bg-surface-container-lowest hover:bg-surface-container-high",
                      ].join(" ")}
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          buddySkin: skin.id as BuddySkin,
                        }))
                      }
                    >
                      <span
                        className={`h-8 w-8 rounded-full border border-outline/20 ${skinSwatchClass[skin.id]}`}
                      />
                      <span className="font-bold">{skin.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {section === "reminders" && (
          <ReminderSettings settings={settings} setSettings={setSettings} />
        )}

        {section === "about" && (
          <header className="mb-12 max-w-4xl">
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              About
            </h2>
            <p className="text-on-surface-variant text-lg">
              Lory v0.1.0. Built with ❤️ by Phumuzo. This project is open source
              on{" "}
              <a
                href="https://github.com/PhumudzoSly/lory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </p>
          </header>
        )}
      </main>
    </div>
  );
}
