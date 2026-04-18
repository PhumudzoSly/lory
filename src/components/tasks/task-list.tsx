import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  IconCalendar,
  IconFolder,
  IconCircleCheck,
  IconTrash,
} from "@tabler/icons-react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { formatDistanceToNow, isToday } from "date-fns";
import { StatusSwitcher, type TaskStatus } from "./status-switcher";
import { DateSwitcher } from "./date-switcher";
import { InlineTextarea } from "./inline-textarea";

export type Task = Doc<"tasks">;

interface TaskListProps {
  tasks: Task[];
  title?: string;
  description?: string;
}

export const TaskList = ({ tasks, title, description }: TaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const setStatus = useMutation(api.tasks.setStatus);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const projects = useQuery(api.projects.list) || [];

  if (tasks.length === 0) return null;

  const totalTasks = tasks.length;
  const projectNameById = new Map(
    projects.map((project) => [project._id, project.name]),
  );

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
                {totalTasks} TASK{totalTasks === 1 ? "" : "S"}
              </span>
            </div>
          )}
          {description && (
            <p className="max-w-[80%] text-[13px] leading-relaxed text-muted-foreground/50">
              {description}
            </p>
          )}
        </header>
      )}

      <div className="space-y-0.5">
        {tasks.map((task) => {
          const isCompleted = task.status === "done";
          return (
            <button
              key={task._id}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest(".task-list-checkbox"))
                  return;
                setSelectedTask(task);
              }}
              className="w-full text-left group flex items-start justify-between rounded px-2 py-2.5 transition-colors hover:bg-secondary/30 focus-visible:outline-none focus-visible:bg-secondary/30"
            >
              <div className="flex items-start gap-3">
                <StatusSwitcher
                  status={task.status as TaskStatus}
                  onStatusChange={(status) => {
                    void setStatus({ taskId: task._id, status });
                  }}
                />

                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[13px] font-medium transition-all ${
                      isCompleted
                        ? "text-muted-foreground/40 line-through decoration-muted-foreground/30"
                        : "text-foreground/80"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <span
                      className={`text-[11.5px] leading-relaxed transition-all line-clamp-1 max-w-[90%] mt-0.5 ${
                        isCompleted
                          ? "text-muted-foreground/20 line-through decoration-muted-foreground/20"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {task.description}
                    </span>
                  )}
                </div>
              </div>

              {(task.projectId || task.time) && (
                <div className="mt-0.5 flex shrink-0 items-center gap-3 pl-4 opacity-0 transition-opacity group-hover:opacity-100">
                  {task.projectId && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
                      {projectNameById.get(task.projectId) || "Project"}
                    </span>
                  )}
                  {task.time && (
                    <span className="text-[10px] font-medium text-muted-foreground/40">
                      {isToday(new Date(task.time))
                        ? "due today"
                        : `due ${formatDistanceToNow(new Date(task.time), { addSuffix: true })}`}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Sheet
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <SheetContent className="w-full sm:max-w-xl border-l border-border/10 p-0 gap-0 focus-visible:outline-none overflow-y-auto bg-background/95 backdrop-blur-xl">
          {selectedTask && (
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
              <SheetHeader className="px-8 pt-12 pb-6 border-b border-transparent">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors w-fit cursor-pointer">
                  <IconFolder size={14} stroke={2.5} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {selectedTask.projectId
                      ? projectNameById.get(selectedTask.projectId) || "Project"
                      : "Inbox"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-left text-left p-0 wrap-break-word">
                  <InlineTextarea
                    value={selectedTask.title}
                    onChange={(title) => {
                      if (!title.trim()) return;
                      void updateTask({ taskId: selectedTask._id, title });
                      setSelectedTask({ ...selectedTask, title });
                    }}
                    className="text-3xl font-bold tracking-tight text-foreground min-h-0"
                    placeholder="Task title"
                  />
                </h2>
              </SheetHeader>

              <div className="px-8 py-4">
                <div className="flex flex-col gap-4 py-4 mb-4 border-b border-border/40">
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground/60">
                      <IconCircleCheck
                        size={16}
                        stroke={2}
                        className="opacity-70"
                      />
                      Status
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                      <StatusSwitcher
                        status={selectedTask.status as TaskStatus}
                        withLabel
                        onStatusChange={(status) => {
                          void setStatus({ taskId: selectedTask._id, status });
                          setSelectedTask({ ...selectedTask, status });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground/60">
                      <IconCalendar
                        size={16}
                        stroke={2}
                        className="opacity-70"
                      />
                      Due Date
                    </div>
                    <div className="text-[13px] font-medium text-foreground">
                      <DateSwitcher
                        date={selectedTask.time}
                        onDateChange={(time) => {
                          void updateTask({ taskId: selectedTask._id, time });
                          setSelectedTask({ ...selectedTask, time });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground/60">
                      <IconFolder size={16} stroke={2} className="opacity-70" />
                      Project
                    </div>
                    <div className="text-[13px] font-medium text-foreground/70 px-1 -mx-1">
                      {selectedTask.projectId
                        ? projectNameById.get(selectedTask.projectId) ||
                          "Project"
                        : "Inbox"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="text-[15px] leading-relaxed text-foreground/90 pl-1">
                    <InlineTextarea
                      value={selectedTask.description || ""}
                      onChange={(description) => {
                        void updateTask({
                          taskId: selectedTask._id,
                          description,
                        });
                        setSelectedTask({ ...selectedTask, description });
                      }}
                      placeholder="Add a more detailed description..."
                      className="min-h-50"
                    />
                  </div>

                  <div className="pt-2 border-t border-border/40 flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1.5"
                        >
                          <IconTrash size={14} />
                          Delete Task
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete task?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove this task.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel size="sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => {
                              if (!selectedTask) return;
                              setIsDeleting(true);
                              void removeTask({ taskId: selectedTask._id })
                                .then(() => {
                                  setSelectedTask(null);
                                })
                                .finally(() => {
                                  setIsDeleting(false);
                                });
                            }}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
