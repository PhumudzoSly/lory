import { IconShieldCheck } from "@tabler/icons-react";
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

export function WristCare({ settings, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-opacity ${!(settings.breaks.wrist?.enabled ?? true) ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <IconShieldCheck className="size-5 text-indigo-500" />
            Wrist Care
          </h3>
          <Switch
            checked={settings.breaks.wrist?.enabled ?? true}
            onCheckedChange={(c) => toggleEnabled("wrist", c)}
          />
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Targeted stretches to prevent Repetitive Strain Injury.
        </p>
      </div>
      <div className="bg-background p-4 rounded-xl mt-auto">
        <div className="flex justify-between items-end mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Frequency
          </label>
          <span className="text-lg font-black text-primary">
            {settings.breaks.wrist?.intervalMinutes ?? 60}m
          </span>
        </div>
        <Slider
          min={30}
          max={120}
          step={15}
          value={[settings.breaks.wrist?.intervalMinutes ?? 60]}
          onValueChange={(v) => updateInterval("wrist", v[0] ?? 60)}
          disabled={!(settings.breaks.wrist?.enabled ?? true)}
          {...sliderStyles}
        />
      </div>
    </section>
  );
}
