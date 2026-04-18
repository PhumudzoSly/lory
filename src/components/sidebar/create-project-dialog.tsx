import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateSwitcher } from "../tasks/date-switcher";
import { isBefore, startOfDay } from "date-fns";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function generateRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const createProject = useMutation(api.projects.create);

  const [colorOptions, setColorOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      const colors = Array.from({ length: 8 }, generateRandomColor);
      setColorOptions(colors);
      form.setValue("color", colors[0]);
    }
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6", // Default blue color
      startDate: undefined,
      dueDate: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createProject(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Project name"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Description (optional)"
            />
          </div>
          <div className="space-y-2">
            <div className="flex  gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Start
                </label>
                <DateSwitcher
                  date={form.watch("startDate")}
                  onDateChange={(date) => {
                    form.setValue("startDate", date);
                    const currentDue = form.getValues("dueDate");
                    if (date && currentDue && isBefore(new Date(currentDue), startOfDay(new Date(date)))) {
                      form.setValue("dueDate", undefined);
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Due
                </label>
                <DateSwitcher
                  date={form.watch("dueDate")}
                  onDateChange={(date) => form.setValue("dueDate", date)}
                  disabled={form.watch("startDate") ? { before: startOfDay(new Date(form.watch("startDate") as string)) } : undefined}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Color</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => form.setValue("color", c)}
                  className={cn(
                    "size-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    form.watch("color") === c
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            {/* hidden input for form registration */}
            <input type="hidden" {...form.register("color")} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
