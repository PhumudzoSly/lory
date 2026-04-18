import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { IconChecklist, IconPlus } from "@tabler/icons-react";
import { api } from "../../../convex/_generated/api";
import { TaskList } from "./task-list";
import { CreateTaskDialog } from "./create-task-dialog";
import { FilterTasksPopover } from "./filter-tasks-popover";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

const sortTasks = (tasks: Doc<"tasks">[]) => {
  return [...tasks].sort((a, b) => {
    const aDue = a.time ? new Date(a.time).getTime() : Number.POSITIVE_INFINITY;
    const bDue = b.time ? new Date(b.time).getTime() : Number.POSITIVE_INFINITY;

    if (aDue !== bDue) {
      return aDue - bDue;
    }

    return b._creationTime - a._creationTime;
  });
};

type TasksPageProps = {
  projectId?: Id<"projects">;
  lockProjectSelection?: boolean;
};

export const TasksPage = ({
  projectId,
  lockProjectSelection = false,
}: TasksPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quickTitle, setQuickTitle] = useState("");
  const createTask = useMutation(api.tasks.create);
  const removeTask = useMutation(api.tasks.remove);

  const tasks = useQuery(api.tasks.list, {
    searchQuery: searchQuery || undefined,
    projectId,
  });

  const todoTasks = sortTasks(tasks?.filter((t) => t.status === "todo") || []);
  const inProgressTasks = sortTasks(
    tasks?.filter((t) => t.status === "in_progress") || [],
  );
  const doneTasks = sortTasks(tasks?.filter((t) => t.status === "done") || []);

  const handleQuickAdd = () => {
    const title = quickTitle.trim();
    if (!title) return;

    void createTask({ title }).then(() => {
      setQuickTitle("");
    });
  };

  const handleClearCompleted = () => {
    if (doneTasks.length === 0) return;
    void Promise.all(doneTasks.map((task) => removeTask({ taskId: task._id })));
  };

  const todayDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto space-y-10 py-6 px-4">
      {/* Header: Minimal, tracking-widest, subtle hover */}
      <header className="space-y-6">
        <div className="flex w-fit items-center gap-2 border-b border-transparent pb-0.5 text-muted-foreground/30 transition-colors group hover:border-border/40 cursor-default">
          <IconChecklist
            size={11}
            stroke={2.5}
            className="transition-colors group-hover:text-foreground/50"
          />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-foreground/50">
            {todayDateString}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
              Tasks
            </h1>
            <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
              Manage your daily tasks and maintain focus across multiple
              projects.
            </p>

            <div className="flex items-center gap-2 max-w-xl">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQuickAdd();
                  }
                }}
                placeholder="Quick add a task..."
                className="h-8 w-full rounded border border-border/40 bg-background px-2.5 text-xs text-foreground/80 outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-border"
              />
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!quickTitle.trim()}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded border border-border/50 px-2.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-secondary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconPlus size={14} />
                Add
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterTasksPopover
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <CreateTaskDialog
              defaultProjectId={projectId}
              lockProjectSelection={lockProjectSelection}
            />
          </div>
        </div>
      </header>

      {/* Tasks Lists Grouped by Status */}
      <div className="space-y-10">
        {todoTasks.length === 0 && inProgressTasks.length === 0 ? (
          <div className="max-w-2xl">
            <div className="space-y-6">
              <header className="space-y-3 px-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                    To Do
                  </h2>
                </div>
                <p className="text-[12px] font-medium leading-relaxed text-muted-foreground/40">
                  Your pending tasks
                </p>
              </header>
              <div className="flex items-center justify-center p-8 rounded-lg border border-dashed border-border/40 bg-secondary/10">
                <span className="text-[12px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                  All caught up
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {todoTasks.length > 0 && (
              <div className="max-w-2xl">
                <TaskList
                  tasks={todoTasks}
                  title="To Do"
                  description="Your pending tasks"
                />
              </div>
            )}

            {inProgressTasks.length > 0 && (
              <div className="max-w-2xl">
                <TaskList
                  tasks={inProgressTasks}
                  title="In Progress"
                  description="Currently working on"
                />
              </div>
            )}
          </>
        )}

        {doneTasks.length > 0 && (
          <div className="max-w-2xl opacity-60 transition-opacity hover:opacity-100">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={handleClearCompleted}
                className="rounded border border-border/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 transition-colors hover:bg-secondary/30 hover:text-foreground/80"
              >
                Clear Completed
              </button>
            </div>
            <TaskList
              tasks={doneTasks}
              title="Completed"
              description="Tasks finished"
            />
          </div>
        )}
      </div>
    </div>
  );
};
