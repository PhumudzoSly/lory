import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { IconCheck, IconRotateClockwise2 } from "@tabler/icons-react";
import { api } from "../../../convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DayKey = (typeof DAYS)[number];

type DayState = {
  isWorkDay: boolean;
  startTime: string;
  endTime: string;
};

type ServerDay = {
  dayOfWeek: DayKey;
  isWorkDay: boolean;
  startTime?: string;
  endTime?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "saving"; day: DayKey }
  | { kind: "success"; day: DayKey }
  | { kind: "error"; day: DayKey; message: string };

const DEFAULT_STATE: Record<DayKey, DayState> = {
  monday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  tuesday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  wednesday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  thursday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  friday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  saturday: { isWorkDay: false, startTime: "09:00", endTime: "17:00" },
  sunday: { isWorkDay: false, startTime: "09:00", endTime: "17:00" },
};

const timeInputClass =
  "h-7 w-[84px] text-[12px] bg-transparent border-border/20 hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30";

export function WorkScheduleCard() {
  const schedule = useQuery(api.work.getWorkSchedule);
  const upsertDay = useMutation(api.work.upsertWorkDay);

  const [state, setState] = useState<Record<DayKey, DayState>>(DEFAULT_STATE);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!schedule) return;
    const next = { ...DEFAULT_STATE };
    for (const day of schedule as ServerDay[]) {
      next[day.dayOfWeek] = {
        isWorkDay: day.isWorkDay,
        startTime: day.startTime ?? "09:00",
        endTime: day.endTime ?? "17:00",
      };
    }
    setState(next);
  }, [schedule]);

  const updateDay = (day: DayKey, patch: Partial<DayState>) => {
    setState((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const saveDay = async (day: DayKey, override?: Partial<DayState>) => {
    const current = { ...state[day], ...override };
    setStatus({ kind: "saving", day });
    try {
      await upsertDay({
        dayOfWeek: day,
        isWorkDay: current.isWorkDay,
        startTime: current.isWorkDay ? current.startTime : undefined,
        endTime: current.isWorkDay ? current.endTime : undefined,
      });
      setStatus({ kind: "success", day });
      window.setTimeout(() => {
        setStatus((s) =>
          s.kind === "success" && s.day === day ? { kind: "idle" } : s,
        );
      }, 1200);
    } catch (err) {
      setStatus({
        kind: "error",
        day,
        message: err instanceof Error ? err.message : "Failed to save",
      });
    }
  };

  const toggleWorkDay = async (day: DayKey, checked: boolean) => {
    updateDay(day, { isWorkDay: checked });
    await saveDay(day, { isWorkDay: checked });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
          Work Schedule
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground/50 max-w-[80%]">
          Set the days you work and your hours. Lory uses this to time nudges
          and respect your off days.
        </p>
      </header>

      <div className="divide-y divide-border/40 border-y border-border/40">
        {DAYS.map((day) => {
          const d = state[day];
          const isSaving = status.kind === "saving" && status.day === day;
          const isSuccess = status.kind === "success" && status.day === day;
          const isError = status.kind === "error" && status.day === day;

          return (
            <div
              key={day}
              className="grid grid-cols-[120px_auto_1fr_auto] items-center gap-4 py-3"
            >
              <span className="text-[13px] capitalize text-foreground/80">
                {day}
              </span>

              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  checked={d.isWorkDay}
                  onCheckedChange={(checked) =>
                    void toggleWorkDay(day, checked)
                  }
                />
                <span className="text-[11px] text-muted-foreground/60 min-w-[44px]">
                  {d.isWorkDay ? "Work" : "Off"}
                </span>
              </div>

              {d.isWorkDay ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={d.startTime}
                    onChange={(e) =>
                      updateDay(day, { startTime: e.target.value })
                    }
                    onBlur={() => void saveDay(day)}
                    className={timeInputClass}
                  />
                  <span className="text-[11px] text-muted-foreground/40">
                    →
                  </span>
                  <Input
                    type="time"
                    value={d.endTime}
                    onChange={(e) =>
                      updateDay(day, { endTime: e.target.value })
                    }
                    onBlur={() => void saveDay(day)}
                    className={timeInputClass}
                  />
                </div>
              ) : (
                <span className="text-[12px] text-muted-foreground/40 italic">
                  Off day
                </span>
              )}

              <div className="flex items-center justify-end min-w-[72px]">
                {isSaving && (
                  <IconRotateClockwise2
                    size={13}
                    className="animate-spin text-muted-foreground/50"
                  />
                )}
                {isSuccess && (
                  <IconCheck
                    size={13}
                    stroke={2.5}
                    className="text-green-600/80"
                  />
                )}
                {isError && (
                  <span
                    className="text-[11px] text-destructive/80"
                    title={status.message}
                  >
                    Failed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
