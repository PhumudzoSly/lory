import type { Dispatch, SetStateAction } from "react";
import { IconChartLine, IconMinus, IconPlus } from "@tabler/icons-react";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
  workHoursGoal: number;
  currentWeekHours: number;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function GoalCard({
  workHoursGoal,
  currentWeekHours,
  setSettings,
}: Props) {
  const percentComplete = Math.min(
    100,
    Math.round((currentWeekHours / workHoursGoal) * 100),
  );

  const updateGoal = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      workHoursGoal: Math.max(1, prev.workHoursGoal + delta),
    }));
  };

  return (
    <section className="bg-card p-8 rounded-2xl shadow-sm border-none flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1 w-full">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-foreground">
          <IconChartLine className="size-6 text-primary" />
          Work Hours Goal
        </h3>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Intentionally capping your work week prevents burnout. Lory will nudge
          you to wrap up when you're nearing your target.
        </p>
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Weekly Progress
            </span>
            <span className="text-2xl font-bold text-primary">
              {currentWeekHours.toFixed(1)}
              <span className="text-sm font-medium text-muted-foreground ml-1">
                / {workHoursGoal}h
              </span>
            </span>
          </div>
          <div className="h-3 w-full bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="w-32 h-32 flex-shrink-0 rounded-full border-8 border-primary/20 flex flex-col items-center justify-center relative bg-card shadow-sm">
        <div
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
          onClick={() => updateGoal(1)}
        >
          <IconPlus className="size-5" />
        </div>
        <div
          className="absolute -bottom-2 -left-2 bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
          onClick={() => updateGoal(-1)}
        >
          <IconMinus className="size-5" />
        </div>
        <span className="text-4xl font-extrabold text-primary">
          {workHoursGoal}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
          Target
        </span>
      </div>
    </section>
  );
}
