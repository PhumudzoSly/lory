import { IconUser } from "@tabler/icons-react";
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

export function Posture({ settings, updateInterval, toggleEnabled }: Props) {
  return (
    <section
      className={`bg-card p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-opacity ${!settings.breaks.posture.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <IconUser className="size-5 text-rose-500" />
            Posture Check
          </h3>
          <Switch
            checked={settings.breaks.posture.enabled}
            onCheckedChange={(c) => toggleEnabled("posture", c)}
          />
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Align your spine and neck to prevent "Tech Neck".
        </p>
      </div>
      <div className="bg-background p-4 rounded-xl mt-auto">
        <div className="flex justify-between items-end mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Frequency
          </label>
          <span className="text-lg font-black text-primary">
            {settings.breaks.posture.intervalMinutes}m
          </span>
        </div>
        <Slider
          min={15}
          max={60}
          step={5}
          value={[settings.breaks.posture.intervalMinutes]}
          onValueChange={(v) => updateInterval("posture", v[0] ?? 25)}
          disabled={!settings.breaks.posture.enabled}
          {...sliderStyles}
        />
      </div>
    </section>
  );
}
