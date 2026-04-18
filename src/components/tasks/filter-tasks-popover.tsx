import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function FilterTasksPopover({
  searchQuery,
  setSearchQuery,
}: {
  readonly searchQuery: string;
  readonly setSearchQuery: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs font-medium text-muted-foreground hover:text-foreground">
          <IconSearch size={14} />
          {searchQuery ? "Filtered" : "Filter"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-secondary/20 focus-within:ring-1 focus-within:ring-border/40 focus-within:bg-background transition-all">
          <IconSearch size={16} stroke={2} className="text-muted-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
            autoFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}