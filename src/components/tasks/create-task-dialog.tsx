import { useState } from "react";
import { useMutation } from "convex/react";
import { IconPlus, IconCalendar, IconFolder } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";
import { StatusSwitcher, type TaskStatus } from "./status-switcher";
import { DateSwitcher } from "./date-switcher";
import { InlineTextarea } from "./inline-textarea";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const createTask = useMutation(api.tasks.create);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [time, setTime] = useState<string | undefined>();
  const [project, setProject] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        time,
        project: project.trim() || undefined,
      });
      setOpen(false);
      setTitle("");
      setDescription("");
      setStatus("todo");
      setTime(undefined);
      setProject("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-medium">
          <IconPlus size={14} />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 p-0 gap-0 border-border/10 focus-visible:outline-none">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold">Create Task</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest text-muted-foreground/50 uppercase">
              Title
            </span>
            <InlineTextarea
              value={title}
              onChange={setTitle}
              placeholder="What needs to be done?"
              className="text-lg font-medium min-h-10"
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
              Status
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/70">
              <StatusSwitcher
                status={status}
                withLabel
                onStatusChange={setStatus}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
              <IconCalendar size={14} stroke={2} className="opacity-70" />
              Date
            </div>
            <div className="text-[12px] font-medium text-foreground/70">
              <DateSwitcher date={time} onDateChange={setTime} />
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
              <IconFolder size={14} stroke={2} className="opacity-70" />
              Project
            </div>
            <div className="text-[12px] font-medium text-foreground/70">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Inbox"
                className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 m-0 cursor-text hover:bg-secondary/30 rounded px-1 -mx-1 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <span className="text-[11px] font-bold tracking-widest text-muted-foreground/50 uppercase">
              Description
            </span>
            <InlineTextarea
              value={description}
              onChange={setDescription}
              placeholder="Add more details..."
              className="text-[13px] leading-relaxed text-muted-foreground/80 min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}