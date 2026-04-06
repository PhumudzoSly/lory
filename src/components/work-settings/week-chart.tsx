import { useMemo } from "react";
import type { DailyWorkLog } from "../../lib/buddyConfig";
import { IconChartBar } from "@tabler/icons-react";

type Props = {
  dailyLogs: Record<string, DailyWorkLog>;
  workHoursGoal: number;
  currentWeekHours: number;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekChart({ dailyLogs, workHoursGoal }: Props) {
  const weekData = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay() || 7;

    return DAY_LABELS.map((name, idx) => {
      const dayIndex = idx + 1;
      const d = new Date(today);
      d.setDate(today.getDate() - (currentDayOfWeek - dayIndex));
      const dateStr = d.toISOString().split("T")[0];
      return {
        name,
        hours: dailyLogs[dateStr]?.hours ?? 0,
        isToday: dayIndex === currentDayOfWeek,
        isFuture: dayIndex > currentDayOfWeek,
      };
    });
  }, [dailyLogs]);

  const maxDailyGoal = workHoursGoal / 5;
  const hasAnyData = weekData.some((day) => day.hours > 0);

  return (
    <section className="bg-card p-8 shadow-sm border-none rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h4 className="font-bold text-lg text-foreground flex items-center gap-2 mb-2">
            <IconChartBar className="size-5 text-primary" />
            Weekly Hours by Day
          </h4>
          <p className="text-muted-foreground text-sm">
            Track your current week against your target.
          </p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            Actual
          </span>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <IconChartBar className="size-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No work hours logged yet this week
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Hours will appear here as you work within your scheduled days
          </p>
        </div>
      ) : (
        <div className="flex items-end justify-between h-48 gap-3 px-2 sm:px-6">
          {weekData.map((day) => (
            <div key={day.name} className="flex-1 flex flex-col items-center gap-3 h-full">
              <div className="w-full bg-accent rounded-t-lg relative h-full flex flex-col justify-end overflow-hidden group">
                {!day.isFuture && (
                  <div
                    className={`w-full transition-all duration-500 ${day.isToday ? "bg-primary" : "bg-primary/60 hover:bg-primary/80"}`}
                    style={{ height: `${Math.min(100, Math.max(4, (day.hours / Math.max(8, maxDailyGoal)) * 100))}%` }}
                  ></div>
                )}
                {day.hours > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs bg-black/10">
                    {day.hours.toFixed(1)}
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-bold ${day.isToday ? "text-primary" : "text-muted-foreground"}`}>
                {day.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
