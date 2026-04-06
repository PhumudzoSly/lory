import { useMemo } from "react";
import type { DailyWorkLog } from "../../lib/buddyConfig";
import { IconHistory } from "@tabler/icons-react";

type Props = {
  dailyLogs: Record<string, DailyWorkLog>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HistoryChart({ dailyLogs }: Props) {
  const { rows, maxAvg, hasData } = useMemo(() => {
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
    const hasData = rows.some((r) => r.samples > 0);
    return { rows, maxAvg, hasData };
  }, [dailyLogs]);

  return (
    <section className="bg-card shadow-sm border-none rounded-2xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h4 className="font-bold text-lg text-foreground flex items-center gap-2 mb-2">
            <IconHistory className="size-5 text-primary" />
            Average Hours by Day
          </h4>
          <p className="text-muted-foreground text-sm">
            Based on local schedule logs. Discover patterns to optimize your week.
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium mt-1">Historical</span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <IconHistory className="size-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No historical data yet
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Keep working within your schedule to build insights over time
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
