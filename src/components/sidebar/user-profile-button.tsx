import { Link } from "@tanstack/react-router";
import {
  IconUser,
  IconSettings,
  IconCreditCard,
  IconSelector,
  IconLogout,
  IconSparkles,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type UserProfile = {
  name: string;
  email: string;
  initials: string;
  plan: "Free" | "Pro";
};

const userProfile: UserProfile = {
  name: "Phumudzo Mahandana",
  email: "phumudzo@example.com",
  initials: "PM",
  plan: "Free",
};

export function UserProfileButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-10 w-full gap-2 p-1.5 hover:bg-foreground/5 rounded-md transition-colors data-[state=open]:bg-foreground/5"
              tooltip={userProfile.name}
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-foreground/10 text-foreground">
                <span className="text-[10px] font-medium">
                  {userProfile.initials}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="truncate w-full text-[13px] font-medium leading-none mb-0.5">
                  {userProfile.name}
                </span>
                <span className="truncate w-full text-[11px] text-muted-foreground leading-none">
                  {userProfile.plan} plan
                </span>
              </div>
              <IconSelector className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={6}
            className="w-60"
          >
            <div className="flex items-center gap-2.5 px-2 py-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-foreground/10 text-foreground">
                <span className="text-[11px] font-medium">
                  {userProfile.initials}
                </span>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-[13px] font-medium text-foreground leading-tight">
                  {userProfile.name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground leading-tight">
                  {userProfile.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <IconSparkles className="size-3.5" />
                <span>{userProfile.plan} plan</span>
              </div>
              {userProfile.plan === "Free" ? (
                <button
                  type="button"
                  className="rounded-sm border border-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Upgrade
                </button>
              ) : null}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/profile">
                <IconUser className="text-muted-foreground" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings">
                <IconSettings className="text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button type="button" className="w-full">
                <IconCreditCard className="text-muted-foreground" />
                <span>Subscriptions</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <button type="button" className="w-full">
                <IconLogout />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
