import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings, CustomReminder } from "../../lib/buddyConfig";
import { AddNewReminder } from "./add-new";
import { ReminderEditor } from "./reminder-editor";
import { ReminderList } from "./reminder-list";
import { HistoryPanel } from "./history-panel";
import { normalizeReminder } from "./utils";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function ReminderSettings({ settings, setSettings }: Props) {
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
    setIsEditing(false);
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
        <div className="mb-12 flex items-end justify-between">
          <div className="max-w-md">
            <h3 className="mb-2 text-2xl font-bold">Create New Nudge</h3>
            <p className="text-sm text-muted-foreground">
              Set daily, once-off, or interval reminders to make work hours
              easier.
            </p>
          </div>
          <AddNewReminder />
        </div>

        {isEditing && editingReminder && (
          <ReminderEditor
            editingReminder={editingReminder}
            setEditingReminder={
              setEditingReminder as Dispatch<
                SetStateAction<Partial<CustomReminder> | null>
              >
            }
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditingReminder(null);
            }}
            onDelete={handleDelete}
          />
        )}

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
