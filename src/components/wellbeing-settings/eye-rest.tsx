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
      className={`bg-card p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden transition-opacity ${!settings.breaks.eye.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <IconEye className="size-5 text-emerald-500" />
          Eye Rest Protocol
        </h3>
        <Switch
          checked={settings.breaks.eye.enabled}
          onCheckedChange={(c) => toggleEnabled("eye", c)}
        />
      </div>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Prevent digital eye strain and fatigue. Staring at screens reduces your
        blink rate by half, causing dry eyes and tension headaches.
      </p>
      <div className="bg-background p-6 rounded-xl">
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
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 20 ? "border-primary bg-primary/10" : "border-transparent bg-card hover:bg-accent"}`}
          >
            <RadioGroupItem value="20" className="sr-only" />
            <span className="text-lg font-bold text-foreground">Standard</span>
            <span className="text-xs text-muted-foreground">20-20-20 Rule</span>
          </label>
          <label
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 30 ? "border-primary bg-primary/10" : "border-transparent bg-card hover:bg-accent"}`}
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
