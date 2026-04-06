import { useState } from "react";
import { IconClockHour4, IconEdit, IconInfoCircle } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettings } from "../../lib/buddyConfig";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

export function TodaySession({ settings, setSettings }: Props) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(settings.workStartTime);
  const [draftEnd, setDraftEnd] = useState(settings.workEndTime);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftStart(settings.workStartTime);
      setDraftEnd(settings.workEndTime);
    }
    setOpen(nextOpen);
  };

  const handleSave = () => {
    setSettings((prev) => ({
      ...prev,
      workStartTime: draftStart,
      workEndTime: draftEnd,
    }));
    setOpen(false);
  };

  return (
    <section className="bg-card p-8 rounded-2xl shadow-sm border-none">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
            <IconClockHour4 className="text-primary size-6" />
            Define Your Workday
          </h3>
          <p className="text-muted-foreground text-sm">
            Set your standard hours to help Lory protect your downtime.
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary/5 hover:text-primary font-semibold text-sm transition-colors group"
            >
              <IconEdit className="size-4" />
              Change Work Time
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Update Work Hours</DialogTitle>
              <DialogDescription>
                Adjust your standard working hours below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="start-time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="h-12 text-lg font-bold rounded-xl"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="end-time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={draftEnd}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="h-12 text-lg font-bold rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="rounded-xl px-8 w-full sm:w-auto">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-6 p-6 rounded-xl bg-accent/40 border-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-background rounded-lg shadow-sm border-none">
            <span className="text-xl font-bold text-primary">
              {settings.workStartTime}
            </span>
          </div>
          <span className="text-muted-foreground font-medium">to</span>
          <div className="p-3 bg-background rounded-lg shadow-sm border-none">
            <span className="text-xl font-bold text-primary">
              {settings.workEndTime}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground text-xs italic font-medium">
          <IconInfoCircle className="size-4" />
          Changes apply from tomorrow
        </div>
      </div>
    </section>
  );
}
