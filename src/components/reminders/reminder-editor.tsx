import type { Dispatch, SetStateAction } from "react";
import type { CustomReminder, ReminderScheduleType } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { WEEK_DAYS } from "./utils";

type Props = {
  editingReminder: Partial<CustomReminder>;
  setEditingReminder: Dispatch<SetStateAction<Partial<CustomReminder> | null>>;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

export function ReminderEditor({
  editingReminder,
  setEditingReminder,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const draftScheduleType = (editingReminder.scheduleType ??
    "daily") as ReminderScheduleType;

  return (
    <div className="mb-12 rounded-2xl border border-border/20 bg-accent p-6">
      <h4 className="mb-4 text-lg font-bold text-foreground">Edit Reminder</h4>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Title
          </label>
          <Input
            type="text"
            value={editingReminder.title ?? ""}
            onChange={(e) =>
              setEditingReminder((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Time
          </label>
          <Input
            type="time"
            value={editingReminder.time ?? "12:00"}
            onChange={(e) =>
              setEditingReminder((prev) => ({ ...prev, time: e.target.value }))
            }
          />
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                  variant="ghost"
                  onClick={() =>
                    setEditingReminder((prev) => ({
                      ...prev,
                      scheduleType: typeValue,
                      onceDate:
                        typeValue === "once"
                          ? (prev?.onceDate ??
                            new Date().toISOString().slice(0, 10))
                          : undefined,
                      intervalMinutes:
                        typeValue === "interval"
                          ? Math.max(1, Number(prev?.intervalMinutes ?? 60))
                          : undefined,
                    }))
                  }
                  className={[
                    "rounded-xl border p-3 text-sm font-semibold transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/30 bg-background text-foreground hover:bg-accent",
                  ].join(" ")}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {draftScheduleType === "daily" && (
          <div className="col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Days
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setEditingReminder((prev) => ({
                    ...prev,
                    days: ["Every day"],
                  }))
                }
                className={[
                  "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                  (editingReminder.days ?? ["Every day"]).includes("Every day")
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 bg-background text-muted-foreground",
                ].join(" ")}
              >
                Every day
              </Button>
              {WEEK_DAYS.map((day) => {
                const selected =
                  !(editingReminder.days ?? ["Every day"]).includes(
                    "Every day",
                  ) && (editingReminder.days ?? []).includes(day);

                return (
                  <Button
                    key={day}
                    type="button"
                    variant="ghost"
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
                          days: nextDays.length > 0 ? nextDays : ["Every day"],
                        };
                      })
                    }
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/40 bg-background text-muted-foreground",
                    ].join(" ")}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {draftScheduleType === "once" && (
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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

        {draftScheduleType === "interval" && (
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interval Minutes
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

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </label>
          <Input
            type="text"
            value={editingReminder.description ?? ""}
            onChange={(e) =>
              setEditingReminder((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Aggressiveness
          </label>
          <div className="flex gap-4">
            {(["gentle", "standard", "nag"] as const).map((level) => {
              const selected =
                (editingReminder.priority ?? "standard") === level;
              return (
                <label
                  key={level}
                  className={[
                    "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold capitalize shadow-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/30 bg-background text-foreground hover:bg-accent",
                  ].join(" ")}
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
                  {level}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {editingReminder.id && (
          <Button
            onClick={() => onDelete(editingReminder.id as string)}
            type="button"
            variant="ghost"
            className="mr-auto rounded-lg px-4 py-2 font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            Delete
          </Button>
        )}

        <Button
          onClick={onCancel}
          type="button"
          variant="ghost"
          className="rounded-lg px-4 py-2 font-semibold text-muted-foreground transition-colors hover:bg-card/50"
        >
          Cancel
        </Button>

        <Button
          onClick={onSave}
          type="button"
          className="rounded-lg px-6 py-2 font-semibold"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
