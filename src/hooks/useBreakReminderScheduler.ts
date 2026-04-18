import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BREAK_META,
  nextDueTimestamp,
  type AppSettings,
  type BreakType,
  type WorkDay,
} from "../lib/buddyConfig";
import { playChime } from "../lib/sound";
import { sendNativeNotification } from "../lib/notification";
import {
  buildBreakNotification,
  SAFETY_DEFER_MS,
  selectBreakBatch,
} from "../lib/breakSchedulingEngine";

const WORKDAY_TO_INDEX: Record<WorkDay, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

type BreakState = {
  nextDueAt: number;
};

type UseBreakReminderSchedulerParams = {
  breakStates: Record<BreakType, BreakState>;
  setBreakStates: Dispatch<SetStateAction<Record<BreakType, BreakState>>>;
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
  isPaused: boolean;
  isSuppressed: boolean;
  onBreakTriggered?: (breakTypes: BreakType[]) => void;
};

export const useBreakReminderScheduler = ({
  breakStates,
  setBreakStates,
  settings,
  setSettings,
  isPaused,
  isSuppressed,
  onBreakTriggered,
}: UseBreakReminderSchedulerParams): void => {
  useEffect(() => {
    const tick = window.setInterval(() => {
      if (isPaused || isSuppressed) {
        return;
      }

      // Only fire wellbeing reminders during work hours
      const nowDate = new Date();
      const dayIndex = nowDate.getDay();
      const isWorkDay = settings.workDays.some(
        (wd) => WORKDAY_TO_INDEX[wd] === dayIndex,
      );
      if (!isWorkDay) {
        return;
      }

      const [startHour, startMinute] = settings.workStartTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = settings.workEndTime.split(":").map(Number);
      const workStart = new Date(nowDate);
      workStart.setHours(startHour, startMinute, 0, 0);
      const workEnd = new Date(nowDate);
      workEnd.setHours(endHour, endMinute, 0, 0);

      if (
        workEnd.getTime() <= workStart.getTime() ||
        nowDate.getTime() < workStart.getTime() ||
        nowDate.getTime() > workEnd.getTime()
      ) {
        return;
      }

      const now = Date.now();
      const enabledBreaks = (Object.keys(BREAK_META) as BreakType[])
        .filter((breakType) => settings.breaks[breakType].enabled)
        .sort((a, b) => breakStates[a].nextDueAt - breakStates[b].nextDueAt);

      const due = enabledBreaks.filter(
        (breakType) => breakStates[breakType].nextDueAt <= now,
      );

      if (due.length === 0) {
        return;
      }

      const batch = selectBreakBatch({
        now,
        due,
        enabled: enabledBreaks,
        nextDueAt: Object.fromEntries(
          enabledBreaks.map((breakType) => [
            breakType,
            breakStates[breakType].nextDueAt,
          ]),
        ) as Record<BreakType, number>,
      });

      if (batch.triggered.length === 0) {
        return;
      }

      const notification = buildBreakNotification(batch.triggered);

      void sendNativeNotification(notification.title, notification.body);

      if (!settings.mute) {
        playChime();
      }

      setBreakStates((prev) => {
        const copy = { ...prev };
        for (const breakType of batch.triggered) {
          copy[breakType] = {
            nextDueAt: nextDueTimestamp(
              breakType,
              settings.breaks[breakType].intervalMinutes,
            ),
          };
        }
        for (const breakType of batch.deferred) {
          copy[breakType] = { nextDueAt: now + SAFETY_DEFER_MS };
        }
        return copy;
      });

      // Record when this break last fired so the settings window can compute countdowns
      setSettings((prev) => ({
        ...prev,
        lastFiredAt: {
          ...prev.lastFiredAt,
          ...Object.fromEntries(
            batch.triggered.map((breakType) => [breakType, now]),
          ),
        },
      }));

      onBreakTriggered?.(batch.triggered);
    }, 1_000);

    return () => window.clearInterval(tick);
  }, [
    breakStates,
    isPaused,
    isSuppressed,
    settings,
    setBreakStates,
    setSettings,
    onBreakTriggered,
  ]);
};
