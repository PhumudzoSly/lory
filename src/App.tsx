import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { BuddyCharacter } from "./components/BuddyCharacter";
import {
  BREAK_META,
  nextDueTimestamp,
  type AppSettings,
  type BreakType,
} from "./lib/buddyConfig";
import { readInitialSettings } from "./lib/settingsStorage";
import { useSettingsSync } from "./hooks/useSettingsSync";
import { useWindowPersistence } from "./hooks/useWindowPersistence";
import { useBreakReminderScheduler } from "./hooks/useBreakReminderScheduler";
import { useWorkReminderScheduler } from "./hooks/useWorkReminderScheduler";
import { useCustomReminderScheduler } from "./hooks/useCustomReminderScheduler";
import { useAutomaticWorkLog } from "./hooks/useAutomaticWorkLog";
import "./App.css";

type Emotion = "idle" | "sleeping";

type BreakState = {
  nextDueAt: number;
};

function App() {
  const appWindow = useMemo(() => getCurrentWindow(), []);
  const buddyRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    x: number;
    y: number;
    dragging: boolean;
  } | null>(null);

  const [settings, setSettings] = useState<AppSettings>(readInitialSettings);
  const [breakStates, setBreakStates] = useState<Record<BreakType, BreakState>>(
    () => ({
      eye: {
        nextDueAt: nextDueTimestamp("eye", BREAK_META.eye.defaultMinutes),
      },
      hydrate: {
        nextDueAt: nextDueTimestamp(
          "hydrate",
          BREAK_META.hydrate.defaultMinutes,
        ),
      },
      stretch: {
        nextDueAt: nextDueTimestamp(
          "stretch",
          BREAK_META.stretch.defaultMinutes,
        ),
      },
      full: {
        nextDueAt: nextDueTimestamp("full", BREAK_META.full.defaultMinutes),
      },
      posture: {
        nextDueAt: nextDueTimestamp(
          "posture",
          BREAK_META.posture.defaultMinutes,
        ),
      },
      mindfulness: {
        nextDueAt: nextDueTimestamp(
          "mindfulness",
          BREAK_META.mindfulness.defaultMinutes,
        ),
      },
      wrist: {
        nextDueAt: nextDueTimestamp("wrist", BREAK_META.wrist.defaultMinutes),
      },
    }),
  );

  const [isFullscreenSuppressed, setIsFullscreenSuppressed] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);

  const isPaused = dnd || (snoozeUntil !== null && snoozeUntil > Date.now());
  const isSuppressed = settings.autoPauseFullscreen && isFullscreenSuppressed;

  const emotion: Emotion = isPaused || isSuppressed ? "sleeping" : "idle";

  useSettingsSync({ settings, setSettings });
  useWindowPersistence({ appWindow, setSettings });
  useAutomaticWorkLog({ settings, setSettings });
  useBreakReminderScheduler({
    breakStates,
    setBreakStates,
    settings,
    isPaused,
    isSuppressed,
  });
  useWorkReminderScheduler({
    workStartTime: settings.workStartTime,
    workEndTime: settings.workEndTime,
    workDays: settings.workDays,
    mute: settings.mute,
    isPaused,
    isSuppressed,
  });
  useCustomReminderScheduler({
    settings,
    setSettings,
    mute: settings.mute,
    isPaused,
    isSuppressed,
  });

  const openSettingsWindow = useCallback(async () => {
    const existing = await WebviewWindow.getByLabel("settings");
    if (existing) {
      await existing.show();
      await existing.setFocus();
      return;
    }

    const settingsWindow = new WebviewWindow("settings", {
      title: "Lory Settings",
      url: "/settings.html",
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
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreenSuppressed(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (snoozeUntil === null) {
      return;
    }
    const timeoutId = window.setInterval(() => {
      if (Date.now() > snoozeUntil) {
        setSnoozeUntil(null);
      }
    }, 1_000);
    return () => window.clearInterval(timeoutId);
  }, [snoozeUntil]);

  const snooze = useCallback((minutes: number) => {
    setDnd(false);
    setSnoozeUntil(Date.now() + minutes * 60_000);
  }, []);

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
    window.setTimeout(() => {
      dragStateRef.current = null;
    }, 0);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center">
        <div ref={buddyRef} className="relative h-14 w-14">
          <BuddyCharacter
            emotion={emotion}
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
              void openSettingsWindow();
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              void (async () => {
                const { Menu } = await import("@tauri-apps/api/menu");
                const { exit } = await import("@tauri-apps/plugin-process");
                const menu = await Menu.new({
                  items: [
                    {
                      id: "snooze30",
                      text: "Snooze 30m",
                      action: () => snooze(30),
                    },
                    {
                      id: "snooze60",
                      text: "Snooze 1h",
                      action: () => snooze(60),
                    },
                    {
                      id: "dnd",
                      text: dnd ? "Disable DND" : "Enable DND",
                      action: () => {
                        setDnd((prev) => !prev);
                        setSnoozeUntil(null);
                      },
                    },
                    {
                      id: "settings",
                      text: "Open settings",
                      action: () => void openSettingsWindow(),
                    },
                    {
                      id: "quit",
                      text: "Quit Lory",
                      action: async () => await exit(0),
                    },
                  ],
                });
                await menu.popup();
              })();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
