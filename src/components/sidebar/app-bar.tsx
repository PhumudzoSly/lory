import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { WorkSettings } from "../WorkSettings";
import { WellbeingSettings } from "../WellbeingSettings";
import { ReminderSettings } from "../ReminderSettings";
import { BREAK_META, type AppSettings, type BuddySkin, type BreakType } from "../../lib/buddyConfig";
import type { SidebarSection } from "./app-sidebar";

type AppbarProps = {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
};

const Appbar = ({ settings, setSettings, skinSwatchClass }: AppbarProps) => {
  const [section, setSection] = useState<SidebarSection>("work");

  return (
    <SidebarProvider>
      <AppSidebar
        variant="sidebar"
        section={section}
        onSectionChange={setSection}
      />
      <SidebarInset className="p-0">
        <main className="p-12 overflow-y-auto">
          {section === "work" && (
            <WorkSettings settings={settings} setSettings={setSettings} />
          )}

          {section === "wellbeing" && (
            <WellbeingSettings settings={settings} setSettings={setSettings} />
          )}

          {section === "customization" && (
            <>
              <header className="mb-12 max-w-4xl">
                <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
                  Customization
                </h2>
                <p className="text-on-surface-variant text-lg">
                  Personalize your Lory buddy.
                </p>
              </header>
              <div className="grid gap-6 max-w-4xl">
                <div className="bg-surface-container-low p-6 rounded-xl">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    Buddy Identity
                  </h3>
                  <label className="block">
                    <span className="block text-sm font-semibold mb-2">
                      Buddy name
                    </span>
                    <Input
                      className="w-full bg-surface-container-lowest border-none rounded-md focus:ring-2 focus:ring-primary/20 p-3 font-medium"
                      type="text"
                      value={settings.buddyName}
                      maxLength={24}
                      onChange={(event) =>
                        setSettings((prev) => ({
                          ...prev,
                          buddyName:
                            event.target.value.trimStart().slice(0, 24) ||
                            "Lory",
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    Buddy Look
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(skinSwatchClass).map(
                      ([id, swatchClass]) => (
                        <Button
                          key={id}
                          type="button"
                          variant="ghost"
                          className={[
                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                            settings.buddySkin === id
                              ? "border-primary bg-surface-container-lowest shadow-sm"
                              : "border-transparent bg-surface-container-lowest hover:bg-surface-container-high",
                          ].join(" ")}
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              buddySkin: id as BuddySkin,
                            }))
                          }
                        >
                          <span
                            className={`h-8 w-8 rounded-full border border-outline/20 ${swatchClass}`}
                          />
                          <span className="font-bold">
                            {id.charAt(0).toUpperCase() + id.slice(1)}
                          </span>
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {section === "reminders" && (
            <ReminderSettings settings={settings} setSettings={setSettings} />
          )}

          {section === "about" && (
            <div className="space-y-12">
              <header className="max-w-4xl">
                <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
                  About
                </h2>
                <p className="text-on-surface-variant text-lg">
                  Lory v0.1.0. Built with ❤️ by Phumuzo. This project is open
                  source on{" "}
                  <a
                    href="https://github.com/PhumudzoSly/lory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </p>
              </header>

              <section className="max-w-4xl">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Test Reminders
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(settings.breaks) as BreakType[]).map((breakType) => {
                    const meta = BREAK_META[breakType];
                    return (
                      <Button
                        key={breakType}
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          const { emit } = await import("@tauri-apps/api/event");
                          const { getRandomMessage } = await import("../../lib/buddyConfig");
                          emit("test-toast", {
                            kind: "break",
                            breakType: breakType,
                            message: getRandomMessage(breakType),
                          });
                        }}
                      >
                        Trigger {meta.label}
                      </Button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Appbar;
