import { useState, useEffect } from "react";
import { IconClockHour4, IconEdit } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings, WorkDay } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const ALL_WEEKDAYS: WorkDay[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const computeWorkStatus = (
  workStartTime: string,
  workEndTime: string,
  workDays: WorkDay[],
): { inWorkday: boolean; remainingSeconds: number | null } => {
  const now = new Date();
  const [startH, startM] = workStartTime.split(":").map(Number);
  const [endH, endM] = workEndTime.split(":").map(Number);

  if (
    Number.isNaN(startH) ||
    Number.isNaN(startM) ||
    Number.isNaN(endH) ||
    Number.isNaN(endM)
  ) {
    return { inWorkday: false, remainingSeconds: null };
  }

  const weekdayByIndex: WorkDay[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const isSelectedStartDay = (date: Date) =>
    workDays.includes(weekdayByIndex[date.getDay()]);

  const buildWorkWindow = (startDay: Date) => {
    if (!isSelectedStartDay(startDay)) {
      return null;
    }

    const start = new Date(startDay);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(startDay);
    end.setHours(endH, endM, 0, 0);

    if (end.getTime() === start.getTime()) {
      return null;
    }

    if (end.getTime() < start.getTime()) {
      end.setDate(end.getDate() + 1);
    }

    return { startTime: start.getTime(), endTime: end.getTime() };
  };

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const windows = [buildWorkWindow(yesterday), buildWorkWindow(today)].filter(
    (window): window is { startTime: number; endTime: number } =>
      window !== null,
  );

  if (windows.length === 0) {
    return { inWorkday: false, remainingSeconds: null };
  }

  const nowTime = now.getTime();

  for (const window of windows) {
    if (nowTime >= window.startTime && nowTime < window.endTime) {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((window.endTime - nowTime) / 1000),
      );
      return { inWorkday: true, remainingSeconds };
    }
  }

  return { inWorkday: false, remainingSeconds: null };
};

export function TodaySession({ settings, setSettings }: Props) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(settings.workStartTime);
  const [draftEnd, setDraftEnd] = useState(settings.workEndTime);
  const [draftDays, setDraftDays] = useState(settings.workDays);

  const [workStatus, setWorkStatus] = useState(() =>
    computeWorkStatus(
      settings.workStartTime,
      settings.workEndTime,
      settings.workDays,
    ),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkStatus(
        computeWorkStatus(
          settings.workStartTime,
          settings.workEndTime,
          settings.workDays,
        ),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.workStartTime, settings.workEndTime, settings.workDays]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftStart(settings.workStartTime);
      setDraftEnd(settings.workEndTime);
      setDraftDays(settings.workDays);
    }
    setOpen(nextOpen);
  };

  const handleSave = () => {
    setSettings((prev) => ({
      ...prev,
      workStartTime: draftStart,
      workEndTime: draftEnd,
      workDays: draftDays,
    }));
    setOpen(false);
  };

  const toggleDay = (day: WorkDay) => {
    setDraftDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const formatRemainingTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h === 0 && m === 0) return `${s}s`;
    if (h === 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
    return `${h}h ${m}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <section className="bg-card p-8 rounded-2xl shadow-sm border-none">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
            <IconClockHour4 className="text-primary size-6" />
            Work Schedule
          </h3>
          <p className="text-muted-foreground text-sm">
            Define your working hours and active days.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <IconEdit className="size-4" />
              Edit Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Update Work Schedule</DialogTitle>
              <DialogDescription>
                Adjust your working hours and active days.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label
                  htmlFor="start-time"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="h-12 text-lg font-bold rounded-xl"
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="end-time"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={draftEnd}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="h-12 text-lg font-bold rounded-xl"
                />
              </div>
              <div className="grid gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Work Days
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_WEEKDAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        draftDays.includes(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSave}
                className="rounded-xl px-8 w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 flex items-stretch gap-4 flex-wrap justify-between">
        <div className="flex h-full min-h-30 flex-wrap items-center gap-6 rounded-xl border-none bg-muted p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-200 rounded-lg shadow-sm border-none">
              <span className="text-xl font-bold text-gray-900">
                {settings.workStartTime}
              </span>
            </div>
            <span className="text-muted-foreground font-medium">to</span>
            <div className="p-3 bg-green-200 rounded-lg shadow-sm border-none">
              <span className="text-xl font-bold text-gray-900">
                {settings.workEndTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {settings.workDays.map((day) => (
              <span
                key={day}
                className="px-2 py-1 rounded-md bg-emerald-500/50 text-primary text-xs font-bold"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="flex h-full min-h-30 flex-1 items-center gap-4 rounded-xl border border-border/60 bg-linear-to-br from-muted/40 to-background p-6 shadow-sm">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              workStatus.inWorkday
                ? "bg-green-500/15 text-green-600"
                : "bg-muted-foreground/10 text-muted-foreground"
            }`}
          >
            <div
              className={`h-3 w-3 rounded-full ${
                workStatus.inWorkday ? "bg-green-500" : "bg-muted-foreground/40"
              }`}
            />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current status
            </p>
            <p className="text-base font-bold text-foreground">
              {workStatus.inWorkday ? "In work window" : "Outside work hours"}
            </p>
            <p className="text-sm text-muted-foreground">
              {workStatus.inWorkday
                ? `${formatRemainingTime(workStatus.remainingSeconds!)} remaining`
                : "You are currently outside your scheduled work time."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
