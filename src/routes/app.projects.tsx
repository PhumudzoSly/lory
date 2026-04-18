import Header from "@/components/projects/header";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Id } from "../../convex/_generated/dataModel";

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
    </div>
  );
}
