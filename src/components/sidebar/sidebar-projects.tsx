import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { IconFolder, IconPlus, IconSearch } from "@tabler/icons-react";

import { api } from "../../../convex/_generated/api";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "./create-project-dialog";

export function SidebarProjects() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const projects = useQuery(api.projects.list) || [];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between pr-2 mb-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => setIsCreateOpen(true)}
        >
          <IconPlus className="size-3" />
          <span className="sr-only">New Project</span>
        </Button>
      </div>
      <SidebarGroupContent>
        <div className="px-2 mb-2">
          <div className="relative">
            <IconSearch className="absolute left-2 top-1.5 size-3 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="h-7 pl-7 py-1 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <SidebarMenu>
          {filteredProjects.map((project) => {
            const search = location.search as { id?: string };
            const isActive =
              location.pathname === "/app/projects" &&
              search.id === project._id;
            return (
              <SidebarMenuItem key={project._id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={project.name}
                  className={cn(
                    "group transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/70",
                  )}
                >
                  <Link
                    to="/app/projects"
                    search={{ id: project._id }}
                    className="flex items-center gap-2"
                  >
                    <IconFolder
                      className={cn(
                        "size-4 shrink-0 transition-all",
                        isActive
                          ? "text-primary opacity-100"
                          : "opacity-70 group-hover:opacity-100",
                      )}
                      color={project.color}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {filteredProjects.length === 0 && (
            <div className="px-2 py-1 text-xs text-muted-foreground">
              No projects found.
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </SidebarGroup>
  );
}
