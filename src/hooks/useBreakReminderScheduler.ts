import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BREAK_META,
  getRandomMessage,
  type AppSettings,
  type BreakType,
} from "../lib/buddyConfig";
import { playChime } from "../lib/sound";
import type { ToastState } from "../types/toast";

type BreakState = {
  nextDueAt: number;
};

type UseBreakReminderSchedulerParams = {
  breakStates: Record<BreakType, BreakState>;
  setBreakStates: Dispatch<SetStateAction<Record<BreakType, BreakState>>>;
  settings: AppSettings;
  isPaused: boolean;
  isSuppressed: boolean;
  toast: ToastState | null;
  setToast: Dispatch<SetStateAction<ToastState | null>>;
};

const OVERLAP_DEFER_MS = 2 * 60 * 1_000;

export const useBreakReminderScheduler = ({
  breakStates,
  setBreakStates,
  settings,
  isPaused,
  isSuppressed,
  toast,
  setToast,
}: UseBreakReminderSchedulerParams): void => {
  useEffect(() => {
    const tick = window.setInterval(() => {
      if (isPaused || isSuppressed || toast) {
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
      setToast({
        kind: "break",
        breakType: nextType,
        message: getRandomMessage(nextType),
      });

      if (!settings.mute) {
        playChime();
      }

      setBreakStates((prev) => {
        const copy = { ...prev };
        for (const breakType of due.slice(1)) {
          copy[breakType] = { nextDueAt: now + OVERLAP_DEFER_MS };
        }
        return copy;
      });
    }, 1_000);

    return () => window.clearInterval(tick);
  }, [
    breakStates,
    isPaused,
    isSuppressed,
    settings,
    toast,
    setBreakStates,
    setToast,
  ]);
};
