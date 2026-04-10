import { useEffect, useRef } from "react";
import type { AppSettings, WorkDay } from "../lib/buddyConfig";
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

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type AfterHoursReminderId =
  | "windDown"
  | "screenOff"
  | "prep"
  | "bedtime"
  | "hydrate"
  | "stretch"
  | "breathing"
  | "reflection";

type AfterHoursReminderPayload = {
  id: AfterHoursReminderId;
  title: string;
  description: string;
  severity: 1 | 2 | 3;
};

type UseAfterHoursSchedulerParams = {
  settings: AppSettings;
  mute: boolean;
  isPaused: boolean;
  isSuppressed: boolean;
  onAfterHoursTriggered?: (payload: AfterHoursReminderPayload) => void;
};

type AfterHoursCandidate = {
  id: AfterHoursReminderId;
  thresholdMinutes: number;
  title: string;
  description: string;
  severity: 1 | 2 | 3;
  enabled: boolean;
};

const NIGHT_END_GRACE_MINUTES = 120;

export const useAfterHoursScheduler = ({
  settings,
  mute,
  isPaused,
  isSuppressed,
  onAfterHoursTriggered,
}: UseAfterHoursSchedulerParams): void => {
  const schedulerDayRef = useRef(localDateKey(new Date()));
  const sentRef = useRef<Record<string, boolean>>({});
  const nudgesPerNightRef = useRef<Record<string, number>>({});
  const previousMinutesLeftRef = useRef<number | null>(null);
  const lastSentAtRef = useRef<number>(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const afterHours = settings.afterHours;
      if (!afterHours.enabled) {
        previousMinutesLeftRef.current = null;
        return;
      }

      const now = new Date();
      const todayKey = localDateKey(now);

      if (schedulerDayRef.current !== todayKey) {
        schedulerDayRef.current = todayKey;
        sentRef.current = {};
        nudgesPerNightRef.current = {};
        previousMinutesLeftRef.current = null;
      }

      const todayIndex = now.getDay();
      const shouldRunToday = afterHours.days.some(
        (wd) => WORKDAY_TO_INDEX[wd] === todayIndex,
      );

      if (!shouldRunToday) {
        previousMinutesLeftRef.current = null;
        return;
      }

      const [bedHour, bedMinute] = afterHours.bedtime.split(":").map(Number);
      if (Number.isNaN(bedHour) || Number.isNaN(bedMinute)) {
        previousMinutesLeftRef.current = null;
        return;
      }

      const bedtime = new Date(now);
      bedtime.setHours(bedHour, bedMinute, 0, 0);

      const bedtimeMs = bedtime.getTime();
      const nowMs = now.getTime();

      const nightStart =
        bedtimeMs - Math.max(10, afterHours.windDownLeadMinutes) * 60_000;
      const nightEnd = bedtimeMs + NIGHT_END_GRACE_MINUTES * 60_000;

      if (nowMs < nightStart || nowMs > nightEnd) {
        previousMinutesLeftRef.current = null;
        return;
      }

      const minutesLeft = Math.ceil((bedtimeMs - nowMs) / 60_000);
      const previous = previousMinutesLeftRef.current;
      const nightKey = `${todayKey}:${afterHours.bedtime}`;

      const candidates: AfterHoursCandidate[] = [
        {
          id: "windDown",
          thresholdMinutes: afterHours.windDownLeadMinutes,
          title: "Wind-Down Window",
          description:
            "Start easing out of work mode. Softer lights and slower pace help your brain shift gears.",
          severity: 1,
          enabled: true,
        },
        {
          id: "screenOff",
          thresholdMinutes: afterHours.screenOffLeadMinutes,
          title: "Screen-Off Soon",
          description:
            "Try wrapping up screens now so your sleep pressure can build naturally.",
          severity: 2,
          enabled: true,
        },
        {
          id: "prep",
          thresholdMinutes: afterHours.prepLeadMinutes,
          title: "Sleep Prep",
          description:
            "Quick reset: water sip, bathroom, and lay out tomorrow's first task.",
          severity: 2,
          enabled: true,
        },
        {
          id: "bedtime",
          thresholdMinutes: 0,
          title: "Bedtime",
          description:
            "Protect tomorrow's focus. Time to close the day and rest.",
          severity: 3,
          enabled: true,
        },
        {
          id: "hydrate",
          thresholdMinutes: Math.min(90, afterHours.windDownLeadMinutes),
          title: "Evening Hydration",
          description:
            "A small sip is enough. Stay comfortable through the night.",
          severity: 1,
          enabled: afterHours.hydrationNudge,
        },
        {
          id: "stretch",
          thresholdMinutes: 45,
          title: "Unwind Stretch",
          description:
            "Two minutes of neck and shoulder stretching can release leftover desk tension.",
          severity: 1,
          enabled: afterHours.stretchNudge,
        },
        {
          id: "breathing",
          thresholdMinutes: 20,
          title: "Breathing Reset",
          description:
            "Try one minute of slow breathing to let your nervous system settle.",
          severity: 1,
          enabled: afterHours.breathingNudge,
        },
        {
          id: "reflection",
          thresholdMinutes: 5,
          title: "Close the Loop",
          description:
            "Write one win from today and one priority for tomorrow, then call it done.",
          severity: 1,
          enabled: afterHours.reflectionNudge,
        },
      ];

      const enabledCandidates = candidates.filter(
        (candidate) => candidate.enabled,
      );

      const due = enabledCandidates
        .filter((candidate) => {
          if (candidate.thresholdMinutes < 0) {
            return false;
          }

          const sentKey = `${nightKey}:${candidate.id}`;
          if (sentRef.current[sentKey]) {
            return false;
          }

          const crossed =
            previous !== null &&
            previous > candidate.thresholdMinutes &&
            minutesLeft <= candidate.thresholdMinutes;
          const exact =
            previous === null && minutesLeft === candidate.thresholdMinutes;
          return crossed || exact;
        })
        .sort((a, b) => b.severity - a.severity);

      if (due.length === 0) {
        previousMinutesLeftRef.current = minutesLeft;
        return;
      }

      if (isPaused || isSuppressed) {
        previousMinutesLeftRef.current = minutesLeft;
        return;
      }

      const alreadySentTonight = nudgesPerNightRef.current[nightKey] ?? 0;
      if (alreadySentTonight >= afterHours.maxNudgesPerNight) {
        previousMinutesLeftRef.current = minutesLeft;
        return;
      }

      const cooldownMs = Math.max(1, afterHours.cooldownMinutes) * 60_000;
      if (Date.now() - lastSentAtRef.current < cooldownMs) {
        previousMinutesLeftRef.current = minutesLeft;
        return;
      }

      const next = due[0];
      const sentKey = `${nightKey}:${next.id}`;
      sentRef.current[sentKey] = true;
      nudgesPerNightRef.current[nightKey] = alreadySentTonight + 1;
      lastSentAtRef.current = Date.now();

      void sendNativeNotification(next.title, next.description);
      onAfterHoursTriggered?.({
        id: next.id,
        title: next.title,
        description: next.description,
        severity: next.severity,
      });

      if (!mute) {
        playChime();
      }

      previousMinutesLeftRef.current = minutesLeft;
    }, 5_000);

    return () => window.clearInterval(tick);
  }, [
    isPaused,
    isSuppressed,
    mute,
    onAfterHoursTriggered,
    settings.afterHours,
  ]);
};
