import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "../components/theme-provider";
import { TooltipProvider } from "../components/ui/tooltip";

export const Route = createRootRoute({
  component: () => (
    <TooltipProvider>
      <ThemeProvider>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </ThemeProvider>
    </TooltipProvider>
  ),
});
