import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings, WorkDay } from "../lib/buddyConfig";
import { computeHours, DAY_NAMES } from "../lib/buddyConfig";

type UseAutomaticWorkLogParams = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const TIME_RE = /^\d{2}:\d{2}$/;

const WORKDAY_TO_INDEX: Record<WorkDay, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const computeCurrentHours = (
  now: Date,
  startTime: string,
  endTime: string,
): number => {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(now);
  end.setHours(endH, endM, 0, 0);

  // Invalid range
  if (end.getTime() <= start.getTime()) {
    return 0;
  }

  const nowTime = now.getTime();
  const startTime_ms = start.getTime();
  const endTime_ms = end.getTime();

  // Before work starts
  if (nowTime < startTime_ms) {
    return 0;
  }

  // After work ends
  if (nowTime >= endTime_ms) {
    return computeHours(startTime, endTime);
  }

  // During work window
  return Math.max(0, (nowTime - startTime_ms) / 3600000);
};

export const useAutomaticWorkLog = ({
  settings,
  setSettings,
}: UseAutomaticWorkLogParams): void => {
  const lastUpdateRef = useRef<string | null>(null);

  useEffect(() => {
    if (!settings.autoWorkLogging) {
      return;
    }

    const tick = () => {
      const { workStartTime, workEndTime, workDays } = settings;

      // Validate times
      if (
        !TIME_RE.test(workStartTime) ||
        !TIME_RE.test(workEndTime)
      ) {
        return;
      }

      const now = new Date();
      const todayISO = toISODate(now);
      const dayIndex = now.getDay();
      const dayName = DAY_NAMES[dayIndex] as WorkDay;

      // Check if today is a workday
      const isWorkDay = workDays.some(
        (wd) => WORKDAY_TO_INDEX[wd] === dayIndex,
      );

      if (!isWorkDay) {
        // Remove auto log for non-work day if exists
        setSettings((prev) => {
          const existing = prev.dailyLogs[todayISO];
          if (existing?.source === "auto") {
            const copy = { ...prev.dailyLogs };
            delete copy[todayISO];
            return { ...prev, dailyLogs: copy };
          }
          return prev;
        });
        lastUpdateRef.current = null;
        return;
      }

      // Compute current hours
      const hours = computeCurrentHours(now, workStartTime, workEndTime);

      // Only update if value changed (avoid unnecessary writes)
      const cacheKey = `${todayISO}:${hours.toFixed(2)}`;
      if (lastUpdateRef.current === cacheKey) {
        return;
      }

      lastUpdateRef.current = cacheKey;

      setSettings((prev) => {
        const existing = prev.dailyLogs[todayISO];

        // Don't overwrite manual entries (non-auto source)
        if (existing && existing.source !== "auto") {
          return prev;
        }

        // Update or create auto log
        return {
          ...prev,
          dailyLogs: {
            ...prev.dailyLogs,
            [todayISO]: {
              date: todayISO,
              day: dayName,
              startTime: workStartTime,
              endTime: workEndTime,
              hours,
              source: "auto",
            },
          },
        };
      });
    };

    // Initial tick
    tick();

    // Update every minute
    const intervalId = window.setInterval(tick, 60_000);

    return () => window.clearInterval(intervalId);
  }, [
    settings.autoWorkLogging,
    settings.workStartTime,
    settings.workEndTime,
    settings.workDays,
    setSettings,
  ]);
};
