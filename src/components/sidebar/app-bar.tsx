import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { CustomizationSettings } from "../customization-settings";
import { type AppSettings, type BuddySkin } from "../../lib/buddyConfig";
import type { SidebarSection } from "./app-sidebar";

type AppbarProps = {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
  requestedSection?: SidebarSection;
};

const Appbar = ({
  settings,
  setSettings,
  skinSwatchClass,
  requestedSection,
}: AppbarProps) => {
  const [section, setSection] = useState<SidebarSection>("customization");

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
          <CustomizationSettings
            settings={settings}
            setSettings={setSettings}
            skinSwatchClass={skinSwatchClass}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Appbar;
