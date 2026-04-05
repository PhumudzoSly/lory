import type { BreakType } from "../lib/buddyConfig";

export type BreakToastState = {
  kind: "break";
  breakType: BreakType;
  message: string;
};

export type WorkReminderMilestone = 30 | 15 | 0;

export type WorkReminderToastState = {
  kind: "work-reminder";
  label: string;
  action: string;
  message: string;
};

export type CustomReminderToastState = {
  kind: "custom-reminder";
  label: string;
  action: string;
  message: string;
};

export type ToastState =
  | BreakToastState
  | WorkReminderToastState
  | CustomReminderToastState;
