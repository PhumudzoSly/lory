import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings } from "../../lib/buddyConfig";
import { TodaySession } from "./today-session";
import { WeekChart } from "./week-chart";
import { HistoryChart } from "./history-chart";
import { GoalCard } from "./goal-card";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function WorkSettings({ settings, setSettings }: Props) {
  const [currentWeekHours, setCurrentWeekHours] = useState(0);
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;

  const currentTime = today.getHours() * 60 + today.getMinutes();
  const timeOfDay =
    currentTime < 12 * 60
      ? "Morning"
      : currentTime < 18 * 60
        ? "Afternoon"
        : "Evening";

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
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
        <h2 className="mb-3 flex flex-wrap items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Good {timeOfDay}
          </span>{" "}
          -
          <span className="inline-flex items-center rounded-full border border-orange-300/60 bg-linear-to-r from-orange-100 to-amber-100 px-3 py-1 text-sm font-black uppercase tracking-wide text-orange-900 shadow-sm sm:text-base">
            {days[today.getDay() - 1] || days[6]}
          </span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Manage your work hours, track progress, and maintain balance.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 space-y-10">
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
      </div>
    </div>
  );
}
