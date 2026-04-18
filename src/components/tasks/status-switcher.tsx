import * as React from "react";
import {
  IconCircle,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type TaskStatus = "todo" | "in_progress" | "done";

interface StatusSwitcherProps {
  readonly status: TaskStatus;
  readonly onStatusChange: (status: TaskStatus) => void;
  readonly className?: string;
  readonly withLabel?: boolean;
}

const statusOptions = [
  {
    value: "todo",
    label: "To Do",
    icon: IconCircle,
    color: "text-muted-foreground/60",
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: IconCircleDashed,
    color: "text-blue-500/80",
  },
  {
    value: "done",
    label: "Done",
    icon: IconCircleCheck,
    color: "text-green-500/80",
  },
] as const;

export function StatusSwitcher({
  status,
  onStatusChange,
  className,
  withLabel = false,
}: StatusSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const currentStatus =
    statusOptions.find((s) => s.value === status) || statusOptions[0];
  const Icon = currentStatus.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "task-list-checkbox flex items-center justify-center rounded transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border",
            withLabel ? "gap-2 px-1.5 py-0.5" : "p-0.5 mt-0.5 shrink-0",
            className,
          )}
        >
          <Icon size={withLabel ? 16 : 14} className={currentStatus.color} />
          {withLabel && (
            <span className="text-[12px] font-medium text-foreground/70">
              {currentStatus.label}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-40 p-0"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {statusOptions.map((option) => {
                const ItemIcon = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(value) => {
                      onStatusChange(value as TaskStatus);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <ItemIcon size={14} className={option.color} />
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
