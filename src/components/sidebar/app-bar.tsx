import { useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { IconBrandGithub, IconBrandX, IconSparkles } from "@tabler/icons-react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Button } from "../ui/button";
import { WorkSettings } from "../work-settings";
import { WellbeingSettings } from "../wellbeing-settings";
import { ReminderSettings } from "../reminders";
import { CustomizationSettings } from "../customization-settings";
import { type AppSettings, type BuddySkin } from "../../lib/buddyConfig";
import type { SidebarSection } from "./app-sidebar";

type AppbarProps = {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
  requestedSection?: SidebarSection;
  highlightedPendingActionId?: string | null;
  onPendingActionHandled?: () => void;
};

const Appbar = ({
  settings,
  setSettings,
  skinSwatchClass,
  requestedSection,
  highlightedPendingActionId,
  onPendingActionHandled,
}: AppbarProps) => {
  const [section, setSection] = useState<SidebarSection>("work");

  useEffect(() => {
    if (requestedSection) {
      setSection(requestedSection);
    }
  }, [requestedSection]);

  return (
    <SidebarProvider>
      <AppSidebar
        variant="sidebar"
        section={section}
        onSectionChange={setSection}
      />
      <SidebarInset className="p-0">
        <main className="overflow-y-auto p-12">
          {section === "work" && (
            <WorkSettings settings={settings} setSettings={setSettings} />
          )}

          {section === "wellbeing" && (
            <WellbeingSettings settings={settings} setSettings={setSettings} />
          )}

          {section === "customization" && (
            <CustomizationSettings
              settings={settings}
              setSettings={setSettings}
              skinSwatchClass={skinSwatchClass}
            />
          )}

          {section === "reminders" && (
            <ReminderSettings
              settings={settings}
              setSettings={setSettings}
              highlightedPendingActionId={highlightedPendingActionId}
              onPendingActionHandled={onPendingActionHandled}
            />
          )}

          {section === "about" && (
            <div className="max-w-5xl space-y-8">
              <header className="max-w-4xl">
                <h2 className="mb-3 flex flex-wrap items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    About Lory
                  </span>{" "}
                </h2>
                <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  Lory is your desktop wellbeing companion for healthier and
                  more sustainable work sessions.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="default"
                    className="gap-2"
                    onClick={() => {
                      void openUrl("https://github.com/PhumudzoSly/lory");
                    }}
                  >
                    <IconBrandGithub size={16} />
                    View Repository
                  </Button>
                </div>
              </header>

              <section className="max-w-4xl rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                  <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <IconSparkles size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      How Lory Helps You
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Designed to help you work with focus while protecting your
                      energy and wellbeing.
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="rounded-lg border bg-muted/20 px-4 py-3">
                    Keeps your workday structured with timely work and break
                    reminders.
                  </li>
                  <li className="rounded-lg border bg-muted/20 px-4 py-3">
                    Reduces fatigue with prompts for hydration, posture,
                    stretching, eye rest, and mindfulness.
                  </li>
                  <li className="rounded-lg border bg-muted/20 px-4 py-3">
                    Lets you personalize your buddy and reminder behavior to fit
                    your routine.
                  </li>
                  <li className="rounded-lg border bg-muted/20 px-4 py-3">
                    Helps you build healthier habits while staying productive.
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      void openUrl("https://github.com/PhumudzoSly");
                    }}
                  >
                    <IconBrandGithub size={16} />
                    Developer GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      void openUrl("https://x.com/phumudzooooo");
                    }}
                  >
                    <IconBrandX size={16} />
                    Developer X
                  </Button>
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
