import { IconLeaf } from "@tabler/icons-react";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
  lastFiredAt?: number | undefined;
  settings: AppSettings;
  toggleEnabled: (
    breakType: keyof AppSettings["breaks"],
    enabled: boolean,
  ) => void;
};

export function Mindfulness({ settings, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${!settings.breaks.mindfulness.enabled ? "opacity-60 grayscale-[50%] " : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200/50 shrink-0">
              <IconLeaf className="size-6 text-orange-700" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Mindfulness</h3>
          </div>
          <div className="relative z-10 shrink-0">
            <Switch
              checked={settings.breaks.mindfulness?.enabled ?? true}
              onCheckedChange={(c) => toggleEnabled("mindfulness", c)}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
        <p className="text-muted-foreground relative z-10 text-sm mb-6">
          Clear attention residue to restore executive function.
        </p>
      </div>
      <div className="bg-background p-4 rounded-xl mt-auto">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Smart cadence
        </label>
        <p className="mt-2 text-sm text-muted-foreground">
          Mindfulness prompts join deep resets every{" "}
          {settings.breaks.mindfulness?.intervalMinutes ?? 270} minutes.
        </p>
      </div>
    </section>
  );
}
