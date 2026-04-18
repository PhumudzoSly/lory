import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { IconSparkles } from "@tabler/icons-react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type AppbarProps = {
  children: React.ReactNode;
};

const RIGHT_PANEL_STORAGE_KEY = "lory:right-panel-open";

const Appbar = ({ children }: AppbarProps) => {
  const location = useLocation();
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    if (globalThis.window === undefined) return false;
    return (
      globalThis.window.localStorage.getItem(RIGHT_PANEL_STORAGE_KEY) === "true"
    );
  });

  useEffect(() => {
    globalThis.window.localStorage.setItem(
      RIGHT_PANEL_STORAGE_KEY,
      String(isRightPanelOpen),
    );
  }, [isRightPanelOpen]);

  const getSectionName = () => {
    const path = location.pathname.split("/").pop() || "d";
    return path === "customization" ? "settings" : path;
  };

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 overflow-hidden">
        <SidebarInset className="min-w-0 p-0">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2" />
                <span className="text-sm font-medium capitalize">
                  {getSectionName()}
                </span>
              </div>

              <Button
                size="sm"
                aria-pressed={isRightPanelOpen}
                onClick={() => setIsRightPanelOpen((open) => !open)}
              >
                <IconSparkles size={14} />
                Agent
              </Button>
            </div>
          </header>

          <main className="flex flex-1 flex-col overflow-hidden bg-background">
            <ScrollArea className="h-full w-full">
              <div className="p-12">{children}</div>
            </ScrollArea>
          </main>
        </SidebarInset>

        <aside
          className={cn(
            "h-full shrink-0 border-l border-border/60 bg-background transition-[width,opacity] duration-200 ease-linear",
            isRightPanelOpen ? "w-88 opacity-100" : "w-0 opacity-0",
          )}
          aria-hidden={!isRightPanelOpen}
        >
          <div
            className={cn(
              "flex h-full min-w-88 flex-col",
              !isRightPanelOpen && "pointer-events-none",
            )}
          >
            <div className="flex h-13 items-center justify-between px-4">
              <h2 className="text-sm font-medium">Agent</h2>
              <Button
                variant="ghost"
                size="sm"
                className=" px-2 text-xs"
                onClick={() => setIsRightPanelOpen(false)}
              >
                Close
              </Button>
            </div>

            <ScrollArea className="h-full">
              <div className="space-y-5 p-4">
                <section className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Agent Notes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use this space for agent context, generated ideas, and
                    follow-up actions.
                  </p>
                </section>

                <Separator />

                <section className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Agent Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This panel stays open while navigating between pages.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </div>
        </aside>
      </div>
    </SidebarProvider>
  );
};

export default Appbar;
