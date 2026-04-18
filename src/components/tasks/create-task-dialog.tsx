import { useState } from "react";
import { useMutation } from "convex/react";
import { IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "../../../convex/_generated/api";
import { StatusSwitcher, type TaskStatus } from "./status-switcher";
import { DateSwitcher } from "./date-switcher";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const createTask = useMutation(api.tasks.create);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [time, setTime] = useState<string | undefined>();
  const [projectId, setProjectId] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        time,
        projectId: (projectId.trim() as any) || undefined,
      });
      setOpen(false);
      setTitle("");
      setDescription("");
      setStatus("todo");
      setTime(undefined);
      setProjectId("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-8 text-xs font-medium"
        >
          <IconPlus size={14} />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <div>
                <StatusSwitcher
                  status={status}
                  withLabel
                  onStatusChange={setStatus}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <div>
                <DateSwitcher date={time} onDateChange={setTime} />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project">Project</Label>
            <Input
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project (optional)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="min-h-25 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
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
