import { IconCalendarTime } from "@tabler/icons-react";
import type { CustomReminder } from "../../lib/buddyConfig";
import { ReminderCard } from "./reminder-card";
import { ItemGroup } from "../ui/item";

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
        <ItemGroup>
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              isExpanded={expandedReminderId === reminder.id}
              onToggleExpand={() =>
                setExpandedReminderId(
                  expandedReminderId === reminder.id ? null : reminder.id,
                )
              }
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
