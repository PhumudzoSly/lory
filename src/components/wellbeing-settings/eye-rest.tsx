import { IconEye } from "@tabler/icons-react";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";
import { BreakTimer } from "./break-timer";

type Props = {
  lastFiredAt?: number | undefined;
  settings: AppSettings;
  toggleEnabled: (
    breakType: keyof AppSettings["breaks"],
    enabled: boolean,
  ) => void;
};

export function EyeRest({ settings, lastFiredAt, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${!settings.breaks.eye.enabled ? "opacity-60 grayscale-[50%] " : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200/50 shrink-0">
            <IconEye className="size-6 text-orange-700" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Eye Rest Protocol
          </h3>
        </div>
        <div className="relative z-10 shrink-0">
          <Switch
            checked={settings.breaks.eye.enabled}
            onCheckedChange={(c) => toggleEnabled("eye", c)}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>
      <p className="text-muted-foreground relative z-10 text-sm mb-6 leading-relaxed">
        Prevent digital eye strain and fatigue. Staring at screens reduces your
        blink rate by half, causing dry eyes and tension headaches.
      </p>

      <div className="mb-6">
        <BreakTimer
          lastFiredAt={lastFiredAt}
          intervalMinutes={settings.breaks.eye.intervalMinutes}
          enabled={settings.breaks.eye.enabled}
        />
      </div>

      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-lg relative z-10 mt-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Smart cadence
        </label>
        <p className="text-sm text-muted-foreground">
          Eye rest is automatically grouped with hydration every{" "}
          {settings.breaks.eye.intervalMinutes} minutes.
        </p>
      </div>
    </section>
  );
}
