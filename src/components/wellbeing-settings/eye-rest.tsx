import { IconEye } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
  settings: AppSettings;
  updateInterval: (breakType: keyof AppSettings["breaks"], minutes: number) => void;
  toggleEnabled: (breakType: keyof AppSettings["breaks"], enabled: boolean) => void;
};

export function EyeRest({ settings, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-8 rounded-[2rem] shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${!settings.breaks.eye.enabled ? "opacity-60 grayscale-[50%] hover:opacity-80" : "hover:shadow-md hover:border-emerald-200/50"}`}
    >
      {settings.breaks.eye.enabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-orange-50/20 pointer-events-none" />
      )}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-sm border border-orange-200/50 shrink-0">
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
         className="data-[state=checked]:bg-emerald-500" />
        </div>
      </div>
      <p className="text-muted-foreground relative z-10 text-sm mb-6 leading-relaxed">
        Prevent digital eye strain and fatigue. Staring at screens reduces your
        blink rate by half, causing dry eyes and tension headaches.
      </p>
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-2xl relative z-10 mt-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Protocol Selection
        </label>
        <RadioGroup
          value={settings.breaks.eye.intervalMinutes.toString()}
          onValueChange={(value) => updateInterval("eye", parseInt(value, 10))}
          disabled={!settings.breaks.eye.enabled}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <label
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 20 ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-transparent bg-card hover:bg-accent"}`}
          >
            <RadioGroupItem value="20" className="sr-only" />
            <span className="text-lg font-bold text-foreground">Standard</span>
            <span className="text-xs text-muted-foreground">20-20-20 Rule</span>
          </label>
          <label
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 30 ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-transparent bg-card hover:bg-accent"}`}
          >
            <RadioGroupItem value="30" className="sr-only" />
            <span className="text-lg font-bold text-foreground">Gentle</span>
            <span className="text-xs text-muted-foreground">30-20-20 Rule</span>
          </label>
        </RadioGroup>
      </div>
    </section>
  );
}
