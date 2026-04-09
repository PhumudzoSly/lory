import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import type { CustomReminder } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from "../ui/item";
import { ReminderIcon } from "./reminder-icon";
import { formatScheduleLabel } from "./utils";

type Props = {
  reminder: CustomReminder;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggle: (id: string) => void;
  onEdit: (reminder: CustomReminder) => void;
  onDelete: (id: string) => void;
};

export function ReminderCard({
  reminder,
  isExpanded,
  onToggleExpand,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    onDelete(reminder.id);
  };

  return (
    <div className="space-y-0">
      <Item
        variant={reminder.enabled ? "outline" : "muted"}
        className={`cursor-pointer transition-all duration-200 ${
          !reminder.enabled ? "opacity-60 grayscale" : "hover:border-primary/50"
        }`}
        onClick={onToggleExpand}
      >
        <ItemMedia
          variant="icon"
          className="shrink-0"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(reminder.id);
            }}
            className={`rounded-lg transition-all ${
              reminder.enabled
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <ReminderIcon icon={reminder.icon} className="size-5" />
          </Button>
        </ItemMedia>

        <ItemContent>
          <ItemTitle className="flex items-center gap-2">
            <span>{reminder.title}</span>
            <span className="ml-auto">
              {isExpanded ? (
                <IconChevronUp className="size-4" />
              ) : (
                <IconChevronDown className="size-4" />
              )}
            </span>
          </ItemTitle>
          <ItemDescription>
            {reminder.description || "Custom nudge"}
          </ItemDescription>
        </ItemContent>

        <ItemActions className="ml-auto">
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {reminder.scheduleType === "interval"
                ? `${Math.max(1, reminder.intervalMinutes ?? 60)}m`
                : reminder.time}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
              {formatScheduleLabel(reminder)}
            </div>
          </div>
        </ItemActions>
      </Item>

      {isExpanded && (
        <div className="border-x border-b border-border/50 bg-card/50 px-4 py-4">
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Type
              </p>
              <p className="mt-1 text-sm font-medium text-foreground capitalize">
                {reminder.scheduleType}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Priority
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1">
                <span className="text-xs font-semibold capitalize text-primary">
                  {reminder.priority ?? "standard"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Roulette Lines
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {(reminder.messages ?? []).length}
              </p>
            </div>
          </div>

          {reminder.description && (
            <div className="mb-4 rounded-md bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">{reminder.description}</p>
            </div>
          )}

          <ItemActions className="gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(reminder);
              }}
              className="flex items-center gap-2"
            >
              <IconEdit className="size-4" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <IconTrash className="size-4" />
              Delete
            </Button>
          </ItemActions>
        </div>
      )}
    </div>
  );
}
