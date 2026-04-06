import { useMemo } from "react";
import type { AppSettings } from "../../lib/buddyConfig";
import { IconClock, IconBell } from "@tabler/icons-react";

type Props = {
  settings: AppSettings;
};

export function UpcomingReminders({ settings }: Props) {
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      now.getDay()
    ];
    const todayISO = now.toISOString().split("T")[0];

    const upcoming = settings.customReminders
      .filter((reminder) => {
        if (!reminder.enabled) return false;

        // Check schedule type
        if (reminder.scheduleType === "once") {
          if (reminder.onceDate !== todayISO) return false;
        } else if (reminder.scheduleType === "daily") {
          // Check if today is in the days array
          const isEveryDay = reminder.days.includes("Every day");
          const isToday = reminder.days.includes(today);
          if (!isEveryDay && !isToday) return false;
        } else if (reminder.scheduleType === "interval") {
          // Interval reminders don't have a specific time, skip them
          return false;
        }

        // Check if the reminder time is in the future
        const [hours, minutes] = reminder.time.split(":").map(Number);
        const reminderTime = hours * 60 + minutes;
        return reminderTime > currentTime;
      })
      .sort((a, b) => {
        // Sort by time
        const [aHours, aMinutes] = a.time.split(":").map(Number);
        const [bHours, bMinutes] = b.time.split(":").map(Number);
        const aTime = aHours * 60 + aMinutes;
        const bTime = bHours * 60 + bMinutes;
        return aTime - bTime;
      })
      .slice(0, 3); // Only show up to 3

    return upcoming;
  }, [settings.customReminders]);

  // Don't render if no upcoming reminders
  if (upcomingReminders.length === 0) {
    return null;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getTimeUntil = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const reminderTime = hours * 60 + minutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const diff = reminderTime - currentTime;

    if (diff < 60) {
      return `${diff}m`;
    }
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  return (
    <section className="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border-none">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2 sm:gap-3 text-foreground">
          <IconBell className="size-5 sm:size-6 text-primary" />
          Upcoming Today
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Next {upcomingReminders.length}{" "}
          {upcomingReminders.length === 1 ? "reminder" : "reminders"}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcomingReminders.map(
          ({ id, icon: Icon, title, description, time }) => (
            <div
              key={id}
              className="flex flex-col gap-3 p-4 sm:p-5 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-border transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-105 transition-transform">
                  {Icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-sm sm:text-base mb-0.5 line-clamp-1">
                    {title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-1.5 text-primary">
                  <IconClock className="size-3.5 sm:size-4" />
                  <span className="text-xs sm:text-sm font-bold tabular-nums">
                    {formatTime(time)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {getTimeUntil(time)}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
