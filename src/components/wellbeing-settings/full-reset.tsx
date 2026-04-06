import { IconCoffee } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
  settings: AppSettings;
  updateInterval: (breakType: keyof AppSettings["breaks"], minutes: number) => void;
  toggleEnabled: (breakType: keyof AppSettings["breaks"], enabled: boolean) => void;
};

export function FullReset({ settings, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden transition-opacity ${!settings.breaks.full.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <IconCoffee className="size-5 text-purple-500" />
          Ultradian Reset
        </h3>
        <Switch
          checked={settings.breaks.full.enabled}
          onCheckedChange={(c) => toggleEnabled("full", c)}
        />
      </div>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Step away from the screen entirely. This aligns with your body's natural
        90-minute rest-activity cycles to maintain peak productivity and prevent
        burnout.
      </p>
      <div className="bg-background p-6 rounded-xl">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Interval Selection
        </label>
        <RadioGroup
          value={settings.breaks.full.intervalMinutes.toString()}
          onValueChange={(value) => updateInterval("full", parseInt(value, 10))}
          disabled={!settings.breaks.full.enabled}
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {[60, 90, 120].map((mins) => (
            <label
              key={mins}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${settings.breaks.full.intervalMinutes === mins ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-card hover:bg-accent text-foreground"}`}
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
