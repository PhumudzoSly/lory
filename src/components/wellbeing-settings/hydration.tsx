import { IconDroplet } from "@tabler/icons-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";
import { BreakTimer } from "./break-timer";

type Props = {
  lastFiredAt?: number | undefined;
  settings: AppSettings;
  updateInterval: (breakType: keyof AppSettings["breaks"], minutes: number) => void;
  toggleEnabled: (breakType: keyof AppSettings["breaks"], enabled: boolean) => void;
};

const sliderStyles = {
  className: "h-6 w-full",
  style: {
    "--slider-track-height": "12px",
    "--slider-thumb-size": "24px",
  } as React.CSSProperties,
};

export function Hydration({ settings, lastFiredAt, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${!settings.breaks.hydrate.enabled ? "opacity-60 grayscale-[50%] " : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200/50 shrink-0">
            <IconDroplet className="size-6 text-orange-700" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Hydration
          
          </h3>
        </div>
          <div className="relative z-10 shrink-0">
          <Switch
            checked={settings.breaks.hydrate.enabled}
            onCheckedChange={(c) => toggleEnabled("hydrate", c)}
           className="data-[state=checked]:bg-emerald-500" />
        </div>
        </div>
        <p className="text-muted-foreground relative z-10 text-sm mb-6">
          Minor dehydration impairs cognitive performance.
        </p>
      </div>
      
      <div className="mb-4">
        <BreakTimer
          lastFiredAt={lastFiredAt}
          intervalMinutes={settings.breaks.hydrate.intervalMinutes}
          enabled={settings.breaks.hydrate.enabled}
        />
      </div>
      
      <div className="bg-background p-4 rounded-xl mt-auto">
        <div className="flex justify-between items-end mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Frequency
          </label>
          <span className="text-lg font-black text-primary">
            {settings.breaks.hydrate.intervalMinutes}m
          </span>
        </div>
        <Slider
          min={15}
          max={180}
          step={15}
          value={[settings.breaks.hydrate.intervalMinutes]}
          onValueChange={(v) => updateInterval("hydrate", v[0] ?? 15)}
          disabled={!settings.breaks.hydrate.enabled}
          {...sliderStyles}
        />
      </div>
    </section>
  );
}
