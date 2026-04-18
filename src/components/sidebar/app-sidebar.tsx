import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  IconCalendarEvent,
  IconHeart,
  IconCheckbox,
  IconFileText,
  IconTarget,
  IconFolderCog,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { UserProfileButton } from "./user-profile-button";

export type SidebarSection =
  | "today"
  | "wellbeing"
  | "tasks"
  | "notes"
  | "goals"
  | "profile"
  | "settings"
  | "projects"
  | "customization";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

type NavValue =
  | "today"
  | "wellbeing"
  | "tasks"
  | "notes"
  | "goals"
  | "projects"
  | "profile"
  | "settings";

type NavItem = {
  readonly title: string;
  readonly value: NavValue;
  readonly icon: React.ComponentType<{ className?: string }>;
};

const topNav = [
  { title: "Today", value: "today", icon: IconCalendarEvent },
  { title: "Wellbeing", value: "wellbeing", icon: IconHeart },
] as const satisfies readonly NavItem[];

const workGroup = [
  { title: "Projects", value: "projects", icon: IconFolderCog },
  { title: "Tasks", value: "tasks", icon: IconCheckbox },
  { title: "Notes", value: "notes", icon: IconFileText },
  { title: "Goals", value: "goals", icon: IconTarget },
] as const satisfies readonly NavItem[];

function NavMenuItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "group transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm"
            : "text-sidebar-foreground/70",
        )}
      >
        <Link to={`/app/${item.value}`} className="flex items-center gap-2">
          <item.icon
            className={cn(
              "size-4 shrink-0 transition-all",
              isActive
                ? "text-primary opacity-100"
                : "opacity-70 group-hover:opacity-100",
            )}
          />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const location = useLocation();

  const isItemActive = (value: string) => {
    if (value === "settings") {
      return (
        location.pathname.includes("/app/settings") ||
        location.pathname.includes("/app/customization")
      );
    }
    return location.pathname.includes(`/app/${value}`);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
      {...props}
    >
      <SidebarHeader className="flex h-12 flex-row shrink-0 items-center border-b border-sidebar-border p-0 px-2 justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="default"
              tooltip="Lory"
              className="h-9"
            >
              <Link to="/app/today" className="flex items-center gap-2">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                  <span className="font-bold text-[10px]">L</span>
                </div>
                <span className="truncate text-sm font-semibold">Lory</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNav.map((item) => (
                <NavMenuItem
                  key={item.value}
                  item={item}
                  isActive={isItemActive(item.value)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workGroup.map((item) => (
                <NavMenuItem
                  key={item.value}
                  item={item}
                  isActive={isItemActive(item.value)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <UserProfileButton />
      </SidebarFooter>
    </Sidebar>
  );
}
