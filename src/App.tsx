import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { emit } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { BuddyCharacter } from "./components/BuddyCharacter";
import {
  BREAK_META,
  nextDueTimestamp,
  type AppSettings,
  type BreakType,
  type PendingAction,
} from "./lib/buddyConfig";
import { readInitialSettings } from "./lib/settingsStorage";
import { useSettingsSync } from "./hooks/useSettingsSync";
import { useWindowPersistence } from "./hooks/useWindowPersistence";
import { useBreakReminderScheduler } from "./hooks/useBreakReminderScheduler";
import { useWorkReminderScheduler } from "./hooks/useWorkReminderScheduler";
import { useCustomReminderScheduler } from "./hooks/useCustomReminderScheduler";
import { useAfterHoursScheduler } from "./hooks/useAfterHoursScheduler";
import { useAutomaticWorkLog } from "./hooks/useAutomaticWorkLog";
import { requestNotificationPermissions } from "./lib/notification";
import "./App.css";

type Emotion = "idle" | "sleeping" | "concerned" | "nudging";
type TargetSection =
  | "work"
  | "wellbeing"
  | "customization"
  | "reminders"
  | "about";

type BreakState = {
  nextDueAt: number;
};

function App() {
  const localDateKey = useCallback((value = new Date()): string => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

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

  const upsertPendingAction = useCallback(
    (action: Omit<PendingAction, "id" | "createdAt" | "lastTriggeredAt">) => {
      const now = Date.now();
      setSettings((prev) => {
        const existing = prev.pendingActions.find(
          (item) => item.dedupeKey === action.dedupeKey,
        );

        if (existing) {
          return {
            ...prev,
            pendingActions: prev.pendingActions.map((item) =>
              item.dedupeKey === action.dedupeKey
                ? {
                    ...item,
                    ...action,
                    lastTriggeredAt: now,
                  }
                : item,
            ),
          };
        }

        return {
          ...prev,
          pendingActions: [
            {
              ...action,
              id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: now,
              lastTriggeredAt: now,
            },
            ...prev.pendingActions,
          ].slice(0, 25),
        };
      });
    },
    [setSettings],
  );

  const isPaused = dnd || (snoozeUntil !== null && snoozeUntil > Date.now());
  const isSuppressed = settings.autoPauseFullscreen && isFullscreenSuppressed;

  const pendingActions = useMemo(
    () =>
      [...settings.pendingActions].sort((a, b) => {
        if (a.severity !== b.severity) {
          return b.severity - a.severity;
        }
        const sourceRank: Record<PendingAction["source"], number> = {
          break: 0,
          work: 1,
          custom: 2,
          afterHours: 3,
        };
        if (sourceRank[a.source] !== sourceRank[b.source]) {
          return sourceRank[a.source] - sourceRank[b.source];
        }
        return b.lastTriggeredAt - a.lastTriggeredAt;
      }),
    [settings.pendingActions],
  );

  const topPendingAction = pendingActions[0];
  const pendingCount = pendingActions.length;

  const emotion: Emotion = useMemo(() => {
    if (isPaused || isSuppressed) {
      return "sleeping";
    }
    if (pendingCount === 0) {
      return "idle";
    }
    const oldestMs =
      Date.now() - Math.min(...pendingActions.map((item) => item.createdAt));
    if (pendingCount >= 3 || oldestMs >= 15 * 60_000) {
      return "nudging";
    }
    return "concerned";
  }, [isPaused, isSuppressed, pendingActions, pendingCount]);

  useSettingsSync({ settings, setSettings });
  useWindowPersistence({ appWindow, setSettings });
  useAutomaticWorkLog({ settings, setSettings });

  // Request notification permissions on app load
  useEffect(() => {
    void requestNotificationPermissions();
  }, []);
  useBreakReminderScheduler({
    breakStates,
    setBreakStates,
    settings,
    setSettings,
    isPaused,
    isSuppressed,
    onBreakTriggered: (breakType) => {
      const meta = BREAK_META[breakType];

      upsertPendingAction({
        dedupeKey: `break:${breakType}`,
        source: "break",
        title: meta.label,
        description: meta.action,
        severity: meta.priority === 3 ? 3 : meta.priority === 2 ? 2 : 1,
        targetSection: "reminders",
        targetId: breakType,
      });
    },
  });
  useWorkReminderScheduler({
    workStartTime: settings.workStartTime,
    workEndTime: settings.workEndTime,
    workDays: settings.workDays,
    mute: settings.mute,
    isPaused,
    isSuppressed,
    onWorkReminderTriggered: (milestone) => {
      const labels: Record<0 | 15 | 30, string> = {
        30: "Workday Check-In",
        15: "Almost Done",
        0: "Clock-Out Time",
      };

      upsertPendingAction({
        dedupeKey: `work:${milestone}:${localDateKey()}`,
        source: "work",
        title: labels[milestone],
        description:
          milestone === 0
            ? "Your workday ended. Confirm your next action."
            : `Work reminder for ${milestone} minute milestone.`,
        severity: milestone === 0 ? 2 : 1,
        targetSection: "reminders",
      });
    },
  });
  useCustomReminderScheduler({
    settings,
    setSettings,
    mute: settings.mute,
    isPaused,
    isSuppressed,
    onCustomReminderTriggered: (reminder, milestone) => {
      upsertPendingAction({
        dedupeKey: `custom:${reminder.id}:${milestone}:${localDateKey()}`,
        source: "custom",
        title: reminder.title,
        description:
          milestone === 0
            ? "Custom reminder is due now."
            : `Custom reminder milestone at ${milestone} minutes.`,
        severity: milestone === 0 ? 2 : 1,
        targetSection: "reminders",
        targetId: reminder.id,
      });
    },
  });
  useAfterHoursScheduler({
    settings,
    mute: settings.mute,
    isPaused,
    isSuppressed,
    onAfterHoursTriggered: (payload) => {
      upsertPendingAction({
        dedupeKey: `after-hours:${payload.id}:${localDateKey()}`,
        source: "afterHours",
        title: payload.title,
        description: payload.description,
        severity: payload.severity,
        targetSection: "wellbeing",
      });
    },
  });

  const openSettingsWindow = useCallback(
    async (targetSection?: TargetSection) => {
      const payload = {
        section: targetSection ?? "work",
        pendingActionId: topPendingAction?.id,
      };

      const existing = await WebviewWindow.getByLabel("settings");
      if (existing) {
        await existing.show();
        await existing.setFocus();
        await emit("buddy-open-target", payload);
        return;
      }

      const params = new URLSearchParams();
      params.set("section", payload.section);
      if (payload.pendingActionId) {
        params.set("pendingActionId", payload.pendingActionId);
      }

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
    [topPendingAction?.id],
  );

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
            pendingCount={pendingCount}
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
              if (topPendingAction) {
                void openSettingsWindow(topPendingAction.targetSection);
                return;
              }
              void openSettingsWindow();
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              void (async () => {
                const { Menu } = await import("@tauri-apps/api/menu");
                const { exit } = await import("@tauri-apps/plugin-process");
                const pendingMenuItem = topPendingAction
                  ? [
                      {
                        id: "resolve-top",
                        text: `Resolve: ${topPendingAction.title}`,
                        action: () =>
                          void openSettingsWindow(
                            topPendingAction.targetSection,
                          ),
                      },
                    ]
                  : [];

                const menu = await Menu.new({
                  items: [
                    ...pendingMenuItem,
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
