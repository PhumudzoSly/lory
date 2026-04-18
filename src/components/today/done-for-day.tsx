import { IconCalendar, IconCheck, IconClock } from "@tabler/icons-react";

interface DoneForDayProps {
  onStartWorking: () => void;
  workedMinutes: number;
}

const formatDuration = (minutes: number): string => {
  if (minutes <= 0) {
    return "0h 0m";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const DoneForDay = ({
  onStartWorking,
  workedMinutes,
}: DoneForDayProps) => {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeString = formatDuration(workedMinutes);

  return (
    <div className="mx-auto w-full space-y-10 py-6 px-4">
      {/* Date Header */}
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
            Done for the day
          </h1>
          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            Great job! You've finished your work session for today. Take some
            time to rest and recharge for tomorrow.
          </p>
        </div>
      </header>

      {/* Stats/Suggestions */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        <div className="group flex flex-col space-y-1.5 cursor-default">
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <IconClock size={15} stroke={2.5} className="text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Time Worked
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground/90">
            {timeString}
          </span>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground/40">
            Total time logged today
          </span>
        </div>

        <div className="group flex flex-col space-y-1.5 cursor-default">
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <IconCheck size={15} stroke={2.5} className="text-green-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Status
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground/90">
            Completed
          </span>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground/40">
            Session ended successfully
          </span>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onStartWorking}
          className="text-[13px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4"
        >
          Actually, I need to keep working
        </button>
      </div>
    </div>
  );
};

export default DoneForDay;
