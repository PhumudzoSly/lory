import * as React from "react";
import { format } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Matcher } from "react-day-picker";

interface DateSwitcherProps {
  readonly date?: string;
  readonly onDateChange: (date?: string) => void;
  readonly className?: string;
  readonly withLabel?: boolean;
  readonly disabled?: Matcher | Matcher[];
}

export function DateSwitcher({
  date,
  onDateChange,
  className,
  disabled,
}: DateSwitcherProps) {
  const [open, setOpen] = React.useState(false);

  const parsedDate = date ? new Date(date) : undefined;

  // Format for display: e.g. "Today", "Tomorrow", or "Apr 18"
  const getDisplayDate = () => {
    if (!parsedDate) return "No date";

    // Could add more complex natural language date parsing here
    return format(parsedDate, "MMM d, yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "flex items-center border gap-2 rounded px-2 py-1 transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border",
            !date && "text-muted-foreground/50",
            className,
          )}
        >
          <IconCalendar
            size={14}
            className={date ? "text-blue-500/80" : "opacity-70"}
          />
          <span
            className={cn(
              "text-[12px] font-medium transition-colors",
              date ? "text-foreground/70" : "text-muted-foreground/50",
            )}
          >
            {date ? getDisplayDate() : "Empty"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(newDate) => {
            onDateChange(newDate ? newDate.toISOString() : undefined);
            setOpen(false);
          }}
          disabled={disabled}
          defaultMonth={parsedDate}
          initialFocus
        />
        <div className="border-t p-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDateChange(undefined);
              setOpen(false);
            }}
            className="w-full rounded bg-secondary/20 px-2 py-1 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
