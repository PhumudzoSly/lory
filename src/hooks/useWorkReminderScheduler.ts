import { useEffect, useRef } from "react";
import type { WorkDay } from "../lib/buddyConfig";
type WorkReminderMilestone = 30 | 15 | 0;

const WORK_REMINDER_MILESTONES: WorkReminderMilestone[] = [30, 15, 0];

const WORKDAY_TO_INDEX: Record<WorkDay, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
import { playChime } from "../lib/sound";
import { sendNativeNotification } from "../lib/notification";

type UseWorkReminderSchedulerParams = {
  workStartTime: string;
  workEndTime: string;
  workDays: WorkDay[];
  mute: boolean;
  isPaused: boolean;
  isSuppressed: boolean;
};

const WORK_NOTIFICATION: Record<
  WorkReminderMilestone,
  { title: string; body: string }
> = {
  30: {
    title: "Workday Check-In",
    body: "Only 30 minutes left in your workday. Start wrapping up calmly.",
  },
  15: {
    title: "Almost Done",
    body: "15 minutes to go. Pick a stopping point and prepare to log off.",
  },
  0: {
    title: "Clock-Out Time",
    body: "Work time is up. Breathe a bit and touch some grass.",
  },
};

export const useWorkReminderScheduler = ({
  workStartTime,
  workEndTime,
  workDays,
  mute,
  isPaused,
  isSuppressed,
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

      // Check if today is a work day
      const dayIndex = now.getDay();
      const isWorkDay = workDays.some(
        (wd) => WORKDAY_TO_INDEX[wd] === dayIndex,
      );

      if (!isWorkDay) {
        previousWorkMinutesLeftRef.current = null;
        return;
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

      if (isPaused || isSuppressed) {
        return;
      }

      const nextMilestone = workReminderPendingRef.current.shift();
      if (nextMilestone === undefined) {
        return;
      }

      workReminderSentRef.current[nextMilestone] = true;
      const { title, body } = WORK_NOTIFICATION[nextMilestone];
      void sendNativeNotification(title, body);

      if (!mute) {
        playChime();
      }
    }, 5_000);

    return () => window.clearInterval(tick);
  }, [isPaused, isSuppressed, mute, workDays, workEndTime, workStartTime]);
};
