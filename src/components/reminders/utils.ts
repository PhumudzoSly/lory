import type {
  CustomReminder,
  ReminderPriority,
  ReminderScheduleType,
} from "../../lib/buddyConfig";

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const generateId = (): string => Math.random().toString(36).slice(2, 9);

export const formatDateLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const formatTimeLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatScheduleLabel = (reminder: CustomReminder): string => {
  if (reminder.scheduleType === "once") {
    return reminder.onceDate ? `Once on ${reminder.onceDate}` : "Once";
  }
  if (reminder.scheduleType === "interval") {
    return `Every ${Math.max(1, reminder.intervalMinutes ?? 60)} minutes`;
  }
  if (reminder.days.includes("Every day")) return "Every day";
  return reminder.days.join(", ");
};

export const normalizeReminder = (
  draft: Partial<CustomReminder>,
): CustomReminder => {
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
