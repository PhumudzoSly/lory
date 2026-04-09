import { useEffect, useState } from "react";

type Props = {
  lastFiredAt: number | undefined;
  intervalMinutes: number;
  enabled: boolean;
};

export function BreakTimer({ lastFiredAt, intervalMinutes, enabled }: Props) {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    const nextDueAt = (lastFiredAt ?? Date.now()) + intervalMinutes * 60_000;
    return nextDueAt - Date.now();
  });

  useEffect(() => {
    const compute = () => {
      const nextDueAt = (lastFiredAt ?? Date.now()) + intervalMinutes * 60_000;
      setRemainingMs(nextDueAt - Date.now());
    };
    compute();
    const id = window.setInterval(compute, 1000);
    return () => window.clearInterval(id);
  }, [lastFiredAt, intervalMinutes]);

  if (!enabled) return null;

  const remainingMin = Math.max(0, Math.ceil(remainingMs / 60_000));
  const totalMs = intervalMinutes * 60_000;
  const progress = Math.max(0, Math.min(100, ((totalMs - remainingMs) / totalMs) * 100));

  return (
    <div className="relative z-10 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          {remainingMin === 0 ? "Due now" : `Next in ${remainingMin} min`}
        </span>
        <span className="text-muted-foreground/60 font-mono">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
