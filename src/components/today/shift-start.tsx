import { IconCalendar, IconClock } from "@tabler/icons-react";

interface ShiftStartProps {
  dateString: string;
  onTakeDayOff: () => void;
  onStartShiftClick: () => void;
}

export const ShiftStart = ({
  dateString,
  onTakeDayOff,
  onStartShiftClick,
}: ShiftStartProps) => {
  return (
    <div className="mx-auto max-w-175 space-y-10 py-6 px-4">
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
              Today
            </h1>
            <button
              onClick={onTakeDayOff}
              className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/40 hover:text-foreground/70 transition-colors"
            >
              Take the day off
            </button>
          </div>
          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            Your workday hasn't started yet.
          </p>
        </div>
      </header>

      <div className="flex items-center justify-center border border-dashed border-border/40 py-16">
        <button
          onClick={onStartShiftClick}
          className="flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="bg-foreground p-3 text-background">
            <IconClock size={20} stroke={2} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground/90">
            Start Your Shift
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShiftStart;
