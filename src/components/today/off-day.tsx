import {
  IconCalendar,
  IconCoffee,
  IconPlant,
  IconMusic,
} from "@tabler/icons-react";

interface OffDayProps {
  onStartWorking: () => void;
  hasSavedSchedule: boolean;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
}

/**
 * OffDay component - Subtle, typography-driven UI for when the user is not working.
 */
export const OffDay = ({
  onStartWorking,
  hasSavedSchedule,
  scheduledStartTime,
  scheduledEndTime,
}: OffDayProps) => {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const suggestions = [
    {
      label: "Unwind",
      value: "Take it Easy",
      icon: IconCoffee,
      color: "text-orange-400",
      description: "Read a book, watch a show",
    },
    {
      label: "Outdoors",
      value: "Get Outside",
      icon: IconPlant,
      color: "text-green-500",
      description: "Go for a walk or hike",
    },
    {
      label: "Hobbies",
      value: "Creative Time",
      icon: IconMusic,
      color: "text-purple-500",
      description: "Work on personal projects",
    },
  ];

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
            Day Off
          </h1>
          <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
            {hasSavedSchedule
              ? "Your saved schedule marks today as an off day. Take some time to rest, recharge, and focus on yourself."
              : "No saved schedule was found yet, so today is treated as an off day. Take some time to rest and recharge."}
          </p>
          {scheduledStartTime && scheduledEndTime ? (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Planned shift window: {scheduledStartTime} - {scheduledEndTime}
            </p>
          ) : null}
        </div>
      </header>

      {/* Suggestions row */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {suggestions.map((item) => (
          <div
            key={item.label}
            className="group flex flex-col space-y-1.5 cursor-default"
          >
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <item.icon size={15} stroke={2.5} className={item.color} />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground/90">
              {item.value}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground/40">
              {item.description}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={onStartWorking}
          className="text-[13px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4"
        >
          Actually, I need to work today
        </button>
      </div>
    </div>
  );
};

export default OffDay;
