import Work from "@/components/today/work";
import { TaskList, Task } from "@/components/tasks/task-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/today")({
  component: () => {
    const tasks: Task[] = [
      {
        id: "1",
        title: "Review pull requests",
        description: "Check the new auth flow PRs and leave comments.",
        completed: false,
        project: "Frontend",
        time: "10:00 AM",
      },
      {
        id: "2",
        title: "Design meeting",
        description:
          "Sync with the design team on the new dark mode aesthetics.",
        completed: true,
        project: "Core UI",
        time: "11:30 AM",
      },
      {
        id: "3",
        title: "Update documentation",
        description: "Reflect the latest API changes in the Notion docs.",
        completed: false,
        project: "Docs",
        time: "1:00 PM",
      },
    ];

    return (
      <div className="space-y-16">
        <Work />
        <div className="mx-auto max-w-175 px-4 pb-20">
          <TaskList
            tasks={tasks}
            title="Today's Tasks"
            description="Focus on high-priority items first. Don't forget to take breaks."
          />
        </div>
      </div>
    );
  },
});
