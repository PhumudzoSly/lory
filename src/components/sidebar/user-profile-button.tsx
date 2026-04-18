import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
  IconUser,
  IconSettings,
  IconCreditCard,
  IconSelector,
  IconLogout,
  IconSparkles,
} from "@tabler/icons-react";

import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
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

function getInitials(name: string | null | undefined, email: string): string {
  const source = (name ?? "").trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UserProfileButton() {
  const user = useQuery(api.auth.getCurrentUser);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="h-10 w-full gap-2 p-1.5 rounded-md"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-foreground/10" />
            <div className="flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="truncate w-full text-[13px] font-medium leading-none mb-0.5 bg-foreground/5 h-3 rounded-sm" />
              <span className="truncate w-full text-[11px] leading-none bg-foreground/5 h-2.5 rounded-sm" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const displayName = user.name?.trim() || user.email;
  const initials = getInitials(user.name, user.email);
  const plan: "Free" | "Pro" = "Free";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-10 w-full gap-2 p-1.5 hover:bg-foreground/5 rounded-md transition-colors data-[state=open]:bg-foreground/5"
              tooltip={displayName}
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-foreground/10 text-foreground overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-medium">{initials}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="truncate w-full text-[13px] font-medium leading-none mb-0.5">
                  {displayName}
                </span>
                <span className="truncate w-full text-[11px] text-muted-foreground leading-none">
                  {plan} plan
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
              <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-foreground/10 text-foreground overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium">{initials}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-[13px] font-medium text-foreground leading-tight">
                  {displayName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground leading-tight">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <IconSparkles className="size-3.5" />
                <span>{plan} plan</span>
              </div>
              {plan === "Free" ? (
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
              <button
                type="button"
                className="w-full"
                onClick={() => void handleSignOut()}
              >
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
