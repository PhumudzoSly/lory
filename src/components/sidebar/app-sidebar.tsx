import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";

export type SidebarSection = "customization";

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
    <Sidebar
      variant="inset"
      className="border-r border-border/40 bg-sidebar"
      {...props}
    >
      <SidebarHeader className="p-0" />
      <SidebarContent className="p-0" />
      <SidebarFooter className="p-0" />
    </Sidebar>
  );
}
