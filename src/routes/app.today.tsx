import Work from "@/components/today/work";
import AiNudge from "@/components/today/ai-nudge";
import { TaskList } from "@/components/tasks/task-list";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { isToday, isTomorrow } from "date-fns";
import { api } from "../../convex/_generated/api";

const TodayTasks = () => {
  const tasks = useQuery(api.tasks.list, { excludeStatus: "done" }) || [];
  const pendingTasks = tasks.filter((t) => {
    if (!t.time) return false;
    const date = new Date(t.time);
    return isToday(date) || isTomorrow(date);
  });

  return (
    <TaskList
      tasks={pendingTasks}
      title="Today's Tasks"
      description="Focus on high-priority items first. Don't forget to take breaks."
    />
  );
};

const TodayContent = () => {
  return (
    <div className="space-y-16 mx-auto max-w-6xl px-4">
      <Work />
      <AiNudge />
      <TodayTasks />
    </div>
  );
};

export const Route = createFileRoute("/app/today")({
  component: TodayContent,
});
