import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  IconBed,
  IconMoonStars,
  IconNotebook,
  IconDroplet,
  IconStretching,
  IconWind,
  IconActivity,
} from "@tabler/icons-react";
import type { AppSettings, WorkDay } from "../../lib/buddyConfig";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";

const DAY_ORDER: WorkDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const sliderStyles = {
  className: "h-6 w-full",
  style: {
    "--slider-track-height": "12px",
    "--slider-thumb-size": "24px",
  } as React.CSSProperties,
};

export function AfterHoursSettingsPanel({ settings, setSettings }: Props) {
  const afterHours = settings.afterHours;

  const updateAfterHours = useMemo(
    () =>
      (
        updater: (prev: AppSettings["afterHours"]) => AppSettings["afterHours"],
      ) => {
        setSettings((prev) => ({
          ...prev,
          afterHours: updater(prev.afterHours),
        }));
      },
    [setSettings],
  );

  const toggleDay = (day: WorkDay, checked: boolean) => {
    updateAfterHours((prev) => {
      const days = checked
        ? Array.from(new Set([...prev.days, day]))
        : prev.days.filter((d) => d !== day);
      return {
        ...prev,
        days: days.length === 0 ? [day] : days,
      };
    });
  };

  const timeline = [
    {
      label: "Wind-down",
      offset: afterHours.windDownLeadMinutes,
      icon: <IconMoonStars className="size-4" />,
    },
    {
      label: "Screens off",
      offset: afterHours.screenOffLeadMinutes,
      icon: <IconActivity className="size-4" />,
    },
    {
      label: "Sleep prep",
      offset: afterHours.prepLeadMinutes,
      icon: <IconWind className="size-4" />,
    },
    {
      label: "Bedtime",
      offset: 0,
      icon: <IconBed className="size-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 space-y-8 lg:col-span-8">
        {/* Main Coach Card */}
        <section
          className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${
            !afterHours.enabled ? "opacity-60 grayscale-[50%]" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200/50 shrink-0">
                <IconMoonStars className="size-6 text-orange-700" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                After-Hours Coach
              </h3>
            </div>
            <div className="relative z-10 shrink-0">
              <Switch
                checked={afterHours.enabled}
                onCheckedChange={(enabled) =>
                  updateAfterHours((prev) => ({ ...prev, enabled }))
                }
                className="data-[state=checked]:bg-emerald-500"
                aria-label="Toggle after-hours reminders"
              />
            </div>
          </div>

          <p className="text-muted-foreground relative z-10 text-sm mb-6 leading-relaxed">
            Keep your work wellbeing as-is, then let Lory coach your evening
            routine with calm reminders that protect sleep quality.
          </p>

          <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-lg relative z-10 mt-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Bedtime Target
                </label>
                <Input
                  type="time"
                  value={afterHours.bedtime}
                  disabled={!afterHours.enabled}
                  onChange={(event) => {
                    const next = event.target.value;
                    updateAfterHours((prev) => ({
                      ...prev,
                      bedtime: next,
                    }));
                  }}
                  className="h-11 text-base font-bold bg-card border-2 border-emerald-100/50 dark:border-emerald-900/30 focus-visible:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Active Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAY_ORDER.map((day) => {
                    const checked = afterHours.days.includes(day);
                    return (
                      <label
                        key={day}
                        className={`flex items-center justify-center rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          checked
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-transparent bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Checkbox
                          className="sr-only"
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleDay(day, Boolean(value))
                          }
                          disabled={!afterHours.enabled}
                        />
                        {day}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Runway Timeline */}
        <section
          className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${
            !afterHours.enabled ? "opacity-60 grayscale-[50%]" : ""
          }`}
        >
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">
              Sleep Runway Timeline
            </h3>
          </div>
          <p className="text-muted-foreground relative z-10 text-sm mb-6">
            Tune when each reminder appears before your bedtime target.
          </p>

          <div className="space-y-4">
            <div className="bg-background p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Wind-down lead time
                </label>
                <span className="text-lg font-black text-primary">
                  {afterHours.windDownLeadMinutes}m
                </span>
              </div>
              <Slider
                min={20}
                max={180}
                step={5}
                value={[afterHours.windDownLeadMinutes]}
                disabled={!afterHours.enabled}
                onValueChange={(values) => {
                  const windDown = clamp(values[0] ?? 60, 20, 180);
                  updateAfterHours((prev) => ({
                    ...prev,
                    windDownLeadMinutes: windDown,
                    screenOffLeadMinutes: clamp(
                      prev.screenOffLeadMinutes,
                      10,
                      windDown - 5,
                    ),
                    prepLeadMinutes: clamp(
                      prev.prepLeadMinutes,
                      5,
                      Math.max(5, prev.screenOffLeadMinutes - 5),
                    ),
                  }));
                }}
                {...sliderStyles}
              />
            </div>

            <div className="bg-background p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Screens-off lead time
                </label>
                <span className="text-lg font-black text-primary">
                  {afterHours.screenOffLeadMinutes}m
                </span>
              </div>
              <Slider
                min={10}
                max={Math.max(10, afterHours.windDownLeadMinutes - 5)}
                step={5}
                value={[afterHours.screenOffLeadMinutes]}
                disabled={!afterHours.enabled}
                onValueChange={(values) => {
                  const screenOff = clamp(
                    values[0] ?? 30,
                    10,
                    Math.max(10, afterHours.windDownLeadMinutes - 5),
                  );
                  updateAfterHours((prev) => ({
                    ...prev,
                    screenOffLeadMinutes: screenOff,
                    prepLeadMinutes: clamp(
                      prev.prepLeadMinutes,
                      5,
                      screenOff - 5,
                    ),
                  }));
                }}
                {...sliderStyles}
              />
            </div>

            <div className="bg-background p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sleep prep lead time
                </label>
                <span className="text-lg font-black text-primary">
                  {afterHours.prepLeadMinutes}m
                </span>
              </div>
              <Slider
                min={5}
                max={Math.max(5, afterHours.screenOffLeadMinutes - 5)}
                step={5}
                value={[afterHours.prepLeadMinutes]}
                disabled={!afterHours.enabled}
                onValueChange={(values) => {
                  const prep = clamp(
                    values[0] ?? 10,
                    5,
                    Math.max(5, afterHours.screenOffLeadMinutes - 5),
                  );
                  updateAfterHours((prev) => ({
                    ...prev,
                    prepLeadMinutes: prep,
                  }));
                }}
                {...sliderStyles}
              />
            </div>
          </div>
        </section>

        {/* Optional Nudges */}
        <section
          className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${
            !afterHours.enabled ? "opacity-60 grayscale-[50%]" : ""
          }`}
        >
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">
              Optional Evening Nudges
            </h3>
          </div>
          <p className="text-muted-foreground relative z-10 text-sm mb-6">
            Keep these gentle and lightweight. They are intentionally
            low-pressure.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                key: "hydrationNudge",
                icon: <IconDroplet className="size-5 text-orange-700" />,
                title: "Hydration",
                description: "A small evening sip reminder.",
              },
              {
                key: "stretchNudge",
                icon: <IconStretching className="size-5 text-orange-700" />,
                title: "Stretch",
                description: "Relax neck and shoulder tension.",
              },
              {
                key: "breathingNudge",
                icon: <IconWind className="size-5 text-orange-700" />,
                title: "Breathing",
                description: "Short calming breath reset.",
              },
              {
                key: "reflectionNudge",
                icon: <IconNotebook className="size-5 text-orange-700" />,
                title: "Reflection",
                description: "One win and one tomorrow focus.",
              },
            ].map((item) => {
              const checked = afterHours[
                item.key as keyof typeof afterHours
              ] as boolean;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-emerald-100/50 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-4 flex flex-col"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200/50 shrink-0">
                        {item.icon}
                      </div>
                      <p className="font-bold text-foreground">{item.title}</p>
                    </div>
                    <Switch
                      checked={checked}
                      disabled={!afterHours.enabled}
                      onCheckedChange={(value) => {
                        updateAfterHours((prev) => ({
                          ...prev,
                          [item.key]: value,
                        }));
                      }}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Side Panel */}
      <div className="col-span-12 space-y-8 lg:col-span-4">
        {/* Tonight Timeline Info Panel style */}
        <div className="bg-primary p-6 rounded-2xl text-primary-foreground shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10">
            <IconMoonStars className="mb-4 size-8" />
            <h4 className="text-xl font-bold mb-2 tracking-tight">
              Tonight's Timeline
            </h4>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Bedtime target is {afterHours.bedtime}. These nudges fire in
              sequence based on your runway settings.
            </p>
            <div className="space-y-3">
              {timeline.map((entry) => (
                <div
                  key={entry.label}
                  className="flex items-center justify-between rounded-lg bg-primary-foreground/10 px-3 py-2 border border-primary-foreground/20"
                >
                  <div className="flex items-center gap-2.5">
                    {entry.icon}
                    <span className="text-sm font-medium">{entry.label}</span>
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    {entry.offset === 0 ? "NOW" : `-${entry.offset}m`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-12 blur-2xl"></div>
        </div>

        {/* Guardrails Card */}
        <section
          className={`bg-card p-6 rounded-lg shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden ${
            !afterHours.enabled ? "opacity-60 grayscale-[50%]" : ""
          }`}
        >
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Guardrails</h3>
          </div>
          <p className="text-muted-foreground relative z-10 text-sm mb-6">
            Prevent notification spam if you end up working late.
          </p>

          <div className="space-y-4">
            <div className="bg-background p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Max nudges per night
                </label>
                <span className="text-lg font-black text-primary">
                  {afterHours.maxNudgesPerNight}
                </span>
              </div>
              <Slider
                min={1}
                max={12}
                step={1}
                value={[afterHours.maxNudgesPerNight]}
                disabled={!afterHours.enabled}
                onValueChange={(values) => {
                  updateAfterHours((prev) => ({
                    ...prev,
                    maxNudgesPerNight: clamp(values[0] ?? 5, 1, 12),
                  }));
                }}
                {...sliderStyles}
              />
            </div>

            <div className="bg-background p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Cooldown
                </label>
                <span className="text-lg font-black text-primary">
                  {afterHours.cooldownMinutes}m
                </span>
              </div>
              <Slider
                min={5}
                max={120}
                step={5}
                value={[afterHours.cooldownMinutes]}
                disabled={!afterHours.enabled}
                onValueChange={(values) => {
                  updateAfterHours((prev) => ({
                    ...prev,
                    cooldownMinutes: clamp(values[0] ?? 20, 5, 120),
                  }));
                }}
                {...sliderStyles}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
