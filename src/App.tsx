import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { BuddyCharacter } from "./components/BuddyCharacter";
import { BreakToast } from "./components/BreakToast";
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
import type { ToastState } from "./types/toast";
import "./App.css";

type Emotion = "idle" | "nudging" | "happy" | "concerned" | "sleeping";

type BreakState = {
  nextDueAt: number;
};

const TOAST_TIMEOUT_MS = 15_000;

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
    }),
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFullscreenSuppressed, setIsFullscreenSuppressed] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);
  const [dismissStreak, setDismissStreak] = useState(0);
  const [happyUntil, setHappyUntil] = useState<number | null>(null);

  const isPaused = dnd || (snoozeUntil !== null && snoozeUntil > Date.now());
  const isSuppressed = settings.autoPauseFullscreen && isFullscreenSuppressed;

  const expansionMode = toast !== null ? "toast" : "compact";

  useSettingsSync({ settings, setSettings });
  useWindowPersistence({ appWindow, expansionMode, setSettings });
  useBreakReminderScheduler({
    breakStates,
    setBreakStates,
    settings,
    isPaused,
    isSuppressed,
    toast,
    setToast,
  });
  useWorkReminderScheduler({
    workStartTime: settings.workStartTime,
    workEndTime: settings.workEndTime,
    mute: settings.mute,
    isPaused,
    isSuppressed,
    toast,
    setToast,
  });

  useCustomReminderScheduler({
    settings,
    setSettings,
    mute: settings.mute,
    isPaused,
    isSuppressed,
    toast,
    setToast,
  });

  const emotion: Emotion = useMemo(() => {
    if (isPaused || isSuppressed) {
      return "sleeping";
    }
    if (happyUntil !== null && happyUntil > Date.now()) {
      return "happy";
    }
    if (dismissStreak >= 3) {
      return "concerned";
    }
    if (toast) {
      return "nudging";
    }
    return "idle";
  }, [dismissStreak, happyUntil, isPaused, isSuppressed, toast]);

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
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (toast.kind === "break") {
        setDismissStreak((prev) => prev + 1);
        setBreakStates((prev) => ({
          ...prev,
          [toast.breakType]: {
            nextDueAt: nextDueTimestamp(
              toast.breakType,
              settings.breaks[toast.breakType].intervalMinutes,
            ),
          },
        }));
      }
      setToast(null);
    }, TOAST_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [settings.breaks, toast]);

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

  const resetTimerFor = useCallback(
    (breakType: BreakType) => {
      setBreakStates((prev) => ({
        ...prev,
        [breakType]: {
          nextDueAt: nextDueTimestamp(
            breakType,
            settings.breaks[breakType].intervalMinutes,
          ),
        },
      }));
    },
    [settings.breaks],
  );

  const dismissToast = useCallback(() => {
    if (!toast) {
      return;
    }
    if (toast.kind === "work-reminder" || toast.kind === "custom-reminder") {
      setToast(null);
      return;
    }
    setDismissStreak((prev) => prev + 1);
    resetTimerFor(toast.breakType);
    setToast(null);
  }, [resetTimerFor, toast]);

  const completeToast = useCallback(() => {
    if (!toast) {
      return;
    }
    if (toast.kind === "work-reminder" || toast.kind === "custom-reminder") {
      setHappyUntil(Date.now() + 4_000);
      setToast(null);
      return;
    }
    setDismissStreak(0);
    setHappyUntil(Date.now() + 4_000);
    resetTimerFor(toast.breakType);
    setToast(null);
  }, [resetTimerFor, toast]);

  const snooze = useCallback((minutes: number) => {
    setDnd(false);
    setSnoozeUntil(Date.now() + minutes * 60_000);
    setToast(null);
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
      <div className="absolute bottom-0 left-0 flex h-[84px] w-[84px] items-center justify-center">
        <div ref={buddyRef} className="relative">
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
                    { id: "snooze30", text: "Snooze 30m", action: () => snooze(30) },
                    { id: "snooze60", text: "Snooze 1h", action: () => snooze(60) },
                    { 
                      id: "dnd", 
                      text: dnd ? "Disable DND" : "Enable DND", 
                      action: () => {
                        setDnd((prev) => !prev);
                        setSnoozeUntil(null);
                        setToast(null);
                      }
                    },
                    { id: "settings", text: "Open settings", action: () => void openSettingsWindow() },
                    { id: "quit", text: "Quit Lory", action: async () => await exit(0) },
                  ],
                });
                await menu.popup();
              })();
            }}
          />
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-[84px] left-0 ml-2 mb-2">
          <BreakToast
            breakType={toast.kind === "break" ? toast.breakType : "work"}
            label={
              toast.kind === "break"
                ? BREAK_META[toast.breakType].label
                : toast.label
            }
            action={
              toast.kind === "break"
                ? BREAK_META[toast.breakType].action
                : toast.action
            }
            message={toast.message}
            onDone={completeToast}
            onDismiss={dismissToast}
          />
        </div>
      )}
    </div>
  );
}

export default App;
