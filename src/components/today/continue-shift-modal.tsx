import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconClock } from "@tabler/icons-react";

interface ContinueShiftModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (newEndTime: string) => void;
  defaultEndTime?: string;
  minTime?: string;
}

export const ContinueShiftModal = ({
  isOpen,
  onOpenChange,
  onContinue,
  defaultEndTime = "17:00",
  minTime,
}: ContinueShiftModalProps) => {
  const [endTime, setEndTime] = useState(defaultEndTime);

  const hasInvalidTimeRange = minTime ? endTime <= minTime : false;

  const handleContinue = () => {
    if (hasInvalidTimeRange) return;
    onContinue(endTime);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <DialogHeader className="space-y-1.5 text-left pb-4 border-b border-border/10">
          <div className="flex items-center gap-2 text-foreground/80">
            <IconClock size={18} stroke={2.5} />
            <DialogTitle className="text-lg tracking-tight">
              Continue Shift
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground/60 leading-relaxed max-w-sm">
            You are resuming today's session. Until what time do you plan to work?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              New End Time
            </Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-foreground/20 text-sm h-9"
            />
          </div>

          {hasInvalidTimeRange ? (
            <p className="text-xs font-medium text-red-500/80">
              End time must be after {minTime}.
            </p>
          ) : null}
        </div>

        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-xs font-semibold tracking-wide uppercase px-6"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleContinue}
            disabled={hasInvalidTimeRange}
            className="text-xs font-semibold tracking-wide uppercase px-6"
          >
            Resume Work
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
