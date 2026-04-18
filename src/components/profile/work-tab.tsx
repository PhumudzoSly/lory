import { WorkProfileCard } from "./work-profile-card";
import { WorkScheduleCard } from "./work-schedule-card";

export function WorkTab() {
  return (
    <div className="space-y-10">
      <WorkProfileCard />
      <div className="h-px w-full bg-border/40" aria-hidden="true" />
      <WorkScheduleCard />
    </div>
  );
}
