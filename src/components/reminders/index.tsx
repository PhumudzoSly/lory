import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  IconBell,
  IconBellRinging,
  IconCalendarTime,
  IconChevronDown,
  IconChevronUp,
  IconHistory,
} from "@tabler/icons-react";
import type {
  AppSettings,
  CustomReminder,
  ReminderPriority,
  ReminderScheduleType,
} from "../../lib/buddyConfig";
import { Button } from "./../ui/button";
import { Input } from "./../ui/input";
import { Textarea } from "./../ui/textarea";
import AddNewReminder from "./add-new";

type ReminderSettingsProps = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const generateId = (): string => Math.random().toString(36).slice(2, 9);

const formatDateLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (dateKey === todayKey) {
    return "Today";
  }
  if (dateKey === yesterdayKey) {
    return "Yesterday";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const formatTimeLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatScheduleLabel = (reminder: CustomReminder): string => {
  if (reminder.scheduleType === "once") {
    return reminder.onceDate ? `Once on ${reminder.onceDate}` : "Once";
  }

  if (reminder.scheduleType === "interval") {
    return `Every ${Math.max(1, reminder.intervalMinutes ?? 60)} minutes`;
  }

  if (reminder.days.includes("Every day")) {
    return "Every day";
  }

  return reminder.days.join(", ");
};

const normalizeReminder = (draft: Partial<CustomReminder>): CustomReminder => {
  const scheduleType = (draft.scheduleType ?? "daily") as ReminderScheduleType;

  return {
    id: draft.id ?? generateId(),
    title: (draft.title ?? "New Reminder").trim() || "New Reminder",
    description: draft.description ?? "",
    time: draft.time ?? "12:00",
    days: draft.days && draft.days.length > 0 ? draft.days : ["Every day"],
    enabled: draft.enabled ?? true,
    icon: draft.icon ?? "bell-ringing",
    scheduleType,
    onceDate:
      scheduleType === "once"
        ? (draft.onceDate ?? new Date().toISOString().slice(0, 10))
        : undefined,
    intervalMinutes:
      scheduleType === "interval"
        ? Math.max(1, Number(draft.intervalMinutes ?? 60))
        : undefined,
    priority: (draft.priority ?? "standard") as ReminderPriority,
    messages: (draft.messages ?? []).filter((m) => m.trim().length > 0),
  };
};

const ReminderIcon = ({
  icon,
  className,
}: {
  icon?: string;
  className?: string;
}) => {
  switch (icon) {
    case "notifications_active":
    case "bell-ringing":
      return <IconBellRinging className={className} />;
    case "notifications":
    case "bell":
    default:
      return <IconBell className={className} />;
  }
};

const ReminderSettings = ({ settings, setSettings }: ReminderSettingsProps) => {
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState<Partial<CustomReminder> | null>(null);

  const openEditor = (reminder: CustomReminder) => {
    setEditingReminder(normalizeReminder(reminder));
    setIsEditing(true);
  };

  const handleSaveReminder = () => {
    if (!editingReminder) {
      return;
    }

    const normalized = normalizeReminder(editingReminder);

    setSettings((prev) => {
      const exists = prev.customReminders.some((r) => r.id === normalized.id);
      return {
        ...prev,
        customReminders: exists
          ? prev.customReminders.map((r) =>
              r.id === normalized.id ? normalized : r,
            )
          : [...prev.customReminders, normalized],
      };
    });

    setExpandedReminderId(normalized.id);
    setIsEditing(false);
    setEditingReminder(null);
  };

  const handleDeleteReminder = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customReminders: prev.customReminders.filter((r) => r.id !== id),
      customReminderHistory: prev.customReminderHistory.filter(
        (h) => h.reminderId !== id,
      ),
    }));

    if (expandedReminderId === id) {
      setExpandedReminderId(null);
    }

    setIsEditing(false);
    setEditingReminder(null);
  };

  const handleToggle = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customReminders: prev.customReminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      ),
    }));
  };

  const activeCount = settings.customReminders.filter((r) => r.enabled).length;

  const sortedHistory = useMemo(
    () =>
      [...settings.customReminderHistory].sort(
        (a, b) =>
          new Date(b.triggeredAtIso).getTime() -
          new Date(a.triggeredAtIso).getTime(),
      ),
    [settings.customReminderHistory],
  );

  const draftScheduleType = (editingReminder?.scheduleType ??
    "daily") as ReminderScheduleType;

  return (
    <>
      <header className="mb-12 max-w-4xl">
        <div className="mb-2 flex items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
            Reminders
          </h2>
        </div>
        <p className="text-lg text-on-surface-variant">
          Manage your rhythmic notifications and gentle nudges.
        </p>
      </header>

      <section className="max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <div className="max-w-md">
            <h3 className="font-headline mb-2 text-2xl font-bold">
              Create New Nudge
            </h3>
            <p className="text-sm text-on-surface-variant">
              Set daily, once-off, or interval reminders to make work hours
              easier.
            </p>
          </div>
          <AddNewReminder />
        </div>

        {isEditing && editingReminder && (
          <div className="mb-12 rounded-2xl border border-outline/20 bg-surface-container-highest p-6">
            <h4 className="mb-4 text-lg font-bold text-on-surface">
              Edit Reminder
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Title
                </label>
                <Input
                  type="text"
                  value={editingReminder.title ?? ""}
                  onChange={(e) =>
                    setEditingReminder((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                                ? Math.max(
                                    1,
                                    Number(prev?.intervalMinutes ?? 60),
                                  )
                                : undefined,
                          }))
                        }
                        className={[
                          "rounded-xl border p-3 text-sm font-semibold transition-colors",
                          selected
                            ? "border-primary bg-primary-fixed text-on-primary-fixed"
                            : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-bright",
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                        (editingReminder.days ?? ["Every day"]).includes(
                          "Every day",
                        )
                          ? "border-primary bg-primary-container text-on-primary-container"
                          : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant",
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
                                days:
                                  nextDays.length > 0
                                    ? nextDays
                                    : ["Every day"],
                              };
                            })
                          }
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                            selected
                              ? "border-primary bg-primary-container text-on-primary-container"
                              : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant",
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
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {draftScheduleType === "interval" && (
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Interval Minutes
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={editingReminder.intervalMinutes ?? 60}
                    onChange={(e) =>
                      setEditingReminder((prev) => ({
                        ...prev,
                        intervalMinutes: Math.max(
                          1,
                          Number(e.target.value || 1),
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                  placeholder={
                    "Take a walk\nDrink water\nStretch your shoulders"
                  }
                  className="h-24 w-full resize-none rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
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
                            ? "border-primary bg-primary-fixed text-on-primary-fixed"
                            : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-bright",
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
                  onClick={() =>
                    handleDeleteReminder(editingReminder.id as string)
                  }
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-lg px-4 py-2 font-semibold text-error transition-colors hover:bg-error/10"
                >
                  Delete
                </Button>
              )}

              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditingReminder(null);
                }}
                type="button"
                variant="ghost"
                className="rounded-lg px-4 py-2 font-semibold text-on-surface-variant transition-colors hover:bg-surface-container/50"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveReminder}
                type="button"
                className="rounded-lg bg-primary px-6 py-2 font-semibold text-on-primary transition-colors hover:bg-primary-dim"
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h4 className="font-headline flex items-center gap-2 text-lg font-bold">
                <IconCalendarTime className="size-5 shrink-0 text-primary" />
                Upcoming Reminders
              </h4>
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-primary-container">
                {activeCount} Active
              </span>
            </div>

            <div className="space-y-4">
              {settings.customReminders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low p-8 text-center text-on-surface-variant">
                  <p className="text-sm font-medium">
                    No custom reminders created yet.
                  </p>
                  <p className="mt-1 text-xs">
                    Add one to get notified at specific times.
                  </p>
                </div>
              ) : (
                settings.customReminders.map((reminder) => {
                  const expanded = expandedReminderId === reminder.id;

                  return (
                    <div
                      key={reminder.id}
                      className={[
                        "group rounded-xl bg-surface-container-lowest p-6 transition-all duration-500",
                        !reminder.enabled
                          ? "opacity-60 grayscale"
                          : "hover:bg-surface-bright hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setExpandedReminderId((prev) =>
                            prev === reminder.id ? null : reminder.id,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setExpandedReminderId((prev) =>
                              prev === reminder.id ? null : reminder.id,
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
                                handleToggle(reminder.id);
                              }}
                              className={[
                                "h-14 w-14 shrink-0 rounded-2xl text-2xl transition-transform group-hover:scale-105",
                                reminder.enabled
                                  ? "bg-primary-container text-on-primary-container hover:bg-primary/20"
                                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-dim",
                              ].join(" ")}
                            >
                              <ReminderIcon
                                icon={reminder.icon}
                                className="size-6"
                              />
                            </Button>

                            <div>
                              <h5 className="mb-1 flex items-center gap-2 font-bold text-on-surface transition-colors group-hover:text-primary">
                                {reminder.title}
                                {expanded ? (
                                  <IconChevronUp className="size-4" />
                                ) : (
                                  <IconChevronDown className="size-4" />
                                )}
                              </h5>
                              <p className="max-w-50 truncate text-xs text-on-surface-variant">
                                {reminder.description || "Custom nudge"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-headline block text-xl font-extrabold text-primary">
                              {reminder.scheduleType === "interval"
                                ? `${Math.max(1, reminder.intervalMinutes ?? 60)}m`
                                : reminder.time}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-outline">
                              {formatScheduleLabel(reminder)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {expanded && (
                        <div className="mt-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
                          <div className="mb-3 grid grid-cols-1 gap-3 text-xs text-on-surface-variant md:grid-cols-3">
                            <p>
                              <span className="font-bold uppercase tracking-wider text-on-surface">
                                Type
                              </span>
                              <br />
                              {reminder.scheduleType}
                            </p>
                            <p>
                              <span className="font-bold uppercase tracking-wider text-on-surface">
                                Priority
                              </span>
                              <br />
                              {reminder.priority ?? "standard"}
                            </p>
                            <p>
                              <span className="font-bold uppercase tracking-wider text-on-surface">
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
                              onClick={() => openEditor(reminder)}
                              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-dim"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="rounded-lg border border-error/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-error transition-colors hover:bg-error/10"
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

          <div className="lg:col-span-1 flex flex-col gap-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8">
            <h4 className="font-headline flex items-center gap-2 text-lg font-bold">
              <IconHistory className="size-5 shrink-0 text-on-surface-variant" />
              Recent Triggered
            </h4>

            <div className="relative flex-1 space-y-6">
              <div className="absolute bottom-2 left-3 top-2 w-px bg-outline-variant/30"></div>

              {sortedHistory.length === 0 ? (
                <div className="relative pl-10">
                  <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-outline ring-4 ring-surface-container-low"></div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    No Activity Yet
                  </p>
                  <h6 className="text-sm font-semibold">
                    Triggers will appear here
                  </h6>
                  <p className="text-xs italic text-outline">
                    Fire a reminder to start your timeline.
                  </p>
                </div>
              ) : (
                sortedHistory.slice(0, 8).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={[
                      "relative pl-10",
                      index > 2 ? "opacity-80" : "",
                    ].join(" ")}
                  >
                    <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-surface-container-low"></div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      {formatDateLabel(entry.triggeredAtIso)}
                    </p>
                    <h6 className="text-sm font-semibold">{entry.title}</h6>
                    <p className="text-xs italic text-outline">
                      {entry.action} at {formatTimeLabel(entry.triggeredAtIso)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  customReminderHistory: [],
                }))
              }
              className="mt-auto w-full rounded-xl border border-outline-variant/20 py-3 text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              Clear History
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReminderSettings;
