import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";

type MenuItem<T extends string> = {
  id: T;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type NavMenuProps<T extends string> = {
  title?: string;
  items: MenuItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
};

export default function NavMenu<T extends string>({
  title,
  items,
  activeId,
  onSelect,
}: NavMenuProps<T>) {
  return (
    <SidebarGroup>
      {title ? <SidebarGroupLabel>{title}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeId === item.id}
                  onClick={() => onSelect(item.id)}
                  size="lg"
                  className={cn(
                    activeId === item.id
                      ? "bg-primary/20 border-r-8 border-r-primary"
                      : "hover:bg-muted hover:cursor-pointer",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      activeId === item.id
                        ? "bg-linear-60 from-emerald-400 to-emerald-800 text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="font-manrope text-sm">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
