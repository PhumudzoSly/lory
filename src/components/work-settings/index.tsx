import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings } from "../../lib/buddyConfig";
import { TodaySession } from "./today-session";
import { WeekChart } from "./week-chart";
import { HistoryChart } from "./history-chart";
import { GoalCard } from "./goal-card";
import { InfoPanel } from "./info-panel";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function WorkSettings({ settings, setSettings }: Props) {
  const [currentWeekHours, setCurrentWeekHours] = useState(0);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    let sum = 0;
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (dayOfWeek - i));
      const dateStr = d.toISOString().split("T")[0];
      const log = settings.dailyLogs[dateStr];
      if (log) sum += log.hours;
    }
    setCurrentWeekHours(sum);
  }, [settings.dailyLogs]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      <header className="max-w-4xl">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Mindful Work Planner
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          A gentle approach to your professional day. Let's design a schedule that respects your energy and focus.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <TodaySession settings={settings} setSettings={setSettings} />
          
          <GoalCard
            workHoursGoal={settings.workHoursGoal}
            currentWeekHours={currentWeekHours}
            setSettings={setSettings}
          />
          
          <div className="space-y-8">
            <WeekChart
              dailyLogs={settings.dailyLogs}
              workHoursGoal={settings.workHoursGoal}
              currentWeekHours={currentWeekHours}
            />
            <HistoryChart dailyLogs={settings.dailyLogs} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}
