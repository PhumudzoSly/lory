import Work from "@/components/today/work";
import AiNudge from "@/components/today/ai-nudge";
import { TaskList } from "@/components/tasks/task-list";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const TodayContent = () => {
  const tasks = useQuery(api.tasks.list, {}) || [];
  const pendingTasks = tasks.filter((t) => t.status !== "done");

  return (
    <div className="space-y-16 mx-auto max-w-6xl px-4">
      <Work />
      <AiNudge />
      <TaskList
        tasks={pendingTasks}
        title="Today's Tasks"
        description="Focus on high-priority items first. Don't forget to take breaks."
      />
    </div>
  );
};

export const Route = createFileRoute("/app/today")({
  component: TodayContent,
});
