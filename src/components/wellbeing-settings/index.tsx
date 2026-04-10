import type { Dispatch, SetStateAction } from "react";
import type { AppSettings } from "../../lib/buddyConfig";
import { EyeRest } from "./eye-rest";
import { Stretch } from "./stretch";
import { Hydration } from "./hydration";
import { Posture } from "./posture";
import { Mindfulness } from "./mindfulness";
import { WristCare } from "./wrist-care";
import { FullReset } from "./full-reset";
import { InfoPanel } from "./info-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AfterHoursSettingsPanel } from "./after-hours-panel";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function WellbeingSettings({ settings, setSettings }: Props) {
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

  const lfa = settings.lastFiredAt;

  return (
    <>
      <header className="mb-12 max-w-4xl">
        <h2 className="mb-3 flex flex-wrap items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Wellbeing
          </span>{" "}
          -
          <span className="inline-flex items-center rounded-full border border-emerald-300/60 bg-linear-to-r from-green-100 to-emerald-100 px-3 py-1 text-sm font-black uppercase tracking-wide text-emerald-900 shadow-sm sm:text-base">
            Stay Healthy
          </span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Customize your digital environment. Each routine below is designed to
          maintain your physical and mental clarity throughout the workday.
        </p>
      </header>

      <Tabs defaultValue="work-hours" className="max-w-6xl">
        <TabsList className="mb-8 h-auto rounded-xl p-1.5">
          <TabsTrigger value="work-hours" className="px-5 py-2.5 text-sm">
            Work Hours
          </TabsTrigger>
          <TabsTrigger value="after-hours" className="px-5 py-2.5 text-sm">
            After Hours
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work-hours">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 space-y-8 lg:col-span-8">
              <EyeRest
                settings={settings}
                lastFiredAt={lfa.eye}
                updateInterval={updateInterval}
                toggleEnabled={toggleEnabled}
              />
              <Stretch
                settings={settings}
                updateInterval={updateInterval}
                toggleEnabled={toggleEnabled}
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Hydration
                  settings={settings}
                  lastFiredAt={lfa.hydrate}
                  updateInterval={updateInterval}
                  toggleEnabled={toggleEnabled}
                />
                <Posture
                  settings={settings}
                  updateInterval={updateInterval}
                  toggleEnabled={toggleEnabled}
                />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Mindfulness
                  settings={settings}
                  updateInterval={updateInterval}
                  toggleEnabled={toggleEnabled}
                />
                <WristCare
                  settings={settings}
                  updateInterval={updateInterval}
                  toggleEnabled={toggleEnabled}
                />
              </div>

              <FullReset
                settings={settings}
                updateInterval={updateInterval}
                toggleEnabled={toggleEnabled}
              />
            </div>

            <div className="col-span-12 space-y-8 lg:col-span-4">
              <InfoPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="after-hours">
          <AfterHoursSettingsPanel
            settings={settings}
            setSettings={setSettings}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
