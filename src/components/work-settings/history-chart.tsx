import { useMemo } from "react";
import type { DailyWorkLog } from "../../lib/buddyConfig";
import { IconHistory } from "@tabler/icons-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";

type Props = {
  dailyLogs: Record<string, DailyWorkLog>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const chartConfig = {
  avg: {
    label: "Average Hours",
    color: "hsl(24 100% 50%)", // Orange color
  },
} satisfies ChartConfig;

export function HistoryChart({ dailyLogs }: Props) {
  const { chartData, hasData } = useMemo(() => {
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

    const chartData = DAYS.map((day) => {
      const b = buckets[day];
      return {
        day,
        avg: b.count > 0 ? Number((b.total / b.count).toFixed(1)) : 0,
        samples: b.count,
      };
    });

    const hasData = chartData.some((d) => d.samples > 0);
    return { chartData, hasData };
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
            Based on local schedule logs. Discover patterns to optimize your
            week.
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium mt-1">
          Historical
        </span>
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
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(24 100% 50%)" />
                <stop offset="50%" stopColor="hsl(45 100% 51%)" />
                <stop offset="100%" stopColor="hsl(142 76% 36%)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              tickFormatter={(value) => `${value}h`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.payload.day}:</span>
                      <span className="font-bold text-foreground">
                        {value}h
                      </span>
                      {item.payload.samples > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          ({item.payload.samples} {item.payload.samples === 1 ? "day" : "days"})
                        </span>
                      )}
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="avg"
              type="monotone"
              stroke="url(#colorAvg)"
              strokeWidth={3}
              dot={{
                fill: "hsl(24 100% 50%)",
                r: 4,
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
              }}
              activeDot={{
                r: 6,
                fill: "hsl(45 100% 51%)",
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
              }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </section>
  );
}
