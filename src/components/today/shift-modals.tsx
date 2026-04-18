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
import {
  IconBriefcase,
  IconPalette,
  IconBrain,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface ShiftModalsProps {
  shiftState: "not-started" | "in-progress";
  onStartShift: (data: {
    startTime: string;
    endTime: string;
    breaks: boolean;
    workType: string;
  }) => void;
  onEndShift: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShiftModals = ({
  shiftState,
  onStartShift,
  onEndShift,
  isOpen,
  onOpenChange,
}: ShiftModalsProps) => {
  // Start Shift State
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breaks, setBreaks] = useState(true);
  const [workType, setWorkType] = useState("normal");

  const hasInvalidTimeRange = startTime >= endTime;

  const handleStart = () => {
    onStartShift({ startTime, endTime, breaks, workType });
    onOpenChange(false);
  };

  const handleEnd = () => {
    onEndShift();
    onOpenChange(false);
  };

  if (shiftState === "not-started") {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-6 border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
          <DialogHeader className="space-y-1.5 text-left pb-4 border-b border-border/10">
            <div className="flex items-center gap-2 text-foreground/80">
              <IconSun size={18} stroke={2.5} />
              <DialogTitle className="text-lg tracking-tight">
                Start Your Day
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground/60 leading-relaxed max-w-sm">
              Set your intentions and schedule for today.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Time Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-foreground/20 text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  End Time
                </Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-foreground/20 text-sm h-9"
                />
              </div>
            </div>

            {hasInvalidTimeRange ? (
              <p className="text-xs font-medium text-red-500/80">
                End time must be after start time.
              </p>
            ) : null}

            {/* Work Type Selection */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Work Focus
              </Label>
              <RadioGroup
                value={workType}
                onValueChange={setWorkType}
                className="grid grid-cols-3 gap-3"
              >
                <Label
                  htmlFor="type-normal"
                  className={`flex flex-col items-center justify-center gap-2 border ${workType === "normal" ? "border-primary/50 bg-primary/5" : "border-border/40 bg-card/20"} p-3 transition-colors hover:bg-card/40 cursor-pointer`}
                >
                  <RadioGroupItem
                    value="normal"
                    id="type-normal"
                    className="sr-only"
                  />
                  <IconBriefcase
                    size={20}
                    stroke={2}
                    className={
                      workType === "normal"
                        ? "text-primary"
                        : "text-muted-foreground/50"
                    }
                  />
                  <span
                    className={`text-xs font-medium ${workType === "normal" ? "text-foreground/90" : "text-muted-foreground/70"}`}
                  >
                    Normal
                  </span>
                </Label>

                <Label
                  htmlFor="type-deep"
                  className={`flex flex-col items-center justify-center gap-2 border ${workType === "deep" ? "border-blue-500/50 bg-blue-500/5" : "border-border/40 bg-card/20"} p-3 transition-colors hover:bg-card/40 cursor-pointer`}
                >
                  <RadioGroupItem
                    value="deep"
                    id="type-deep"
                    className="sr-only"
                  />
                  <IconBrain
                    size={20}
                    stroke={2}
                    className={
                      workType === "deep"
                        ? "text-blue-500"
                        : "text-muted-foreground/50"
                    }
                  />
                  <span
                    className={`text-xs font-medium ${workType === "deep" ? "text-foreground/90" : "text-muted-foreground/70"}`}
                  >
                    Deep Work
                  </span>
                </Label>

                <Label
                  htmlFor="type-creative"
                  className={`flex flex-col items-center justify-center gap-2 border ${workType === "creative" ? "border-purple-500/50 bg-purple-500/5" : "border-border/40 bg-card/20"} p-3 transition-colors hover:bg-card/40 cursor-pointer`}
                >
                  <RadioGroupItem
                    value="creative"
                    id="type-creative"
                    className="sr-only"
                  />
                  <IconPalette
                    size={20}
                    stroke={2}
                    className={
                      workType === "creative"
                        ? "text-purple-500"
                        : "text-muted-foreground/50"
                    }
                  />
                  <span
                    className={`text-xs font-medium ${workType === "creative" ? "text-foreground/90" : "text-muted-foreground/70"}`}
                  >
                    Creative
                  </span>
                </Label>
              </RadioGroup>
            </div>

            {/* Breaks Toggle */}
            <div className="flex items-center justify-between border border-border/40 bg-card/20 p-3 shadow-none">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground/80">
                  Schedule Breaks
                </Label>
                <p className="text-xs text-muted-foreground/50">
                  Automatically block out time for rest.
                </p>
              </div>
              <Switch
                checked={breaks}
                onCheckedChange={setBreaks}
                className="h-4 w-7 data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border/10 pt-4 sm:justify-start">
            <Button
              onClick={handleStart}
              disabled={hasInvalidTimeRange}
              className="text-xs h-8 px-4 bg-foreground/90 text-background hover:bg-foreground transition-colors font-medium"
            >
              Start Shift
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="text-xs h-8 px-4 text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // End Shift State
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-90 p-6 border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-foreground/80">
            <IconMoon size={18} stroke={2.5} />
            <DialogTitle className="text-lg tracking-tight">
              End Shift Early?
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground/60 leading-relaxed">
            You still have some scheduled time remaining. Are you sure you want
            to end your day now?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 sm:justify-start gap-2">
          <Button
            onClick={handleEnd}
            variant="destructive"
            className="text-xs h-8 px-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors font-medium"
          >
            End Shift
          </Button>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-xs h-8 px-4 text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Continue Working
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftModals;
