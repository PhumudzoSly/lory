import { useLocation } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

type AppbarProps = {
  children: React.ReactNode;
};

const Appbar = ({ children }: AppbarProps) => {
  const location = useLocation();

  const getSectionName = () => {
    const path = location.pathname.split("/").pop() || "d";
    return path === "customization" ? "settings" : path;
  };

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="p-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 " />
            <span className="text-sm font-medium capitalize">
              {getSectionName()}
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <ScrollArea className="h-full w-full">
            <div className="p-12">{children}</div>
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Appbar;
