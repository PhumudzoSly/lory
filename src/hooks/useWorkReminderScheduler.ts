import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ToastState, WorkReminderMilestone } from "../types/toast";
import {
  WORK_REMINDER_MILESTONES,
  createWorkReminderToast,
  localDateKey,
} from "../lib/workReminders";
import { playChime } from "../lib/sound";

type UseWorkReminderSchedulerParams = {
  workStartTime: string;
  workEndTime: string;
  mute: boolean;
  isPaused: boolean;
  isSuppressed: boolean;
  toast: ToastState | null;
  setToast: Dispatch<SetStateAction<ToastState | null>>;
};

export const useWorkReminderScheduler = ({
  workStartTime,
  workEndTime,
  mute,
  isPaused,
  isSuppressed,
  toast,
  setToast,
}: UseWorkReminderSchedulerParams): void => {
  const workReminderDayRef = useRef(localDateKey(new Date()));
  const workReminderSentRef = useRef<Record<WorkReminderMilestone, boolean>>({
    30: false,
    15: false,
    0: false,
  });
  const workReminderPendingRef = useRef<WorkReminderMilestone[]>([]);
  const previousWorkMinutesLeftRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const now = new Date();
      const todayKey = localDateKey(now);

      if (workReminderDayRef.current !== todayKey) {
        workReminderDayRef.current = todayKey;
        workReminderSentRef.current = { 30: false, 15: false, 0: false };
        workReminderPendingRef.current = [];
        previousWorkMinutesLeftRef.current = null;
      }

      const [startHour, startMinute] = workStartTime.split(":").map(Number);
      const [endHour, endMinute] = workEndTime.split(":").map(Number);

      const start = new Date(now);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(now);
      end.setHours(endHour, endMinute, 0, 0);

      if (end.getTime() <= start.getTime()) {
        previousWorkMinutesLeftRef.current = null;
        return;
      }

      const nowTime = now.getTime();
      const startTime = start.getTime();
      const endTime = end.getTime();

      if (nowTime < startTime || nowTime > endTime) {
        previousWorkMinutesLeftRef.current = null;
      } else {
        const currentMinutesLeft = Math.max(
          0,
          Math.ceil((endTime - nowTime) / 60_000),
        );
        const previous = previousWorkMinutesLeftRef.current;

        for (const milestone of WORK_REMINDER_MILESTONES) {
          const alreadySent = workReminderSentRef.current[milestone];
          const crossed =
            previous !== null &&
            previous > milestone &&
            currentMinutesLeft <= milestone;

          if (alreadySent || !crossed) {
            continue;
          }

          if (!workReminderPendingRef.current.includes(milestone)) {
            workReminderPendingRef.current.push(milestone);
          }
        }

        previousWorkMinutesLeftRef.current = currentMinutesLeft;
      }

      if (toast || isPaused || isSuppressed) {
        return;
      }

      const nextMilestone = workReminderPendingRef.current.shift();
      if (nextMilestone === undefined) {
        return;
      }

      workReminderSentRef.current[nextMilestone] = true;
      setToast(createWorkReminderToast(nextMilestone));

      if (!mute) {
        playChime();
      }
    }, 5_000);

    return () => window.clearInterval(tick);
  }, [
    isPaused,
    isSuppressed,
    mute,
    setToast,
    toast,
    workEndTime,
    workStartTime,
  ]);
};
