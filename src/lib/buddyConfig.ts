export type BreakType = "eye" | "hydrate" | "stretch" | "full" | "posture";
export type BuddySkin = "sunny" | "mint" | "sky" | "rose";

export type BreakSetting = {
  enabled: boolean;
  intervalMinutes: number;
};

export type ReminderPriority = "gentle" | "standard" | "nag";
export type ReminderScheduleType = "daily" | "once" | "interval";

export type CustomReminderHistoryEntry = {
  id: string;
  reminderId: string;
  title: string;
  action: string;
  triggeredAtIso: string;
};

export type CustomReminder = {
  id: string;
  title: string;
  description: string;
  time: string; // HH:mm
  days: string[]; // e.g. ["Mon", "Tue"] or ["Every day"]
  enabled: boolean;
  icon: string;
  scheduleType: ReminderScheduleType;
  onceDate?: string; // YYYY-MM-DD when scheduleType is "once"
  intervalMinutes?: number; // when scheduleType is "interval"
  priority?: ReminderPriority;
  messages?: string[]; // For roulette functionality
};

export type AppSettings = {
  breaks: Record<BreakType, BreakSetting>;
  customReminders: CustomReminder[];
  customReminderHistory: CustomReminderHistoryEntry[];
  mute: boolean;
  launchOnStartup: boolean;
  autoPauseFullscreen: boolean;
  buddyName: string;
  buddySkin: BuddySkin;
  workStartTime: string;
  workEndTime: string;
  workHoursGoal: number;
  dailyLogs: Record<string, number>;
};

export const BUDDY_SKINS: Array<{ id: BuddySkin; label: string }> = [
  { id: "sunny", label: "Sunny" },
  { id: "mint", label: "Mint" },
  { id: "sky", label: "Sky" },
  { id: "rose", label: "Rose" },
];

export const BREAK_META: Record<
  BreakType,
  {
    label: string;
    action: string;
    priority: number;
    min: number;
    max: number;
    defaultMinutes: number;
  }
> = {
  eye: {
    label: "Eye Rest",
    action: "Look 20ft away for 20 seconds",
    priority: 2,
    min: 10,
    max: 60,
    defaultMinutes: 20,
  },
  hydrate: {
    label: "Hydrate",
    action: "Drink a bit of water",
    priority: 2,
    min: 15,
    max: 90,
    defaultMinutes: 30,
  },
  stretch: {
    label: "Stand & Stretch",
    action: "Stand up and stretch major muscle groups",
    priority: 3,
    min: 30,
    max: 180,
    defaultMinutes: 60,
  },
  full: {
    label: "Full Break",
    action: "Step away from the screen for 5-10 minutes",
    priority: 3,
    min: 45,
    max: 240,
    defaultMinutes: 90,
  },
  posture: {
    label: "Posture Check",
    action: "Sit up straight and relax your shoulders",
    priority: 1,
    min: 10,
    max: 40,
    defaultMinutes: 25,
  },
};

export const MESSAGES: Record<BreakType, string[]> = {
  eye: [
    "Your eyes called - they want a tiny vacation.",
    "Quick eye reset: look far away for 20 seconds.",
    "Blink break. Your retinas deserve better.",
  ],
  hydrate: [
    "Sip check. Future-you says thanks.",
    "Water break time. Tiny action, big win.",
    "Hydration ping. Take two sips.",
  ],
  stretch: [
    "Stand up! Your spine filed a bug report.",
    "Stretch minute unlocked. Go claim it.",
    "Posture patrol says: rise and move.",
  ],
  full: [
    "Time for a real break. Step away for a few.",
    "Big reset moment. Leave the keyboard briefly.",
    "You earned a screen break. Walk a little.",
  ],
  posture: [
    "Shoulders down. Neck long. Breathe once.",
    "Quick posture check. Sit tall.",
    "Micro-adjust: back straight, wrists neutral.",
  ],
};

export const buildDefaultSettings = (): AppSettings => ({
  breaks: {
    eye: { enabled: true, intervalMinutes: BREAK_META.eye.defaultMinutes },
    hydrate: {
      enabled: true,
      intervalMinutes: BREAK_META.hydrate.defaultMinutes,
    },
    stretch: {
      enabled: true,
      intervalMinutes: BREAK_META.stretch.defaultMinutes,
    },
    full: { enabled: true, intervalMinutes: BREAK_META.full.defaultMinutes },
    posture: {
      enabled: true,
      intervalMinutes: BREAK_META.posture.defaultMinutes,
    },
  },
  customReminders: [],
  customReminderHistory: [],
  mute: false,
  launchOnStartup: false,
  autoPauseFullscreen: true,
  buddyName: "Lory",
  buddySkin: "sunny",
  workStartTime: "09:00",
  workEndTime: "17:00",
  workHoursGoal: 40,
  dailyLogs: {},
});

export const getRandomMessage = (breakType: BreakType): string => {
  const pool = MESSAGES[breakType];
  return pool[Math.floor(Math.random() * pool.length)] ?? "Time for a break.";
};

const postureRandomMinutes = (): number => 20 + Math.floor(Math.random() * 11);

export const nextDueTimestamp = (
  breakType: BreakType,
  minutes: number,
): number => {
  const selectedMinutes =
    breakType === "posture" ? postureRandomMinutes() : minutes;
  return Date.now() + selectedMinutes * 60_000;
};
