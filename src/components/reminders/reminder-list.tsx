import {
  IconCalendarTime,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import type { CustomReminder } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import { ReminderIcon } from "./reminder-icon";
import { formatScheduleLabel } from "./utils";

type Props = {
  reminders: CustomReminder[];
  activeCount: number;
  expandedReminderId: string | null;
  setExpandedReminderId: (id: string | null) => void;
  onToggle: (id: string) => void;
  onEdit: (reminder: CustomReminder) => void;
  onDelete: (id: string) => void;
};

export function ReminderList({
  reminders,
  activeCount,
  expandedReminderId,
  setExpandedReminderId,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-lg font-bold">
          <IconCalendarTime className="size-5 shrink-0 text-primary" />
          Upcoming Reminders
        </h4>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {activeCount} Active
        </span>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/30 bg-card p-8 text-center text-muted-foreground">
            <p className="text-sm font-medium">
              No custom reminders created yet.
            </p>
            <p className="mt-1 text-xs">
              Add one to get notified at specific times.
            </p>
          </div>
        ) : (
          reminders.map((reminder) => {
            const expanded = expandedReminderId === reminder.id;

            return (
              <div
                key={reminder.id}
                className={[
                  "group rounded-xl bg-background p-6 transition-all duration-500",
                  !reminder.enabled
                    ? "opacity-60 grayscale"
                    : "hover:bg-accent hover:shadow-sm",
                ].join(" ")}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setExpandedReminderId(
                      expandedReminderId === reminder.id ? null : reminder.id,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setExpandedReminderId(
                        expandedReminderId === reminder.id ? null : reminder.id,
                      );
                    }
                  }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-left">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(reminder.id);
                        }}
                        className={[
                          "h-14 w-14 shrink-0 rounded-2xl text-2xl transition-transform group-hover:scale-105",
                          reminder.enabled
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted text-muted-foreground hover:bg-muted",
                        ].join(" ")}
                      >
                        <ReminderIcon
                          icon={reminder.icon}
                          className="size-6"
                        />
                      </Button>

                      <div>
                        <h5 className="mb-1 flex items-center gap-2 font-bold text-foreground transition-colors group-hover:text-primary">
                          {reminder.title}
                          {expanded ? (
                            <IconChevronUp className="size-4" />
                          ) : (
                            <IconChevronDown className="size-4" />
                          )}
                        </h5>
                        <p className="max-w-50 truncate text-xs text-muted-foreground">
                          {reminder.description || "Custom nudge"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-xl font-extrabold text-primary">
                        {reminder.scheduleType === "interval"
                          ? `${Math.max(1, reminder.intervalMinutes ?? 60)}m`
                          : reminder.time}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                        {formatScheduleLabel(reminder)}
                      </span>
                    </div>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-4 rounded-xl border border-border/20 bg-card p-4">
                    <div className="mb-3 grid grid-cols-1 gap-3 text-xs text-muted-foreground md:grid-cols-3">
                      <p>
                        <span className="font-bold uppercase tracking-wider text-foreground">
                          Type
                        </span>
                        <br />
                        {reminder.scheduleType}
                      </p>
                      <p>
                        <span className="font-bold uppercase tracking-wider text-foreground">
                          Priority
                        </span>
                        <br />
                        {reminder.priority ?? "standard"}
                      </p>
                      <p>
                        <span className="font-bold uppercase tracking-wider text-foreground">
                          Roulette Lines
                        </span>
                        <br />
                        {(reminder.messages ?? []).length}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onEdit(reminder)}
                        className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(reminder.id)}
                        className="rounded-lg border border-destructive/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-destructive transition-colors hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
