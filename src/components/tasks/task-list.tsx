import { useState } from "react";
import {
  IconCircle,
  IconCircleCheck,
  IconCalendar,
  IconFolder,
  IconClock,
  IconAlignLeft,
} from "@tabler/icons-react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  project?: string;
  time?: string;
};

interface TaskListProps {
  tasks: Task[];
  title?: string;
  description?: string;
}

export const TaskList = ({ tasks, title, description }: TaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (tasks.length === 0) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {(title || description) && (
        <header className="space-y-3 px-2">
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                {title}
              </h2>
              <span className="text-[10px] font-bold tabular-nums tracking-widest text-muted-foreground/30">
                {progress}%
              </span>
            </div>
          )}
          {description && (
            <p className="max-w-[80%] text-[13px] leading-relaxed text-muted-foreground/50">
              {description}
            </p>
          )}

          <div className="h-0.5 w-full overflow-hidden rounded-full bg-secondary/40">
            <div
              className="h-full bg-foreground/30 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>
      )}

      <div className="space-y-0.5">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".task-list-checkbox"))
                return;
              setSelectedTask(task);
            }}
            className="w-full text-left group flex items-start justify-between rounded px-2 py-2.5 transition-colors hover:bg-secondary/30 focus-visible:outline-none focus-visible:bg-secondary/30"
          >
            <div className="flex items-start gap-3">
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="task-list-checkbox mt-0.5 shrink-0 text-muted-foreground/30 transition-colors hover:text-foreground/50"
              >
                {task.completed ? (
                  <IconCircleCheck size={14} className="text-foreground/40" />
                ) : (
                  <IconCircle size={14} />
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-[13px] font-medium transition-all ${
                    task.completed
                      ? "text-muted-foreground/40 line-through decoration-muted-foreground/30"
                      : "text-foreground/80"
                  }`}
                >
                  {task.title}
                </span>
                {task.description && (
                  <span
                    className={`text-[11.5px] leading-relaxed transition-all ${
                      task.completed
                        ? "text-muted-foreground/20 line-through decoration-muted-foreground/20"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {task.description}
                  </span>
                )}
              </div>
            </div>

            {(task.project || task.time) && (
              <div className="mt-0.5 flex shrink-0 items-center gap-3 pl-4 opacity-0 transition-opacity group-hover:opacity-100">
                {task.project && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
                    {task.project}
                  </span>
                )}
                {task.time && (
                  <span className="text-[10px] font-medium text-muted-foreground/40">
                    {task.time}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <Sheet
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <SheetContent className="w-full sm:max-w-md border-l border-border/10 p-0 gap-0 focus-visible:outline-none overflow-y-auto">
          {selectedTask && (
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
              <SheetHeader className="px-6 pt-10 pb-6 border-b border-transparent">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground/30">
                  <IconFolder size={14} stroke={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {selectedTask.project || "Inbox"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground/80 md:text-left text-left">
                  {selectedTask.title}
                </h2>
              </SheetHeader>

              <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
                    <IconCircleCheck
                      size={14}
                      stroke={2}
                      className="opacity-70"
                    />
                    Status
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/70">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        selectedTask.completed
                          ? "bg-green-500/10 text-green-500/80"
                          : "bg-secondary/50 text-muted-foreground/70"
                      }`}
                    >
                      {selectedTask.completed ? "Done" : "To Do"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
                    <IconCalendar size={14} stroke={2} className="opacity-70" />
                    Date
                  </div>
                  <div className="text-[12px] font-medium text-foreground/70">
                    {selectedTask.time || "No time set"}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
                    <IconClock size={14} stroke={2} className="opacity-70" />
                    Duration
                  </div>
                  <div className="text-[12px] font-medium text-foreground/70">
                    45m
                  </div>
                </div>

                <div className="w-full h-px bg-border/40 my-6" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground/40">
                    <IconAlignLeft
                      size={14}
                      stroke={2.5}
                      className="opacity-70"
                    />
                    Description
                  </div>
                  <div className="text-[13px] leading-relaxed text-muted-foreground/80 whitespace-pre-wrap pl-1">
                    {selectedTask.description ||
                      "No description provided for this task."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
