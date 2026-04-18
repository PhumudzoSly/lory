import { useState, useEffect } from "react";
import {
  IconClock,
  IconCoffee,
  IconHourglassHigh,
  IconCalendar,
} from "@tabler/icons-react";
import OffDay from "./off-day";
import { ShiftModals } from "./shift-modals";
import ShiftStart from "./shift-start";

/**
 * Work component - Notion inspired summary of today's progress.
 * Focuses on information density, subtle borders, and typography.
 */
const Work = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const [isOffDay, setIsOffDay] = useState(isWeekend);
  const [shiftState, setShiftState] = useState<"not-started" | "in-progress">(
    "not-started",
  );
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const [remainingTime, setRemainingTime] = useState("0h 0m");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(17, 0, 0, 0); // 5 PM today

      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime("0h 0m");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingTime(`${hours}h ${minutes}m`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Worked",
      value: "5.5h",
      icon: IconClock,
      color: "text-blue-500",
      description: "2.5h to go",
    },
    {
      label: "Remaining",
      value: remainingTime,
      icon: IconHourglassHigh,
      color: "text-orange-500",
      description: "Ends at 5 PM",
    },
    {
      label: "Next Break",
      value: "15m",
      icon: IconCoffee,
      color: "text-green-500",
      description: "Coffee soon",
    },
  ];

  if (isOffDay) {
    return <OffDay onStartWorking={() => setIsOffDay(false)} />;
  }

  if (shiftState === "not-started") {
    return (
      <>
        <ShiftStart
          dateString={dateString}
          onTakeDayOff={() => setIsOffDay(true)}
          onStartShiftClick={() => setIsShiftModalOpen(true)}
        />
        <ShiftModals
          shiftState={shiftState}
          isOpen={isShiftModalOpen}
          onOpenChange={setIsShiftModalOpen}
          onStartShift={(data) => {
            console.log("Shift started with:", data);
            setShiftState("in-progress");
          }}
          onEndShift={() => {}}
        />
      </>
    );
  }

  return (
    <div className="mx-auto  space-y-10 py-6 px-4">
      {/* Date Header: Minimal, tracking-widest, subtle hover */}
      <header className="space-y-3">
        <div className="flex w-fit items-center gap-2 border-b border-transparent pb-0.5 text-muted-foreground/30 transition-colors group hover:border-border/40">
          <IconCalendar
            size={11}
            stroke={2.5}
            className="transition-colors group-hover:text-foreground/50"
          />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-foreground/50">
            {dateString}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
              Today
            </h1>
            <button
              onClick={() => setIsOffDay(true)}
              className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/40 hover:text-foreground/70 transition-colors"
            >
              Take the day off
            </button>
          </div>
          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            Overview of your workday progress and upcoming milestones.
          </p>
        </div>
      </header>

      {/* Stats row: Borderless, simple text-based metrics instead of bulky cards */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col space-y-1.5 cursor-default"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <stat.icon size={12} stroke={2.5} className={stat.color} />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="tabular-nums text-2xl font-bold tracking-tight text-foreground/80">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/30">
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/10 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-0.5">
            <div className="relative flex size-1 items-center justify-center">
              <div className="absolute size-full animate-ping rounded-full bg-green-500/30" />
              <div className="relative size-1 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
              Active: <span className="text-foreground/40">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShiftModalOpen(true)}
              className="text-[11px] font-semibold uppercase tracking-wider text-red-500/60 hover:text-red-500 transition-colors"
            >
              End Shift Early
            </button>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
      <ShiftModals
        shiftState={shiftState}
        isOpen={isShiftModalOpen}
        onOpenChange={setIsShiftModalOpen}
        onStartShift={() => {}}
        onEndShift={() => setShiftState("not-started")}
      />
    </div>
  );
};

export default Work;
