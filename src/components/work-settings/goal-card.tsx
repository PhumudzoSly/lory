import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { IconChartLine } from "@tabler/icons-react";
import type { AppSettings } from "../../lib/buddyConfig";
import { Input } from "../ui/input";

type Props = {
  workHoursGoal: number;
  currentWeekHours: number;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const PRESET_GOALS = [30, 35, 40, 45];

const getPresetColor = (hours: number, isSelected: boolean) => {
  if (!isSelected) {
    return "bg-muted text-muted-foreground hover:bg-muted/80";
  }

  switch (hours) {
    case 30:
      return "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100";
    case 35:
      return "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100";
    case 40:
      return "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100";
    case 45:
      return "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100";
    default:
      return "bg-primary text-primary-foreground";
  }
};

export function GoalCard({
  workHoursGoal,
  currentWeekHours,
  setSettings,
}: Props) {
  const [customInput, setCustomInput] = useState(workHoursGoal.toString());

  const percentComplete = Math.min(
    100,
    Math.round((currentWeekHours / workHoursGoal) * 100),
  );

  const setGoal = (value: number) => {
    const clamped = Math.max(1, Math.min(100, value));
    setSettings((prev) => ({
      ...prev,
      workHoursGoal: clamped,
    }));
    setCustomInput(clamped.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const handleCustomBlur = () => {
    const parsed = parseInt(customInput, 10);
    if (!Number.isNaN(parsed)) {
      setGoal(parsed);
    } else {
      setCustomInput(workHoursGoal.toString());
    }
  };

  return (
    <section className="bg-card p-8 rounded-2xl shadow-sm border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-3 text-foreground">
          <IconChartLine className="size-6 text-primary" />
          Weekly Hours Goal
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Set a target to help maintain work-life balance.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
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
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-200 rounded-full transition-all duration-1000 animate-pulse"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Target Hours
          </label>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_GOALS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGoal(preset)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${getPresetColor(
                    preset,
                    workHoursGoal === preset,
                  )}`}
                >
                  {preset}h
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Custom:
              </span>
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
                <button
                  onClick={() => setGoal(Math.max(1, workHoursGoal - 1))}
                  className="w-9 h-9 rounded-lg bg-background hover:bg-accent transition-colors flex items-center justify-center text-foreground font-bold text-lg shadow-sm hover:shadow active:scale-95 transition-transform"
                  aria-label="Decrease hours"
                >
                  −
                </button>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={customInput}
                  onChange={handleCustomChange}
                  onBlur={handleCustomBlur}
                  className="w-20 h-9 text-center font-bold rounded-lg bg-background border-none shadow-sm"
                />
                <button
                  onClick={() => setGoal(Math.min(100, workHoursGoal + 1))}
                  className="w-9 h-9 rounded-lg bg-background hover:bg-accent transition-colors flex items-center justify-center text-foreground font-bold text-lg shadow-sm hover:shadow active:scale-95 transition-transform"
                  aria-label="Increase hours"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
