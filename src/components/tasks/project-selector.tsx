import * as React from "react";
import { IconFolder, IconFolderX } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export function ProjectSelector({
  projectId,
  onProjectChange,
}: {
  readonly projectId: Id<"projects"> | undefined;
  readonly onProjectChange: (id: Id<"projects"> | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const projects = useQuery(api.projects.list) || [];

  const selectedProject = projects.find((p) => p._id === projectId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-muted-foreground"
        >
          <div className="flex items-center gap-2 truncate">
            {selectedProject ? (
              <>
                <IconFolder size={16} className="text-muted-foreground" />
                <span className="truncate">{selectedProject.name}</span>
              </>
            ) : (
              <>
                <IconFolderX size={16} className="text-muted-foreground/50" />
                <span>No project</span>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onProjectChange(undefined);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-2"
              >
                <IconFolderX size={14} className="text-muted-foreground" />
                <span>None</span>
              </CommandItem>
              {projects.map((project) => (
                <CommandItem
                  key={project._id}
                  value={project.name}
                  onSelect={() => {
                    onProjectChange(project._id);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <IconFolder size={14} className="text-muted-foreground" />
                  <span className="truncate">{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
