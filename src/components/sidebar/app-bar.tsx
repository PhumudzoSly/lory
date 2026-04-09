import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Button } from "../ui/button";
import { WorkSettings } from "../work-settings";
import { WellbeingSettings } from "../wellbeing-settings";
import { ReminderSettings } from "../reminders";
import { CustomizationSettings } from "../customization-settings";
import {
  BREAK_META,
  type AppSettings,
  type BuddySkin,
  type BreakType,
} from "../../lib/buddyConfig";
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
        <main className="p-12 overflow-y-auto">
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
                  {(Object.keys(settings.breaks) as BreakType[]).map(
                    (breakType) => {
                      const meta = BREAK_META[breakType];
                      return (
                        <Button
                          key={breakType}
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            const { getRandomMessage } =
                              await import("../../lib/buddyConfig");
                            const { sendNativeNotification } =
                              await import("../../lib/notification");
                            await sendNativeNotification(
                              meta.label,
                              getRandomMessage(breakType),
                            );
                          }}
                        >
                          Trigger {meta.label}
                        </Button>
                      );
                    },
                  )}
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
