import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { InlineInput } from "@/components/tasks/inline-input";
import { InlineTextarea } from "@/components/tasks/inline-textarea";
import { DateSwitcher } from "@/components/tasks/date-switcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isBefore, startOfDay } from "date-fns";
import * as React from "react";
import { cn } from "@/lib/utils";

function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

interface Props {
  readonly id: Id<"projects">;
}

const Header = ({ id }: Props) => {
  const project = useQuery(api.projects.getById, { projectId: id });
  const updateProject = useMutation(api.projects.update);

  const [colorOptions, setColorOptions] = React.useState<string[]>([]);
  const [isColorOpen, setIsColorOpen] = React.useState(false);

  React.useEffect(() => {
    if (isColorOpen) {
      setColorOptions(Array.from({ length: 10 }, generateRandomColor));
    }
  }, [isColorOpen]);

  if (!project) return null;

  const hasStarted = project.startDate 
    ? isBefore(new Date(project.startDate), startOfDay(new Date())) || new Date(project.startDate).toDateString() === new Date().toDateString()
    : false;

  const handleUpdate = (field: string, value: string | undefined) => {
    updateProject({ projectId: id, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
            <PopoverTrigger asChild>
              <button
                className="h-10 w-10 shrink-0 rounded-full border-2 border-transparent transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                style={{ backgroundColor: project.color || "gray" }}
                aria-label="Change project color"
              />
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Color</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        handleUpdate("color", c);
                        setIsColorOpen(false);
                      }}
                      className={cn(
                        "size-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        project.color === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: c }}
                      title={c}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <InlineInput
            value={project.name}
            onChange={(val) => handleUpdate("name", val)}
            className="text-2xl font-bold px-2 py-1 flex-1"
            placeholder="Project Name"
          />
        </div>
        <div className="pl-13">
          <InlineTextarea
            value={project.description || ""}
            onChange={(val) => handleUpdate("description", val)}
            className="text-sm text-muted-foreground min-h-6"
            placeholder="Add a description..."
          />
        </div>
      </div>
      
      <div className="flex items-center pl-13 gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">Start:</span>
          {hasStarted ? (
            <span className="px-2 py-1 text-xs opacity-70">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
            </span>
          ) : (
            <DateSwitcher
              date={project.startDate}
              onDateChange={(val) => handleUpdate("startDate", val)}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Due:</span>
          <DateSwitcher
            date={project.dueDate}
            onDateChange={(val) => handleUpdate("dueDate", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
