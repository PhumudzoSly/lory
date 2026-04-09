import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  AppSettings,
  CustomReminder,
  PendingAction,
} from "../../lib/buddyConfig";
import { ReminderEditorDialog } from "./reminder-editor-dialog";
import { ReminderList } from "./reminder-list";
import { HistoryPanel } from "./history-panel";
import { normalizeReminder, generateId } from "./utils";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
  highlightedPendingActionId?: string | null;
  onPendingActionHandled?: () => void;
};

const sourceLabel: Record<PendingAction["source"], string> = {
  break: "Break",
  work: "Work",
  custom: "Reminder",
};

export function ReminderSettings({
  settings,
  setSettings,
  highlightedPendingActionId,
  onPendingActionHandled,
}: Props) {
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(
    null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState<Partial<CustomReminder> | null>(null);

  const openEditorForNewReminder = () => {
    setEditingReminder({
      id: generateId(),
      title: "",
      description: "",
      time: "12:00",
      days: ["Every day"],
      enabled: true,
      icon: "notifications_active",
      scheduleType: "daily",
      priority: "standard",
      messages: [],
    });
    setIsEditorOpen(true);
  };

  const openEditor = (reminder: CustomReminder) => {
    setEditingReminder(normalizeReminder(reminder));
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editingReminder) return;
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
    setIsEditorOpen(false);
    setEditingReminder(null);
  };

  const handleDelete = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customReminders: prev.customReminders.filter((r) => r.id !== id),
      customReminderHistory: prev.customReminderHistory.filter(
        (h) => h.reminderId !== id,
      ),
    }));
    if (expandedReminderId === id) setExpandedReminderId(null);
    setIsEditorOpen(false);
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
  const pendingActions = [...settings.pendingActions].sort((a, b) => {
    if (a.severity !== b.severity) {
      return b.severity - a.severity;
    }
    return b.lastTriggeredAt - a.lastTriggeredAt;
  });

  const removePendingAction = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      pendingActions: prev.pendingActions.filter((item) => item.id !== id),
    }));
    onPendingActionHandled?.();
  };

  useEffect(() => {
    if (!highlightedPendingActionId) {
      return;
    }
    const highlightedAction = settings.pendingActions.find(
      (item) => item.id === highlightedPendingActionId,
    );
    if (!highlightedAction || highlightedAction.source !== "custom") {
      return;
    }
    if (highlightedAction.targetId) {
      setExpandedReminderId(highlightedAction.targetId);
    }
  }, [highlightedPendingActionId, settings.pendingActions]);

  return (
    <>
      <header className="mb-12 max-w-4xl">
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
          Reminders
        </h2>
        <p className="text-lg text-muted-foreground">
          Manage your rhythmic notifications and gentle nudges.
        </p>
      </header>

      <section className="max-w-6xl">
        {pendingActions.length > 0 && (
          <div className="mb-8 rounded-2xl border border-amber-300/40 bg-amber-50/60 p-5 dark:border-amber-400/30 dark:bg-amber-500/10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Action Center
                </h3>
                <p className="text-sm text-muted-foreground">
                  Acknowledge these updates to clear buddy escalation.
                </p>
              </div>
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                {pendingActions.length} unresolved
              </span>
            </div>

            <div className="space-y-3">
              {pendingActions.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border border-border/60 bg-card p-3 ${
                    highlightedPendingActionId === item.id
                      ? "ring-2 ring-amber-500"
                      : ""
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      {sourceLabel[item.source]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-muted-foreground">
                      Last triggered{" "}
                      {new Date(item.lastTriggeredAt).toLocaleTimeString()}
                    </p>
                    <button
                      type="button"
                      className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                      onClick={() => removePendingAction(item.id)}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12 flex items-end justify-between">
          <div className="max-w-md">
            <h3 className="mb-2 text-2xl font-bold">Create New Nudge</h3>
            <p className="text-sm text-muted-foreground">
              Set daily, once-off, or interval reminders to make work hours
              easier.
            </p>
          </div>
          <Button
            onClick={openEditorForNewReminder}
            className="gap-2"
          >
            <IconPlus className="size-4" />
            Add Reminder
          </Button>
        </div>

        <ReminderEditorDialog
          open={isEditorOpen}
          editingReminder={editingReminder}
          setEditingReminder={setEditingReminder}
          onSave={handleSave}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingReminder(null);
          }}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ReminderList
            reminders={settings.customReminders}
            activeCount={activeCount}
            expandedReminderId={expandedReminderId}
            setExpandedReminderId={setExpandedReminderId}
            onToggle={handleToggle}
            onEdit={openEditor}
            onDelete={handleDelete}
          />
          <HistoryPanel
            history={settings.customReminderHistory}
            onClear={() =>
              setSettings((prev) => ({
                ...prev,
                customReminderHistory: [],
              }))
            }
          />
        </div>
      </section>
    </>
  );
}
