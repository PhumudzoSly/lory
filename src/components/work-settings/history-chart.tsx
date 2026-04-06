import { useMemo } from "react";
import type { DailyWorkLog } from "../../lib/buddyConfig";
import { Card, CardContent } from "../ui/card";

type Props = {
  dailyLogs: Record<string, DailyWorkLog>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HistoryChart({ dailyLogs }: Props) {
  const { rows, maxAvg } = useMemo(() => {
    const buckets = Object.fromEntries(
      DAYS.map((d) => [d, { total: 0, count: 0 }]),
    ) as Record<string, { total: number; count: number }>;

    for (const [isoDate, log] of Object.entries(dailyLogs)) {
      const date = new Date(isoDate);
      if (Number.isNaN(date.getTime())) continue;
      const label = DAYS[(date.getDay() + 6) % 7];
      const value = Number(log.hours);
      if (!Number.isFinite(value) || value < 0) continue;
      buckets[label].total += value;
      buckets[label].count += 1;
    }

    const rows = DAYS.map((day) => {
      const b = buckets[day];
      return {
        day,
        avg: b.count > 0 ? b.total / b.count : 0,
        samples: b.count,
      };
    });

    const maxAvg = Math.max(1, ...rows.map((r) => r.avg));
    return { rows, maxAvg };
  }, [dailyLogs]);

  return (
    <Card className="bg-card shadow-sm border rounded-2xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-bold text-lg text-foreground">Average Hours by Day (All Time)</h4>
          <span className="text-xs text-muted-foreground font-medium">Historical</span>
        </div>

        <div className="space-y-5">
          {rows.map((row) => (
            <div key={row.day} className="flex items-center gap-4 group">
              <span className="w-12 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{row.day}</span>
              <div className="flex-1 h-3 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/60 group-hover:bg-primary transition-colors duration-500 rounded-full" 
                  style={{ width: `${Math.max(2, (row.avg / maxAvg) * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold w-10 text-right tabular-nums">{row.avg.toFixed(1)}h</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
