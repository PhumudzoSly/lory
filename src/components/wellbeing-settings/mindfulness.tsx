import { IconLeaf } from "@tabler/icons-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

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

export function Mindfulness({ settings, updateInterval, toggleEnabled }: Props) {
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
          <h3 className="text-xl font-bold text-foreground">
            Mindfulness
          
          </h3>
        </div>
          <div className="relative z-10 shrink-0">
          <Switch
            checked={settings.breaks.mindfulness?.enabled ?? true}
            onCheckedChange={(c) => toggleEnabled("mindfulness", c)}
           className="data-[state=checked]:bg-emerald-500" />
        </div>
        </div>
        <p className="text-muted-foreground relative z-10 text-sm mb-6">
          Clear attention residue to restore executive function.
        </p>
      </div>
      <div className="bg-background p-4 rounded-xl mt-auto">
        <div className="flex justify-between items-end mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Frequency
          </label>
          <span className="text-lg font-black text-primary">
            {settings.breaks.mindfulness?.intervalMinutes ?? 90}m
          </span>
        </div>
        <Slider
          min={30}
          max={120}
          step={15}
          value={[settings.breaks.mindfulness?.intervalMinutes ?? 90]}
          onValueChange={(v) => updateInterval("mindfulness", v[0] ?? 90)}
          disabled={!(settings.breaks.mindfulness?.enabled ?? true)}
          {...sliderStyles}
        />
      </div>
    </section>
  );
}
