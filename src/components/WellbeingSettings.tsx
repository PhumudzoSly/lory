import { type AppSettings } from "../lib/buddyConfig";

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

  return (
    <>
      {/* Header Region */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
            Wellbeing Sanctuary
          </h2>
          <p className="text-on-surface-variant max-w-md">
            Customize your digital environment to maintain physical and mental
            clarity throughout your workday.
          </p>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Water Reminders Card (Focus Plate) */}
        <div className="col-span-1 lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <span
              className="material-symbols-outlined text-[120px]"
              data-icon="water_drop"
            >
              water_drop
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <span
                  className="material-symbols-outlined"
                  data-icon="water_drop"
                >
                  water_drop
                </span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface">
                Water Reminders
              </h3>
            </div>
            <p className="text-on-surface-variant mb-10 max-w-sm">
              Stay hydrated. Scientific studies suggest minor dehydration can
              impair cognitive performance and concentration.
            </p>
            <div className="space-y-12">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-on-surface">
                    Reminder Frequency
                  </label>
                  <span className="text-sm font-bold text-primary">
                    Every {settings.breaks.hydrate.intervalMinutes} mins
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  max="180"
                  min="15"
                  step="15"
                  type="range"
                  value={settings.breaks.hydrate.intervalMinutes}
                  onChange={(e) =>
                    updateInterval("hydrate", parseInt(e.target.value, 10))
                  }
                />
                <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  <span>15m</span>
                  <span>3h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Break (Eye Rest) */}
        <div className="col-span-1 lg:col-span-5 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-6">
              <span
                className="material-symbols-outlined"
                data-icon="visibility"
              >
                visibility
              </span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">
              Eye Rest Protocol
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Prevent digital eye strain with the 20-20-20 rule: Every 20
              minutes, look at something 20 feet away for 20 seconds.
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => updateInterval("eye", 20)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  settings.breaks.eye.intervalMinutes === 20
                    ? "bg-surface-container-lowest"
                    : "bg-surface-container hover:bg-surface-container-lowest opacity-60"
                }`}
              >
                <span className="text-sm font-medium">Standard (20-20-20)</span>
                <span
                  className={`material-symbols-outlined ${
                    settings.breaks.eye.intervalMinutes === 20
                      ? "text-primary"
                      : "text-outline"
                  }`}
                  data-icon={
                    settings.breaks.eye.intervalMinutes === 20
                      ? "check_circle"
                      : "circle"
                  }
                  style={
                    settings.breaks.eye.intervalMinutes === 20
                      ? { fontVariationSettings: "'FILL' 1" }
                      : {}
                  }
                >
                  {settings.breaks.eye.intervalMinutes === 20
                    ? "check_circle"
                    : "circle"}
                </span>
              </button>
              <button
                onClick={() => updateInterval("eye", 30)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  settings.breaks.eye.intervalMinutes === 30
                    ? "bg-surface-container-lowest"
                    : "bg-surface-container hover:bg-surface-container-lowest opacity-60"
                }`}
              >
                <span className="text-sm font-medium">Gentle (30-20-20)</span>
                <span
                  className={`material-symbols-outlined ${
                    settings.breaks.eye.intervalMinutes === 30
                      ? "text-primary"
                      : "text-outline"
                  }`}
                  data-icon={
                    settings.breaks.eye.intervalMinutes === 30
                      ? "check_circle"
                      : "circle"
                  }
                  style={
                    settings.breaks.eye.intervalMinutes === 30
                      ? { fontVariationSettings: "'FILL' 1" }
                      : {}
                  }
                >
                  {settings.breaks.eye.intervalMinutes === 30
                    ? "check_circle"
                    : "circle"}
                </span>
              </button>
            </div>
          </div>
          <div className="absolute inset-x-8 bottom-8 h-32 rounded-lg overflow-hidden pointer-events-none">
            <img
              alt="Calm environment"
              className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
              data-alt="serene morning view of a quiet misty forest with soft sunlight filtering through the trees"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA0BtGD8LY3qSKX1yIK6k8anU_MQJmSJEzdPVDR5jrM3NjwTJ7T4l_bON8prUyNtU9JdnxT4fG2-8yEf3ll-13xfcAo9IjgIMKLsc-z-wiSabRyL8fsqK3ex6l4egQGDw--DSshN_Xa_CiCkP4zAFXMfFCGweipFWXppb_rD6Q68tuc0aJ1flrdZVHijgZlyiY-0sSSbZUUHl43gDptcWawyF3m53AY94bWVb8uPCfnSwyvF5guKHVZw-5AAhs3jx-RKRW2aiB_Y5-"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
          </div>
        </div>

        {/* Stretch Breaks (Editorial Layout) */}
        <div className="col-span-1 lg:col-span-12 flex flex-col md:flex-row gap-8 bg-surface p-1 rounded-xl">
          <div className="flex-1 bg-surface-container-highest/40 p-10 rounded-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <span
                className="material-symbols-outlined text-secondary"
                data-icon="self_care"
              >
                self_care
              </span>
              <h3 className="text-xl font-bold">Stretch Breaks</h3>
            </div>
            <p className="text-on-surface-variant text-sm mb-8 leading-loose">
              Movement is essential for longevity. Schedule guided
              micro-movements to release tension in your neck, back, and wrists.
            </p>
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="p-4 rounded-lg bg-white/50">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
                  Interval
                </p>
                <select
                  className="bg-transparent border-none p-0 font-bold text-lg focus:ring-0 w-full cursor-pointer"
                  value={settings.breaks.stretch.intervalMinutes}
                  onChange={(e) =>
                    updateInterval("stretch", parseInt(e.target.value, 10))
                  }
                >
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                  <option value={120}>120 mins</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
            <div className="h-full relative min-h-[250px]">
              <img
                alt="Wellness aesthetic"
                className="absolute inset-0 w-full h-full object-cover"
                data-alt="minimalist aesthetic scene with a ceramic mug and a single green leaf on a light textured surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtfao9eQYjIZQI4bufYvWf9zLc81ATHpqvd1_EaU8TlRO5xj68I1YbzZDdqROPOhBpYKYOx7tQCl6bOG-_-cfjdUIAVlwi2MOH3eSkRYSzAZZIImeTckvOUrO1vDpbA7RRMvanHNAUL7Pe2CCHjX0RagspsSKyfs8iAI3AJ-50bqbKzCLoiJFVqMyypftE_FXnE0-mJ1osNYBJp4cgQ2Hulp8GVyY5MfZthmTxJBvDbfI-KVsZKIMv0frfhGzXsVyMCQzaYj-Ua8Bn"
              />
              <div className="absolute inset-0 bg-primary/20 backdrop-overlay"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30">
                  <p className="text-xs font-bold text-primary mb-1">
                    Live Tip
                  </p>
                  <p className="text-xs text-on-surface italic">
                    "Shoulder rolls can reduce tension by 40% when done hourly."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
