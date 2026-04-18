import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  IconCalendarEvent,
  IconHeart,
  IconCheckbox,
  IconFileText,
  IconTarget,
  IconUser,
  IconSettings,
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

export type SidebarSection =
  | "today"
  | "wellbeing"
  | "tasks"
  | "notes"
  | "goals"
  | "profile"
  | "settings"
  | "customization";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

const topNav = [
  { title: "Today", value: "today", icon: IconCalendarEvent },
  { title: "Wellbeing", value: "wellbeing", icon: IconHeart },
] as const;

const workGroup = [
  { title: "Tasks", value: "tasks", icon: IconCheckbox },
  { title: "Notes", value: "notes", icon: IconFileText },
  { title: "Goals", value: "goals", icon: IconTarget },
] as const;

const accountGroup = [
  { title: "Profile", value: "profile", icon: IconUser },
  { title: "Settings", value: "settings", icon: IconSettings },
] as const;

const userProfile = {
  name: "Phumudzo Mahandana",
  email: "phumudzo@example.com",
};

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
              {topNav.map((item) => {
                const isActive = isItemActive(item.value);
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "border-r-8 border-r-foreground bg-linear-60 from-transparent via-transparent to-foreground/40",
                      )}
                    >
                      <Link to={`/app/${item.value}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workGroup.map((item) => {
                const isActive = isItemActive(item.value);
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "border-r-8 border-r-foreground bg-linear-60 from-transparent via-transparent to-foreground/40",
                      )}
                      tooltip={item.title}
                    >
                      <Link to={`/app/${item.value}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountGroup.map((item) => {
                const isActive = isItemActive(item.value);
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "border-r-8 border-r-foreground bg-linear-60 from-transparent via-transparent to-foreground/40",
                      )}
                    >
                      <Link to={`/app/${item.value}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              isActive={isItemActive("profile")}
              className="h-10 w-full gap-2 p-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
              tooltip={userProfile.name}
            >
              <Link to="/app/profile">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-sidebar-accent border border-sidebar-border">
                  <span className="text-[10px] font-medium text-sidebar-accent-foreground">
                    PM
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
                  <span className="truncate w-full text-[13px] font-medium leading-none mb-0.5">
                    {userProfile.name}
                  </span>
                  <span className="truncate w-full text-[11px] text-muted-foreground leading-none">
                    Free Plan
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
