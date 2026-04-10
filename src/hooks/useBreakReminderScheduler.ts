import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BREAK_META,
  getRandomMessage,
  nextDueTimestamp,
  type AppSettings,
  type BreakType,
  type WorkDay,
} from "../lib/buddyConfig";
import { playChime } from "../lib/sound";
import { sendNativeNotification } from "../lib/notification";

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
  onBreakTriggered?: (breakType: BreakType) => void;
};

const OVERLAP_DEFER_MS = 2 * 60 * 1_000;

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
      const due = (Object.keys(BREAK_META) as BreakType[])
        .filter((breakType) => settings.breaks[breakType].enabled)
        .filter((breakType) => breakStates[breakType].nextDueAt <= now)
        .sort((a, b) => {
          const prio = BREAK_META[b].priority - BREAK_META[a].priority;
          if (prio !== 0) {
            return prio;
          }
          return breakStates[a].nextDueAt - breakStates[b].nextDueAt;
        });

      if (due.length === 0) {
        return;
      }

      const nextType = due[0];
      const meta = BREAK_META[nextType];

      void sendNativeNotification(meta.label, getRandomMessage(nextType));

      if (!settings.mute) {
        playChime();
      }

      setBreakStates((prev) => {
        const copy = { ...prev };
        // Reset the fired break timer
        copy[nextType] = {
          nextDueAt: nextDueTimestamp(
            nextType,
            settings.breaks[nextType].intervalMinutes,
          ),
        };
        // Defer overlapping due breaks
        for (const breakType of due.slice(1)) {
          copy[breakType] = { nextDueAt: now + OVERLAP_DEFER_MS };
        }
        return copy;
      });

      // Record when this break last fired so the settings window can compute countdowns
      setSettings((prev) => ({
        ...prev,
        lastFiredAt: {
          ...prev.lastFiredAt,
          [nextType]: now,
        },
      }));

      onBreakTriggered?.(nextType);
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
