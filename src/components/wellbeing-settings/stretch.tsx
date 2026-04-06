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
      className={`bg-card p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden transition-opacity ${!settings.breaks.stretch.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <IconActivity className="size-5 text-orange-500" />
          Stand & Stretch
        </h3>
        <Switch
          checked={settings.breaks.stretch.enabled}
          onCheckedChange={(c) => toggleEnabled("stretch", c)}
        />
      </div>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Movement is essential for longevity. Schedule guided micro-movements to
        release tension in your neck, back, and improve overall circulation.
      </p>
      <div className="bg-background p-6 rounded-xl">
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
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${settings.breaks.stretch.intervalMinutes === mins ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-card hover:bg-accent text-foreground"}`}
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
