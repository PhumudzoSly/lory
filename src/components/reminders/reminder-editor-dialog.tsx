import type { Dispatch, SetStateAction } from "react";
import type { CustomReminder, ReminderScheduleType } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { WEEK_DAYS } from "./utils";

type Props = {
  open: boolean;
  editingReminder: Partial<CustomReminder> | null;
  setEditingReminder: Dispatch<SetStateAction<Partial<CustomReminder> | null>>;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

export function ReminderEditorDialog({
  open,
  editingReminder,
  setEditingReminder,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  if (!editingReminder) return null;

  const draftScheduleType = (editingReminder.scheduleType ??
    "daily") as ReminderScheduleType;
  const isNewReminder = !editingReminder.id;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewReminder ? "Create New Reminder" : "Edit Reminder"}
          </DialogTitle>
          <DialogDescription>
            Set up a reminder to help you maintain your routine
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title
              </label>
              <Input
                type="text"
                placeholder="e.g., Take a break"
                value={editingReminder.title ?? ""}
                onChange={(e) =>
                  setEditingReminder((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </label>
              <Input
                type="time"
                value={editingReminder.time ?? "12:00"}
                onChange={(e) =>
                  setEditingReminder((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Reminder Type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reminder Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["daily", "Daily"],
                  ["once", "Once-Off"],
                  ["interval", "Every X Minutes"],
                ] as const
              ).map(([typeValue, label]) => {
                const selected = draftScheduleType === typeValue;
                return (
                  <Button
                    key={typeValue}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    onClick={() =>
                      setEditingReminder((prev) => ({
                        ...prev,
                        scheduleType: typeValue,
                        onceDate:
                          typeValue === "once"
                            ? prev?.onceDate ??
                              new Date().toISOString().slice(0, 10)
                            : undefined,
                        intervalMinutes:
                          typeValue === "interval"
                            ? Math.max(1, Number(prev?.intervalMinutes ?? 60))
                            : undefined,
                      }))
                    }
                    className="rounded-lg"
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Daily Schedule */}
          {draftScheduleType === "daily" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Days
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={
                    (editingReminder.days ?? ["Every day"]).includes(
                      "Every day"
                    )
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setEditingReminder((prev) => ({
                      ...prev,
                      days: ["Every day"],
                    }))
                  }
                  className="rounded-full"
                >
                  Every day
                </Button>
                {WEEK_DAYS.map((day) => {
                  const selected =
                    !(editingReminder.days ?? ["Every day"]).includes(
                      "Every day"
                    ) && (editingReminder.days ?? []).includes(day);

                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setEditingReminder((prev) => {
                          const currentDays = (
                            prev?.days ?? ["Every day"]
                          ).filter((item) => item !== "Every day");
                          const nextDays = currentDays.includes(day)
                            ? currentDays.filter((item) => item !== day)
                            : [...currentDays, day];
                          return {
                            ...prev,
                            days:
                              nextDays.length > 0 ? nextDays : ["Every day"],
                          };
                        })
                      }
                      className="rounded-full"
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Once-Off Date */}
          {draftScheduleType === "once" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </label>
              <Input
                type="date"
                value={
                  editingReminder.onceDate ??
                  new Date().toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setEditingReminder((prev) => ({
                    ...prev,
                    onceDate: e.target.value,
                  }))
                }
              />
            </div>
          )}

          {/* Interval Minutes */}
          {draftScheduleType === "interval" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Interval (Minutes)
              </label>
              <Input
                type="number"
                min={1}
                value={editingReminder.intervalMinutes ?? 60}
                onChange={(e) =>
                  setEditingReminder((prev) => ({
                    ...prev,
                    intervalMinutes: Math.max(1, Number(e.target.value || 1)),
                  }))
                }
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <Input
              type="text"
              placeholder="Additional context for this reminder"
              value={editingReminder.description ?? ""}
              onChange={(e) =>
                setEditingReminder((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Roulette Messages */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Roulette Messages (One per line)
            </label>
            <Textarea
              value={(editingReminder.messages ?? []).join("\n")}
              onChange={(e) =>
                setEditingReminder((prev) => ({
                  ...prev,
                  messages: e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0),
                }))
              }
              placeholder={"Take a walk\nDrink water\nStretch your shoulders"}
              className="h-24 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add 1-3 messages that will be randomly shown
            </p>
          </div>

          {/* Aggressiveness/Priority */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aggressiveness Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["gentle", "standard", "nag"] as const).map((level) => {
                const selected = (editingReminder.priority ?? "standard") === level;
                return (
                  <label
                    key={level}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={selected}
                      onChange={() =>
                        setEditingReminder((prev) => ({
                          ...prev,
                          priority: level,
                        }))
                      }
                      className="hidden"
                    />
                    <div
                      className={`rounded-lg border p-3 text-center text-sm font-semibold capitalize transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {level}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              How persistent should this reminder be?
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between pt-6">
          {editingReminder.id && (
            <Button
              onClick={() => onDelete(editingReminder.id as string)}
              type="button"
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          )}
          <div className="ml-auto flex gap-3">
            <Button
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={onSave} type="button">
              {isNewReminder ? "Create" : "Save"} Reminder
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
