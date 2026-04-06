import { useEffect, useState } from "react";

type Props = {
  lastFiredAt?: number | undefined;
  intervalMinutes: number;
  enabled: boolean;
};

export function BreakCountdownPill({ lastFiredAt, intervalMinutes, enabled }: Props) {
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
    const id = window.setInterval(compute, 10_000);
    return () => window.clearInterval(id);
  }, [lastFiredAt, intervalMinutes]);

  if (!enabled) return null;

  const remainingMin = Math.ceil(remainingMs / 60_000);

  if (remainingMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 w-fit">
        Due soon
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit">
      Next in {remainingMin}m
    </span>
  );
}
