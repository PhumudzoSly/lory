import { IconHistory } from "@tabler/icons-react";
import type { AppSettings } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import { formatDateLabel, formatTimeLabel } from "./utils";

type HistoryEntry = AppSettings["customReminderHistory"][number];

type Props = {
  history: HistoryEntry[];
  onClear: () => void;
};

export function HistoryPanel({ history, onClear }: Props) {
  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.triggeredAtIso).getTime() -
      new Date(a.triggeredAtIso).getTime(),
  );

  return (
    <div className="lg:col-span-1 flex flex-col gap-6 rounded-2xl border border-border/10 bg-card p-8">
      <h4 className="flex items-center gap-2 text-lg font-bold">
        <IconHistory className="size-5 shrink-0 text-muted-foreground" />
        Recent Triggered
      </h4>

      <div className="relative flex-1 space-y-6">
        <div className="absolute bottom-2 left-3 top-2 w-px bg-border/30"></div>

        {sorted.length === 0 ? (
          <div className="relative pl-10">
            <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-muted-foreground ring-4 ring-card"></div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              No Activity Yet
            </p>
            <h6 className="text-sm font-semibold">Triggers will appear here</h6>
            <p className="text-xs italic text-muted-foreground">
              Fire a reminder to start your timeline.
            </p>
          </div>
        ) : (
          sorted.slice(0, 8).map((entry, index) => (
            <div
              key={entry.id}
              className={["relative pl-10", index > 2 ? "opacity-80" : ""].join(
                " ",
              )}
            >
              <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card"></div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {formatDateLabel(entry.triggeredAtIso)}
              </p>
              <h6 className="text-sm font-semibold">{entry.title}</h6>
              <p className="text-xs italic text-muted-foreground">
                {entry.action} at {formatTimeLabel(entry.triggeredAtIso)}
              </p>
            </div>
          ))
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        className="mt-auto w-full rounded-xl py-3 text-xs font-bold text-muted-foreground transition-colors"
      >
        Clear History
      </Button>
    </div>
  );
}
