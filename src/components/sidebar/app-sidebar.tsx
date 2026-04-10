import * as React from "react";
import {
  IconDeviceLaptop,
  IconHeart,
  IconPalette,
  IconBell,
  IconInfoCircle,
  IconSparkles,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import NavMenu from "./nav-menu";

export type SidebarSection =
  | "work"
  | "wellbeing"
  | "customization"
  | "reminders"
  | "about";

const MENU_ITEMS: Array<{
  id: SidebarSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "work", label: "Work", icon: IconDeviceLaptop },
  { id: "wellbeing", label: "Wellbeing", icon: IconHeart },
  { id: "reminders", label: "Reminders", icon: IconBell },
  { id: "customization", label: "Customization", icon: IconPalette },
  { id: "about", label: "About", icon: IconInfoCircle },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  section: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
};

export function AppSidebar({
  section,
  onSectionChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <button className="group relative w-full overflow-hidden rounded-lg bg-muted/10 px-2 py-3 transition-all duration-200">
          <div className="relative flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center">
              <IconSparkles size={18} className="text-primary" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="mb-0.5 truncate font-semibold">Lory</span>
              <span className="truncate text-xs font-medium text-muted-foreground">
                Live Smart
              </span>
            </div>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="flex flex-col pl-2 py-0">
        <NavMenu
          items={MENU_ITEMS}
          title=""
          activeId={section}
          onSelect={onSectionChange}
        />
        <div className="grow" />
      </SidebarContent>

      <SidebarFooter>
        <div className="p-1">
          <div className="relative overflow-hidden rounded-xl border bg-card/90 p-3 shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%)]" />
            <div className="relative flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <IconSparkles className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lory
                </p>
                <p className="text-xs font-medium text-foreground">v0.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
