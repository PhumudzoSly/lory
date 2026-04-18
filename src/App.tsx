import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { BuddyCharacter } from "./components/BuddyCharacter";
import { type AppSettings } from "./lib/buddyConfig";
import {
  readInitialSettings,
  readPersistedSettings,
} from "./lib/settingsStorage";
import { useSettingsSync } from "./hooks/useSettingsSync";
import { useWindowPersistence } from "./hooks/useWindowPersistence";
import "./App.css";

type TargetSection = "customization";

function App() {
  const appWindow = useMemo(() => getCurrentWindow(), []);
  const buddyRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    x: number;
    y: number;
    dragging: boolean;
  } | null>(null);

  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  useSettingsSync({
    settings,
    setSettings,
    origin: "main",
    isReady: settingsHydrated,
  });
  useWindowPersistence({ appWindow });

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

  const openSettingsWindow = useCallback(
    async (targetSection?: TargetSection) => {
      const payload = {
        section: targetSection ?? "customization",
      };

      const existing = await WebviewWindow.getByLabel("settings");
      if (existing) {
        await existing.show();
        await existing.setFocus();
        return;
      }

      const params = new URLSearchParams();
      params.set("section", payload.section);

      const settingsWindow = new WebviewWindow("settings", {
        title: "Lory Settings",
        url: `/settings.html?${params.toString()}`,
        width: 880,
        height: 560,
        minWidth: 760,
        minHeight: 480,
        resizable: true,
        center: true,
        decorations: true,
      });

      settingsWindow.once("tauri://created", () => {
        void settingsWindow.setFocus();
      });

      settingsWindow.once("tauri://error", (event) => {
        // eslint-disable-next-line no-console
        console.error("Failed to create settings window", event.payload);
      });
    },
    [],
  );

  const handleBuddyPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (event.button !== 0) {
      return;
    }
    dragStateRef.current = {
      x: event.clientX,
      y: event.clientY,
      dragging: false,
    };
  };

  const handleBuddyPointerMove = async (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = dragStateRef.current;
    if (!drag || drag.dragging) {
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) < 4) {
      return;
    }
    drag.dragging = true;
    await appWindow.startDragging();
  };

  const handleBuddyPointerUp = () => {
    globalThis.setTimeout(() => {
      dragStateRef.current = null;
    }, 0);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center">
        <div ref={buddyRef} className="relative h-14 w-14">
          <BuddyCharacter
            emotion="idle"
            pendingCount={0}
            onPointerDown={handleBuddyPointerDown}
            onPointerMove={(event) => {
              void handleBuddyPointerMove(event);
            }}
            onPointerUp={handleBuddyPointerUp}
            skin={settings.buddySkin}
            name={settings.buddyName}
            onClick={() => {
              if (dragStateRef.current?.dragging) {
                return;
              }
              void openSettingsWindow("customization");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
