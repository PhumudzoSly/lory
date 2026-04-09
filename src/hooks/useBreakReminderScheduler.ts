import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BREAK_META,
  getRandomMessage,
  nextDueTimestamp,
  type AppSettings,
  type BreakType,
} from "../lib/buddyConfig";
import { playChime } from "../lib/sound";
import { sendNativeNotification } from "../lib/notification";

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
