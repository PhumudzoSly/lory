import type {
  WorkReminderMilestone,
  WorkReminderToastState,
} from "../types/toast";

export const WORK_REMINDER_MILESTONES: WorkReminderMilestone[] = [30, 15, 0];

export const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const createWorkReminderToast = (
  milestone: WorkReminderMilestone,
): WorkReminderToastState => {
  if (milestone === 30) {
    return {
      kind: "work-reminder",
      label: "Workday Check-In",
      action: "30 minutes left",
      message:
        "Only 30 minutes left in your workday. Start wrapping up calmly.",
    };
  }

  if (milestone === 15) {
    return {
      kind: "work-reminder",
      label: "Almost Done",
      action: "15 minutes left",
      message:
        "15 minutes to go. Pick a stopping point and prepare to log off.",
    };
  }

  return {
    kind: "work-reminder",
    label: "Clock-Out Time",
    action: "Workday complete",
    message: "Work time is up. Breathe a bit and touch some grass.",
  };
};
