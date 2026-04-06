import { useMemo } from "react";
import type { DailyWorkLog } from "../../lib/buddyConfig";
import { Card, CardContent } from "../ui/card";

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

  return (
    <Card className="bg-card shadow-sm border rounded-2xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-bold text-lg text-foreground">Weekly Hours by Day</h4>
          <div className="flex gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              Actual
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-3 px-2 sm:px-6">
          {weekData.map((day) => (
            <div key={day.name} className="flex-1 flex flex-col items-center gap-3 h-full">
              <div className="w-full bg-accent rounded-t-lg relative h-full flex flex-col justify-end overflow-hidden group">
                {!day.isFuture && (
                  <div 
                    className={`w-full transition-all duration-500 ${day.isToday ? 'bg-primary' : 'bg-primary/60 hover:bg-primary/80'}`} 
                    style={{ height: `${Math.min(100, Math.max(4, (day.hours / Math.max(8, maxDailyGoal)) * 100))}%` }}
                  ></div>
                )}
                {day.hours > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs bg-black/10">
                    {day.hours.toFixed(1)}
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-bold ${day.isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {day.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
