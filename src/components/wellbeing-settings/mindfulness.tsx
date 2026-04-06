import { IconLeaf } from "@tabler/icons-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import type { AppSettings } from "../../lib/buddyConfig";

type Props = {
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
      className={`bg-card p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-opacity ${!(settings.breaks.mindfulness?.enabled ?? true) ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <IconLeaf className="size-5 text-teal-500" />
            Mindfulness
          </h3>
          <Switch
            checked={settings.breaks.mindfulness?.enabled ?? true}
            onCheckedChange={(c) => toggleEnabled("mindfulness", c)}
          />
        </div>
        <p className="text-muted-foreground text-sm mb-6">
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
