import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  AppSettings,
  CustomReminder,
  CustomReminderHistoryEntry,
} from "../lib/buddyConfig";
import { playChime } from "../lib/sound";
import { sendNativeNotification } from "../lib/notification";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit } from "@tauri-apps/api/event";

type UseCustomReminderSchedulerParams = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
  mute: boolean;
  isPaused: boolean;
  isSuppressed: boolean;
  onCustomReminderTriggered?: (
    reminder: CustomReminder,
    milestone: 30 | 15 | 0,
  ) => void;
};

const REMINDER_MILESTONES: Array<30 | 15 | 0> = [30, 15, 0];

// Grace window so a reminder whose scheduled time just passed (within one polling
// interval) still fires instead of being silently skipped.
const PAST_GRACE_MS = 10_000;

const buildDateAtTime = (baseDate: Date, time: string): Date => {
  const [hour, minute] = time.split(":").map(Number);
  const target = new Date(baseDate);
  target.setHours(hour, minute, 0, 0);
  return target;
};

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const shouldRunToday = (reminder: CustomReminder, now: Date): boolean => {
  if (reminder.scheduleType !== "daily") {
    return true;
  }

  if (reminder.days.includes("Every day")) {
    return true;
  }

  const todayName = now.toLocaleDateString("en-US", { weekday: "short" });
  return reminder.days.includes(todayName);
};

const nextOccurrenceForReminder = (
  reminder: CustomReminder,
  now: Date,
): Date | null => {
  if (reminder.scheduleType === "once") {
    if (!reminder.onceDate) {
      return null;
    }

    const [year, month, day] = reminder.onceDate.split("-").map(Number);
    const target = new Date(now);
    target.setFullYear(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    return buildDateAtTime(target, reminder.time);
  }

  if (reminder.scheduleType === "interval") {
    const every = Math.max(1, reminder.intervalMinutes ?? 60);
    const intervalMs = every * 60_000;
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);

    const elapsed = now.getTime() - dayStart.getTime();
    const nextSlot = Math.ceil(elapsed / intervalMs) * intervalMs;

    return new Date(dayStart.getTime() + nextSlot);
  }

  if (!shouldRunToday(reminder, now)) {
    return null;
  }

  return buildDateAtTime(now, reminder.time);
};

const appendHistory = (
  setSettings: Dispatch<SetStateAction<AppSettings>>,
  reminder: CustomReminder,
  action: string,
): void => {
  const entry: CustomReminderHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reminderId: reminder.id,
    title: reminder.title,
    action,
    triggeredAtIso: new Date().toISOString(),
  };

  setSettings((prev) => ({
    ...prev,
    customReminderHistory: [entry, ...prev.customReminderHistory].slice(0, 80),
  }));
};

const focusOrCreateSettingsWindow = (): void => {
  void WebviewWindow.getByLabel("settings").then((existing) => {
    if (existing) {
      void existing.show();
      void existing.setFocus();
      void emit("buddy-open-target", { section: "reminders" });
      return;
    }

    const params = new URLSearchParams();
    params.set("section", "reminders");

    const settingsWindow = new WebviewWindow("settings", {
      title: "Lory Settings",
      url: `/settings.html?${params.toString()}`,
      width: 1000,
      height: 700,
      center: true,
    });

    settingsWindow.once("tauri://created", () => {
      void settingsWindow.setFocus();
    });
  });
};

export const useCustomReminderScheduler = ({
  settings,
  setSettings,
  mute,
  isPaused,
  isSuppressed,
  onCustomReminderTriggered,
}: UseCustomReminderSchedulerParams): void => {
  const dayKeyRef = useRef(localDateKey(new Date()));
  const sentMilestonesRef = useRef<Record<string, Record<number, boolean>>>({});
  const previousMinutesLeftRef = useRef<Record<string, number | null>>({});

  useEffect(() => {
    const tick = window.setInterval(() => {
      const now = new Date();
      const currentDayKey = localDateKey(now);

      if (dayKeyRef.current !== currentDayKey) {
        dayKeyRef.current = currentDayKey;
        sentMilestonesRef.current = {};
        previousMinutesLeftRef.current = {};
      }

      if (isPaused || isSuppressed) {
        return;
      }

      const enabledReminders = settings.customReminders.filter(
        (r) => r.enabled,
      );

      for (const reminder of enabledReminders) {
        const nextOccurrence = nextOccurrenceForReminder(reminder, now);
        if (!nextOccurrence) {
          continue;
        }

        if (
          reminder.scheduleType === "daily" &&
          nextOccurrence.getTime() < now.getTime() - PAST_GRACE_MS
        ) {
          continue;
        }

        if (
          reminder.scheduleType === "once" &&
          nextOccurrence.getTime() < now.getTime() - PAST_GRACE_MS
        ) {
          setSettings((prev) => ({
            ...prev,
            customReminders: prev.customReminders.map((item) =>
              item.id === reminder.id ? { ...item, enabled: false } : item,
            ),
          }));
          continue;
        }

        const occurrenceKey = `${reminder.id}:${nextOccurrence.toISOString().slice(0, 16)}`;

        if (!sentMilestonesRef.current[occurrenceKey]) {
          sentMilestonesRef.current[occurrenceKey] = {
            30: false,
            15: false,
            0: false,
          };
          previousMinutesLeftRef.current[occurrenceKey] = null;
        }

        const minutesLeft = Math.max(
          0,
          Math.ceil((nextOccurrence.getTime() - now.getTime()) / 60_000),
        );

        const previous = previousMinutesLeftRef.current[occurrenceKey];

        for (const milestone of REMINDER_MILESTONES) {
          const alreadySent =
            sentMilestonesRef.current[occurrenceKey][milestone];
          const crossed =
            previous !== null &&
            previous > milestone &&
            minutesLeft <= milestone;
          const exact = previous === null && minutesLeft === milestone;

          if (alreadySent || (!crossed && !exact)) {
            continue;
          }

          sentMilestonesRef.current[occurrenceKey][milestone] = true;

          const selectedMessage =
            reminder.messages && reminder.messages.length > 0
              ? reminder.messages[
                  Math.floor(Math.random() * reminder.messages.length)
                ]
              : reminder.description;

          const notifTitle =
            milestone === 30
              ? `Upcoming: ${reminder.title}`
              : milestone === 15
                ? `Coming up: ${reminder.title}`
                : reminder.title;

          const notifBody =
            milestone === 30
              ? `${reminder.title} in 30 minutes.`
              : milestone === 15
                ? `${reminder.title} in 15 minutes.`
                : `It's time. ${selectedMessage}`;

          void sendNativeNotification(notifTitle, notifBody);
          onCustomReminderTriggered?.(reminder, milestone);

          if (!mute) {
            playChime();
          }

          if (milestone === 0) {
            appendHistory(setSettings, reminder, "Now");
            focusOrCreateSettingsWindow();

            if (reminder.scheduleType === "once") {
              setSettings((prev) => ({
                ...prev,
                customReminders: prev.customReminders.map((item) =>
                  item.id === reminder.id ? { ...item, enabled: false } : item,
                ),
              }));
            }
          }

          previousMinutesLeftRef.current[occurrenceKey] = minutesLeft;
          return;
        }

        previousMinutesLeftRef.current[occurrenceKey] = minutesLeft;
      }
    }, 5_000);

    return () => window.clearInterval(tick);
  }, [
    isPaused,
    isSuppressed,
    mute,
    setSettings,
    settings.customReminders,
    onCustomReminderTriggered,
  ]);
};
