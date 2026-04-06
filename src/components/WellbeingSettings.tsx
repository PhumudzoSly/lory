import { type AppSettings } from "../lib/buddyConfig";
import {
  IconActivity,
  IconCircleCheck,
  IconCoffee,
  IconDroplet,
  IconEye,
  IconLeaf,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";

interface WellbeingSettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function WellbeingSettings({
  settings,
  setSettings,
}: WellbeingSettingsProps) {
  const updateInterval = (
    breakType: keyof AppSettings["breaks"],
    minutes: number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      breaks: {
        ...prev.breaks,
        [breakType]: {
          ...prev.breaks[breakType],
          intervalMinutes: minutes,
        },
      },
    }));
  };

  const toggleEnabled = (
    breakType: keyof AppSettings["breaks"],
    enabled: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      breaks: {
        ...prev.breaks,
        [breakType]: {
          ...prev.breaks[breakType],
          enabled,
        },
      },
    }));
  };

  const sliderStyles = {
    className: "h-6 w-full",
    style: {
      "--slider-track-height": "12px",
      "--slider-thumb-size": "24px",
    } as React.CSSProperties,
  };

  return (
    <>
      <header className="mb-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
            Wellbeing Sanctuary
          </h2>
        </div>
        <p className="text-on-surface-variant text-lg">
          Customize your digital environment. Each routine below is designed to
          maintain your physical and mental clarity throughout the workday.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        {/* Main Content Area (Left 8 Cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Eye Rest */}
          <section
            className={`bg-surface-container-low p-6 sm:p-8 rounded-xl relative overflow-hidden transition-opacity ${!settings.breaks.eye.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
                <IconEye className="size-5 text-emerald-500" />
                Eye Rest Protocol
              </h3>
              <Switch
                checked={settings.breaks.eye.enabled}
                onCheckedChange={(c) => toggleEnabled("eye", c)}
              />
            </div>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Prevent digital eye strain and fatigue. Staring at screens reduces
              your blink rate by half, causing dry eyes and tension headaches.
            </p>
            <div className="bg-surface-container-lowest p-6 rounded-lg">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
                Protocol Selection
              </label>
              <RadioGroup
                value={settings.breaks.eye.intervalMinutes.toString()}
                onValueChange={(value) =>
                  updateInterval("eye", parseInt(value, 10))
                }
                disabled={!settings.breaks.eye.enabled}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <label
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 20 ? "border-primary bg-primary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container-highest"}`}
                >
                  <RadioGroupItem value="20" className="sr-only" />
                  <span className="text-lg font-bold text-on-surface">
                    Standard
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    20-20-20 Rule
                  </span>
                </label>
                <label
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center gap-1 ${settings.breaks.eye.intervalMinutes === 30 ? "border-primary bg-primary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container-highest"}`}
                >
                  <RadioGroupItem value="30" className="sr-only" />
                  <span className="text-lg font-bold text-on-surface">
                    Gentle
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    30-20-20 Rule
                  </span>
                </label>
              </RadioGroup>
            </div>
          </section>

          {/* Stand & Stretch */}
          <section
            className={`bg-surface-container-low p-6 sm:p-8 rounded-xl relative overflow-hidden transition-opacity ${!settings.breaks.stretch.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
                <IconActivity className="size-5 text-orange-500" />
                Stand & Stretch
              </h3>
              <Switch
                checked={settings.breaks.stretch.enabled}
                onCheckedChange={(c) => toggleEnabled("stretch", c)}
              />
            </div>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Movement is essential for longevity. Schedule guided
              micro-movements to release tension in your neck, back, and improve
              overall circulation.
            </p>
            <div className="bg-surface-container-lowest p-6 rounded-lg">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
                Interval Selection
              </label>
              <RadioGroup
                value={settings.breaks.stretch.intervalMinutes.toString()}
                onValueChange={(value) =>
                  updateInterval("stretch", parseInt(value, 10))
                }
                disabled={!settings.breaks.stretch.enabled}
                className="grid grid-cols-3 gap-3 sm:gap-4"
              >
                {[60, 90, 120].map((mins) => (
                  <label
                    key={mins}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${settings.breaks.stretch.intervalMinutes === mins ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-surface-container-low hover:bg-surface-container-highest text-on-surface"}`}
                  >
                    <RadioGroupItem
                      value={mins.toString()}
                      className="sr-only"
                    />
                    <span className="text-xl font-black">{mins}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      Mins
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </section>

          {/* Slider Controls Row 1 (Hydration & Posture) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hydration */}
            <section
              className={`bg-surface-container-low p-6 rounded-xl flex flex-col justify-between transition-opacity ${!settings.breaks.hydrate.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                    <IconDroplet className="size-5 text-blue-500" />
                    Hydration
                  </h3>
                  <Switch
                    checked={settings.breaks.hydrate.enabled}
                    onCheckedChange={(c) => toggleEnabled("hydrate", c)}
                  />
                </div>
                <p className="text-on-surface-variant text-sm mb-6">
                  Minor dehydration impairs cognitive performance.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
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

            {/* Posture */}
            <section
              className={`bg-surface-container-low p-6 rounded-xl flex flex-col justify-between transition-opacity ${!settings.breaks.posture.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                    <IconUser className="size-5 text-rose-500" />
                    Posture Check
                  </h3>
                  <Switch
                    checked={settings.breaks.posture.enabled}
                    onCheckedChange={(c) => toggleEnabled("posture", c)}
                  />
                </div>
                <p className="text-on-surface-variant text-sm mb-6">
                  Align your spine and neck to prevent "Tech Neck".
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
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
          </div>

          {/* Slider Controls Row 2 (Mindfulness & Wrist Care) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mindfulness */}
            <section
              className={`bg-surface-container-low p-6 rounded-xl flex flex-col justify-between transition-opacity ${!(settings.breaks.mindfulness?.enabled ?? true) ? "opacity-60 grayscale-[50%]" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                    <IconLeaf className="size-5 text-teal-500" />
                    Mindfulness
                  </h3>
                  <Switch
                    checked={settings.breaks.mindfulness?.enabled ?? true}
                    onCheckedChange={(c) => toggleEnabled("mindfulness", c)}
                  />
                </div>
                <p className="text-on-surface-variant text-sm mb-6">
                  Clear attention residue to restore executive function.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
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
                  onValueChange={(v) =>
                    updateInterval("mindfulness", v[0] ?? 90)
                  }
                  disabled={!(settings.breaks.mindfulness?.enabled ?? true)}
                  {...sliderStyles}
                />
              </div>
            </section>

            {/* Wrist Care */}
            <section
              className={`bg-surface-container-low p-6 rounded-xl flex flex-col justify-between transition-opacity ${!(settings.breaks.wrist?.enabled ?? true) ? "opacity-60 grayscale-[50%]" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                    <IconShieldCheck className="size-5 text-indigo-500" />
                    Wrist Care
                  </h3>
                  <Switch
                    checked={settings.breaks.wrist?.enabled ?? true}
                    onCheckedChange={(c) => toggleEnabled("wrist", c)}
                  />
                </div>
                <p className="text-on-surface-variant text-sm mb-6">
                  Targeted stretches to prevent Repetitive Strain Injury.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
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
          </div>

          {/* Full Reset */}
          <section
            className={`bg-surface-container-low p-6 sm:p-8 rounded-xl relative overflow-hidden transition-opacity ${!settings.breaks.full.enabled ? "opacity-60 grayscale-[50%]" : ""}`}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
                <IconCoffee className="size-5 text-purple-500" />
                Ultradian Reset
              </h3>
              <Switch
                checked={settings.breaks.full.enabled}
                onCheckedChange={(c) => toggleEnabled("full", c)}
              />
            </div>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Step away from the screen entirely. This aligns with your body's
              natural 90-minute rest-activity cycles to maintain peak
              productivity and prevent burnout.
            </p>
            <div className="bg-surface-container-lowest p-6 rounded-lg">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
                Interval Selection
              </label>
              <RadioGroup
                value={settings.breaks.full.intervalMinutes.toString()}
                onValueChange={(value) =>
                  updateInterval("full", parseInt(value, 10))
                }
                disabled={!settings.breaks.full.enabled}
                className="grid grid-cols-3 gap-3 sm:gap-4"
              >
                {[60, 90, 120].map((mins) => (
                  <label
                    key={mins}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${settings.breaks.full.intervalMinutes === mins ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-surface-container-low hover:bg-surface-container-highest text-on-surface"}`}
                  >
                    <RadioGroupItem
                      value={mins.toString()}
                      className="sr-only"
                    />
                    <span className="text-xl font-black">{mins}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      Mins
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </section>
        </div>

        {/* Sidebar Area (Right 4 Cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-primary p-8 rounded-xl text-on-primary shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <IconShieldCheck className="mb-4 size-10" />
              <h4 className="text-xl font-bold mb-3 tracking-tight">
                Why this matters?
              </h4>
              <p className="text-primary-fixed/80 text-sm leading-relaxed mb-6">
                Lory uses clinical ergonomics and productivity research to
                protect your most valuable asset: your health. Balancing intense
                focus with strict recovery periods prevents burnout, RSI, and
                long-term strain.
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-on-primary bg-on-primary-container/20 p-3 rounded-lg border border-on-primary-container/30">
                <IconCircleCheck className="size-4" />
                Sanctuary Active
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-12 blur-2xl"></div>
          </div>

          <div className="bg-surface-container-high rounded-xl overflow-hidden">
            <img
              alt="Calm workspace with plants"
              className="w-full h-48 object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLmyTxv7Mrjc0wo7NqOH1vRghMsECYeXfVnKjo5xEmqz7XAhb4ggMtVYWcINHBQXRyqYh-FnpNPLoT3DSIQclfDE_OAPhyf9MdHV7qdFUfQbDC3Y1YNIViReUUwtLduHhGkjNaJwL4tsSctjnfwU-Q9BbnRY49vcnVY0UaAJ2XBBxMp7ijZUQ4p-vc9zYWGpaCXC36_Qy6_hdGGfFalgSBY_PcFrYd40nOmhQXgHiDl_VcrdRvBf2Aw3ptQ5rbymheVrt1yxqfIAx1"
            />
            <div className="p-6">
              <h4 className="font-bold text-on-surface mb-2">Pro Tip</h4>
              <p className="text-on-surface-variant text-sm">
                Keep the top of your monitor exactly at eye level. Looking down
                constantly changes the natural curvature of your cervical spine.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl overflow-hidden">
            <img
              alt="Zen meditation stones"
              className="w-full h-48 object-cover opacity-80"
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
            />
            <div className="p-6">
              <h4 className="font-bold text-on-surface mb-2">Mindfulness</h4>
              <p className="text-on-surface-variant text-sm">
                Box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) has been
                clinically proven to lower cortisol and reset the nervous system
                in just 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
