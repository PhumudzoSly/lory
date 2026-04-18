import Header from "@/components/projects/header";
import { TasksPage } from "@/components/tasks/tasks-page";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Id } from "../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTasks } from "@/components/projects/tasks";

export const Route = createFileRoute("/app/projects")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as Id<"projects">) ?? undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useSearch({ from: "/app/projects" });

  return (
    <div>
      <Header id={id} />
      <Separator className="mt-4 mb-2" />
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <Separator className="mb-4" />
        <TabsContent value="tasks">
          <ProjectTasks projectId={id} />
        </TabsContent>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
