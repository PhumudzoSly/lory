import { IconActivity } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
  settings: AppSettings;
  updateInterval: (breakType: keyof AppSettings["breaks"], minutes: number) => void;
  toggleEnabled: (breakType: keyof AppSettings["breaks"], enabled: boolean) => void;
};

export function Stretch({ settings, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-8 rounded-[2rem] shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${!settings.breaks.stretch.enabled ? "opacity-60 grayscale-[50%] hover:opacity-80" : "hover:shadow-md hover:border-emerald-200/50"}`}
    >
      {settings.breaks.stretch.enabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-orange-50/20 pointer-events-none" />
      )}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-sm border border-orange-200/50 shrink-0">
            <IconActivity className="size-6 text-orange-700" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Stand & Stretch
        
          </h3>
        </div>
        <div className="relative z-10 shrink-0">
          <Switch
          checked={settings.breaks.stretch.enabled}
          onCheckedChange={(c) => toggleEnabled("stretch", c)}
         className="data-[state=checked]:bg-emerald-500" />
        </div>
      </div>
      <p className="text-muted-foreground relative z-10 text-sm mb-6 leading-relaxed">
        Movement is essential for longevity. Schedule guided micro-movements to
        release tension in your neck, back, and improve overall circulation.
      </p>
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-2xl relative z-10 mt-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Interval Selection
        </label>
        <RadioGroup
          value={settings.breaks.stretch.intervalMinutes.toString()}
          onValueChange={(value) => updateInterval("stretch", parseInt(value, 10))}
          disabled={!settings.breaks.stretch.enabled}
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {[60, 90, 120].map((mins) => (
            <label
              key={mins}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${settings.breaks.stretch.intervalMinutes === mins ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-primary" : "border-transparent bg-card hover:bg-accent text-foreground"}`}
            >
              <RadioGroupItem value={mins.toString()} className="sr-only" />
              <span className="text-xl font-black">{mins}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                Mins
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </section>
  );
}
