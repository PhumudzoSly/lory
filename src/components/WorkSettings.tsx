import { useState, useEffect } from "react";
import { type AppSettings } from "../lib/buddyConfig";

interface WorkSettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function WorkSettings({ settings, setSettings }: WorkSettingsProps) {
  const [currentWeekHours, setCurrentWeekHours] = useState(0);
  const [hoursLeftToday, setHoursLeftToday] = useState<{
    hours: number;
    mins: number;
  } | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    // Generate some mock data for the week if none exists just to show the UI
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 1 (Mon) to 7 (Sun)

    // Calculate current week hours based on actual logs or realistic mock
    let sum = 0;
    const weekLogs = { ...settings.dailyLogs };

    // If it's completely empty, add some mock data for earlier in the week to make UI look good
    if (Object.keys(weekLogs).length === 0 && dayOfWeek > 1) {
      for (let i = 1; i < dayOfWeek; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (dayOfWeek - i));
        const dateStr = d.toISOString().split("T")[0];
        weekLogs[dateStr] = 7.5 + (Math.random() * 1.5 - 0.5); // Random between 7 and 8.5
      }
      // Save the mock data so it persists
      setSettings((prev) => ({ ...prev, dailyLogs: weekLogs }));
      return; // wait for next render
    }

    // Sum up this week
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (dayOfWeek - i));
      const dateStr = d.toISOString().split("T")[0];
      if (weekLogs[dateStr]) {
        sum += weekLogs[dateStr];
      }
    }

    setCurrentWeekHours(sum);
  }, [settings.dailyLogs, setSettings]);

  useEffect(() => {
    const updateTimeStatus = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();

      const [startH, startM] = settings.workStartTime.split(":").map(Number);
      const [endH, endM] = settings.workEndTime.split(":").map(Number);

      const nowMins = currentHours * 60 + currentMins;
      const startTotalMins = startH * 60 + startM;
      const endTotalMins = endH * 60 + endM;

      if (nowMins >= startTotalMins && nowMins < endTotalMins) {
        setIsWorking(true);
        const leftMins = endTotalMins - nowMins;
        setHoursLeftToday({
          hours: Math.floor(leftMins / 60),
          mins: leftMins % 60,
        });
      } else {
        setIsWorking(false);
        setHoursLeftToday(null);
      }
    };

    updateTimeStatus();
    const interval = setInterval(updateTimeStatus, 60000); // update every minute
    return () => clearInterval(interval);
  }, [settings.workStartTime, settings.workEndTime]);

  const updateGoal = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      workHoursGoal: Math.max(1, prev.workHoursGoal + delta),
    }));
  };

  const percentComplete = Math.min(
    100,
    Math.round((currentWeekHours / settings.workHoursGoal) * 100),
  );

  // Generate days for the chart
  const today = new Date();
  const currentDayOfWeek = today.getDay() || 7;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = days.map((name, idx) => {
    const dayIndex = idx + 1;
    const d = new Date(today);
    d.setDate(today.getDate() - (currentDayOfWeek - dayIndex));
    const dateStr = d.toISOString().split("T")[0];
    const hours = settings.dailyLogs[dateStr] || 0;
    return {
      name,
      hours,
      isToday: dayIndex === currentDayOfWeek,
      isFuture: dayIndex > currentDayOfWeek,
    };
  });

  return (
    <>
      <header className="mb-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
            Work Settings
          </h2>
          {isWorking ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse !text-white"></div>
              Currently Working
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              Outside Work Hours
            </div>
          )}
        </div>
        <p className="text-on-surface-variant text-lg">
          Define your professional boundaries to sustain your digital wellbeing.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    schedule
                  </span>
                  Today's Availability Windows
                </h3>
                {hoursLeftToday && (
                  <div className="text-sm font-semibold text-primary-dim bg-primary-container/50 px-3 py-1.5 rounded-lg border border-primary-container">
                    {hoursLeftToday.hours > 0
                      ? `${hoursLeftToday.hours}h `
                      : ""}
                    {hoursLeftToday.mins}m left today
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-lg">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Work Start Time
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      className="w-full bg-surface-container-low border-none rounded-md focus:ring-2 focus:ring-primary/20 text-xl font-medium p-3"
                      type="time"
                      value={settings.workStartTime}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          workStartTime: e.target.value,
                        }))
                      }
                    />
                    <div className="size-12 rounded-sm bg-primary-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">
                        wb_sunny
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-lg">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Work End Time
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      className="w-full bg-surface-container-low border-none rounded-md focus:ring-2 focus:ring-primary/20 text-xl font-medium p-3"
                      type="time"
                      value={settings.workEndTime}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          workEndTime: e.target.value,
                        }))
                      }
                    />
                    <div className="size-12 rounded-sm bg-secondary-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">
                        dark_mode
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    track_changes
                  </span>
                  Work Hours Goal
                </h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                  Setting a goal helps Lory identify when you're over-extending.
                  We'll prioritize your deep work sessions within these targets.
                </p>

                <div className="relative pt-1">
                  <div className="flex flex-wrap mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-container">
                        Target: {settings.workHoursGoal} Hours / Week
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {percentComplete}% ({currentWeekHours.toFixed(1)}h
                        logged)
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-8 text-xs flex rounded bg-surface-container-highest">
                    <div
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000"
                      style={{ width: `${percentComplete}%` }}
                    ></div>
                  </div>
                </div>

                {/* Weekly Chart */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                    This Week
                  </h4>
                  <div className="flex items-end justify-between h-24 gap-2">
                    {weekData.map((day) => (
                      <div
                        key={day.name}
                        className="flex flex-col items-center flex-1 gap-2"
                      >
                        <div className="w-full relative flex items-end justify-center h-full bg-surface-container-lowest/50 rounded-t-sm">
                          {!day.isFuture && (
                            <div
                              className={`w-full rounded-t-sm transition-all duration-500 ${day.isToday ? "bg-primary" : "bg-primary/40 hover:bg-primary/60"}`}
                              style={{
                                height: `${Math.min(100, Math.max(4, (day.hours / 10) * 100))}%`,
                              }}
                              title={`${day.hours.toFixed(1)} hours`}
                            ></div>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider ${day.isToday ? "text-primary" : "text-on-surface-variant/70"}`}
                        >
                          {day.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-48 aspect-square rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center border-4 border-primary-container/30">
                <span className="text-3xl font-extrabold text-primary">
                  {settings.workHoursGoal}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Weekly Goal
                </span>
                <div className="mt-4 flex gap-2">
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary-container transition-colors"
                    onClick={() => updateGoal(-1)}
                  >
                    <span className="material-symbols-outlined text-sm">
                      remove
                    </span>
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary-container transition-colors"
                    onClick={() => updateGoal(1)}
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-primary p-8 rounded-xl text-on-primary shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-4">
                auto_awesome
              </span>
              <h4 className="text-xl font-bold mb-3 tracking-tight">
                Why this matters?
              </h4>
              <p className="text-primary-fixed/80 text-sm leading-relaxed mb-6">
                Lory uses your work hours to intelligently map out your
                **Hydration** and **Movement** breaks. By knowing when you start
                and end, we ensure you stay refreshed without interrupting your
                peak flow states.
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-on-primary bg-on-primary-container/20 p-3 rounded-lg border border-on-primary-container/30">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                Smart Scheduling Active
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-12 blur-2xl"></div>
          </div>

          <div className="bg-surface-container-high rounded-xl overflow-hidden">
            <img
              alt="Calm workspace with plants"
              className="w-full h-48 object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLmyTxv7Mrjc0wo7NqOH1vRghMsECYeXfVnKjo5xEmqz7XAhb4ggMtVYWcINHBQXRyqYh-FnpNPLoT3DSIQclfDE_OAPhyf9MdHV7qdFUfQbDC3Y1YNIViReUUwtLduHhGkjNaJwL4tsSctjnfwU-Q9BbnRY49vcnVY0UaAJ2XBBxMp7ijZUQ4p-vc9zYWGpaCXC36_Qy6_hdGGfFalgSBY_PcFrYd40nOmhQXgHiDl_VcrdRvBf2Aw3ptQ5rbymheVrt1yxqfIAx1"
            />
            <div className="p-6">
              <h4 className="font-bold text-on-surface mb-2">Pro Tip</h4>
              <p className="text-on-surface-variant text-sm">
                Studies show that taking a 5-minute movement break every 50
                minutes increases total daily output by up to 15%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
