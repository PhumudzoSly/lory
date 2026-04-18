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
  useSidebar,
} from "../ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "./create-project-dialog";

export function SidebarProjects() {
  const location = useLocation();
  const { state } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const projects = useQuery(api.projects.list) || [];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (state === "collapsed") {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton tooltip="Projects">
                  <IconFolder />
                  <span>Projects</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-64 p-2">
                <div className="relative mb-2">
                  <IconSearch className="absolute left-2 top-2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="h-8 pl-8 py-1 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 max-h-[300px] overflow-auto mb-2">
                  {filteredProjects.map((project) => {
                    const search = location.search as { id?: string };
                    const isActive =
                      location.pathname === "/app/projects" &&
                      search.id === project._id;
                    return (
                      <Link
                        key={project._id}
                        to="/app/projects"
                        search={{ id: project._id }}
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-accent text-sm transition-colors",
                          isActive ? "bg-accent font-medium" : "",
                        )}
                      >
                        <IconFolder
                          color={project.color}
                          className="size-4 shrink-0"
                        />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      No projects found.
                    </div>
                  )}
                </div>
                <Button
                  className="w-full justify-start text-sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <IconPlus className="size-4 mr-2" />
                  New Project
                </Button>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
        <CreateProjectDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </SidebarGroup>
    );
  }

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
