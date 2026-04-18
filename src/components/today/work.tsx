import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  IconClock,
  IconCoffee,
  IconHourglassHigh,
  IconCalendar,
} from "@tabler/icons-react";
import { api } from "../../../convex/_generated/api";
import OffDay from "./off-day";
import { ShiftModals } from "./shift-modals";
import ShiftStart from "./shift-start";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type WorkMode = "Deep" | "Creative" | "Normal";

const toMinutes = (time: string): number | null => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null;
  }
  return h * 60 + m;
};

const minutesUntilTime = (targetTime: string): number | null => {
  const [h, m] = targetTime.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null;
  }

  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);

  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60));
};

const formatDuration = (minutes: number): string => {
  if (minutes <= 0) {
    return "0h 0m";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toTimeKey = (date: Date): string => {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

const mapWorkTypeToMode = (workType: string): WorkMode => {
  if (workType === "deep") {
    return "Deep";
  }
  if (workType === "creative") {
    return "Creative";
  }
  return "Normal";
};

/**
 * Work component - Notion inspired summary of today's progress.
 * Focuses on information density, subtle borders, and typography.
 */
const Work = () => {
  const today = new Date();
  const todayDateKey = toDateKey(today);
  const dayKey = DAY_KEYS[today.getDay()];
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const schedule = useQuery(api.work.getWorkSchedule);
  const todayWorked = useQuery(api.work.getDayWorked, {
    date: todayDateKey,
  });
  const upsertDayWorked = useMutation(api.work.upsertDayWorked);
  const endDayWorked = useMutation(api.work.endDayWorked);
  const deleteDayWorked = useMutation(api.work.deleteDayWorked);
  const reconcileSessionsOnAppOpen = useMutation(
    api.work.reconcileSessionsOnAppOpen,
  );
  const hasSavedSchedule = Array.isArray(schedule) && schedule.length > 0;
  const todaySchedule = useMemo(
    () => schedule?.find((entry) => entry.dayOfWeek === dayKey),
    [dayKey, schedule],
  );

  const [manualWorkOverride, setManualWorkOverride] = useState(false);
  const [manualDayOffOverride, setManualDayOffOverride] = useState(false);
  const [shiftState, setShiftState] = useState<"not-started" | "in-progress">(
    "not-started",
  );
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [activeShift, setActiveShift] = useState<{
    startTime: string;
    endTime: string;
    workType: string;
  } | null>(null);

  const [nowTick, setNowTick] = useState(() => Date.now());
  const [isPersistingShift, setIsPersistingShift] = useState(false);
  const [isTakingDayOff, setIsTakingDayOff] = useState(false);
  const [didReconcileOnOpen, setDidReconcileOnOpen] = useState(false);

  const isScheduledWorkDay = todaySchedule?.isWorkDay ?? !isWeekend;
  const scheduledEndTime = activeShift?.endTime ?? todaySchedule?.endTime;
  const hasOpenTodaySession = Boolean(
    todayWorked && !todayWorked.sessionEndedAt,
  );
  const isOffDay =
    manualDayOffOverride ||
    (!manualWorkOverride && !isScheduledWorkDay && !hasOpenTodaySession);

  const sessionMetrics = useMemo(() => {
    if (!activeShift) {
      return {
        workedMinutes: 0,
        plannedMinutes: 0,
        remainingMinutes: 0,
      };
    }

    const start = toMinutes(activeShift.startTime);
    const end = toMinutes(activeShift.endTime);
    if (start === null || end === null || end <= start) {
      return {
        workedMinutes: 0,
        plannedMinutes: 0,
        remainingMinutes: 0,
      };
    }

    const now = new Date(nowTick);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const workedMinutes = Math.min(
      Math.max(nowMinutes - start, 0),
      end - start,
    );
    const remainingMinutes = Math.max(end - nowMinutes, 0);

    return {
      workedMinutes,
      plannedMinutes: end - start,
      remainingMinutes,
    };
  }, [activeShift, nowTick]);

  const workedTime = formatDuration(sessionMetrics.workedMinutes);
  const remainingTime = formatDuration(sessionMetrics.remainingMinutes);

  useEffect(() => {
    if (didReconcileOnOpen) {
      return;
    }

    setDidReconcileOnOpen(true);
    void reconcileSessionsOnAppOpen({
      currentDate: todayDateKey,
      currentTime: toTimeKey(new Date()),
    }).catch((error) => {
      console.error("Failed to reconcile sessions on open", error);
    });
  }, [didReconcileOnOpen, reconcileSessionsOnAppOpen, todayDateKey]);

  useEffect(() => {
    if (todayWorked === undefined) {
      return;
    }

    if (!todayWorked) {
      setActiveShift(null);
      setShiftState("not-started");
      return;
    }

    if (todayWorked.sessionEndedAt) {
      setActiveShift(null);
      setShiftState("not-started");
      return;
    }

    setActiveShift({
      startTime: todayWorked.startTime,
      endTime: todayWorked.endTime,
      workType: todayWorked.workMode.toLowerCase(),
    });
    setShiftState("in-progress");
  }, [todayWorked]);

  const endShiftAndPersist = async (endTime: string) => {
    if (!activeShift) {
      setShiftState("not-started");
      return;
    }

    setIsPersistingShift(true);
    try {
      await endDayWorked({
        date: todayDateKey,
        endTime,
      });
    } catch (error) {
      console.error("Failed to save end of shift", error);
    } finally {
      setShiftState("not-started");
      setActiveShift(null);
      setIsPersistingShift(false);
    }
  };

  const takeDayOffAndClearSession = async () => {
    setIsTakingDayOff(true);
    try {
      await deleteDayWorked({ date: todayDateKey });
    } catch (error) {
      console.error("Failed to clear today's session", error);
    } finally {
      setManualWorkOverride(false);
      setManualDayOffOverride(true);
      setShiftState("not-started");
      setActiveShift(null);
      setIsShiftModalOpen(false);
      setIsTakingDayOff(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scheduledEndTime || shiftState !== "in-progress") {
      return;
    }

    const remainingMinutes = minutesUntilTime(scheduledEndTime);
    if (remainingMinutes !== null && remainingMinutes <= 0) {
      void endShiftAndPersist(toTimeKey(new Date()));
    }
  }, [nowTick, scheduledEndTime, shiftState]);

  const stats = [
    {
      label: "Worked",
      value: workedTime,
      icon: IconClock,
      color: "text-blue-500",
      description: `Of ${formatDuration(sessionMetrics.plannedMinutes)} planned`,
    },
    {
      label: "Remaining",
      value: remainingTime,
      icon: IconHourglassHigh,
      color: "text-orange-500",
      description: scheduledEndTime
        ? `Ends at ${scheduledEndTime}`
        : "No end time set",
    },
    {
      label: "Next Break",
      value: "15m",
      icon: IconCoffee,
      color: "text-green-500",
      description: "Coffee soon",
    },
  ];

  if (schedule === undefined || todayWorked === undefined) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <span className="text-[13px] text-muted-foreground/50">
          Preparing...
        </span>
      </div>
    );
  }

  if (isOffDay) {
    return (
      <OffDay
        onStartWorking={() => {
          setManualDayOffOverride(false);
          setManualWorkOverride(true);
        }}
        hasSavedSchedule={hasSavedSchedule}
        scheduledStartTime={todaySchedule?.startTime}
        scheduledEndTime={todaySchedule?.endTime}
      />
    );
  }

  if (shiftState === "not-started") {
    return (
      <>
        <ShiftStart
          dateString={dateString}
          onTakeDayOff={() => {
            void takeDayOffAndClearSession();
          }}
          onStartShiftClick={() => setIsShiftModalOpen(true)}
        />
        <ShiftModals
          shiftState={shiftState}
          isOpen={isShiftModalOpen}
          onOpenChange={setIsShiftModalOpen}
          onStartShift={(data) => {
            void (async () => {
              setIsPersistingShift(true);
              try {
                const startTimeForSave = todayWorked?.startTime ?? data.startTime;
                await upsertDayWorked({
                  date: todayDateKey,
                  startTime: startTimeForSave,
                  endTime: data.endTime,
                  workMode: mapWorkTypeToMode(data.workType),
                });

                setActiveShift({
                  startTime: startTimeForSave,
                  endTime: data.endTime,
                  workType: data.workType,
                });
                setManualDayOffOverride(false);
                setShiftState("in-progress");
              } catch (error) {
                console.error("Failed to save start of shift", error);
              } finally {
                setIsPersistingShift(false);
              }
            })();
          }}
          onEndShift={() => {}}
        />
      </>
    );
  }

  return (
    <div className="mx-auto  space-y-10 py-6 px-4">
      {/* Date Header: Minimal, tracking-widest, subtle hover */}
      <header className="space-y-3">
        <div className="flex w-fit items-center gap-2 border-b border-transparent pb-0.5 text-muted-foreground/30 transition-colors group hover:border-border/40">
          <IconCalendar
            size={11}
            stroke={2.5}
            className="transition-colors group-hover:text-foreground/50"
          />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-foreground/50">
            {dateString}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
              Today
            </h1>
            <button
              onClick={() => {
                void takeDayOffAndClearSession();
              }}
              disabled={isTakingDayOff}
              className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/40 hover:text-foreground/70 transition-colors"
            >
              {isTakingDayOff ? "Taking day off..." : "Take the day off"}
            </button>
          </div>
          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            Overview of your workday progress and upcoming milestones.
          </p>
        </div>
      </header>

      {/* Stats row: Borderless, simple text-based metrics instead of bulky cards */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col space-y-1.5 cursor-default"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <stat.icon size={12} stroke={2.5} className={stat.color} />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="tabular-nums text-2xl font-bold tracking-tight text-foreground/80">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/30">
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/10 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-0.5">
            <div className="relative flex size-1 items-center justify-center">
              <div className="absolute size-full animate-ping rounded-full bg-green-500/30" />
              <div className="relative size-1 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
              Active: <span className="text-foreground/40">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShiftModalOpen(true)}
              className="text-[11px] font-semibold uppercase tracking-wider text-red-500/60 hover:text-red-500 transition-colors"
            >
              End Shift Early
            </button>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
      <ShiftModals
        shiftState={shiftState}
        isOpen={isShiftModalOpen}
        onOpenChange={setIsShiftModalOpen}
        onStartShift={() => {}}
        onEndShift={() => {
          if (isPersistingShift) {
            return;
          }
          void endShiftAndPersist(toTimeKey(new Date()));
        }}
      />
    </div>
  );
};

export default Work;
