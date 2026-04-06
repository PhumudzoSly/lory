export type BreakType = "eye" | "hydrate" | "stretch" | "full" | "posture" | "mindfulness" | "wrist";
export type BuddySkin = "sunny" | "mint" | "sky" | "rose" | "lavender" | "peach" | "slate" | "charcoal";
export type WorkDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

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

export type DailyWorkLog = {
  date: string;      // ISO date "2026-04-06"
  day: string;       // "Sunday"
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  hours: number;     // (endTime - startTime) in hours, always >= 0
  source?: "auto";   // helps filtering/cleanup
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
  workStartTime: string; // global default, kept in sync with today's log
  workEndTime: string;   // global default, kept in sync with today's log
  workHoursGoal: number;
  workDays: WorkDay[];
  autoWorkLogging: boolean;
  dailyLogs: Record<string, DailyWorkLog>;
  lastFiredAt: Partial<Record<BreakType, number>>; // epoch ms, written by scheduler when a break fires
};

export const BUDDY_SKINS: Array<{ id: BuddySkin; label: string }> = [
  { id: "sunny", label: "Sunny" },
  { id: "mint", label: "Mint" },
  { id: "sky", label: "Sky" },
  { id: "rose", label: "Rose" },
  { id: "lavender", label: "Lavender" },
  { id: "peach", label: "Peach" },
  { id: "slate", label: "Slate" },
  { id: "charcoal", label: "Charcoal" },
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
  mindfulness: {
    label: "Mindfulness",
    action: "2 minutes of box breathing",
    priority: 2,
    min: 30,
    max: 120,
    defaultMinutes: 90,
  },
  wrist: {
    label: "Wrist Care",
    action: "Prayer stretches and wrist circles",
    priority: 2,
    min: 30,
    max: 120,
    defaultMinutes: 60,
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
  mindfulness: [
    "Clear your attention residue. Take a breath.",
    "Mental reset: look out a window, defocus.",
    "Box breathing time. Inhale, hold, exhale, hold.",
  ],
  wrist: [
    "Keyboard timeout. Stretch those wrists.",
    "Prevent RSI: do some quick wrist circles.",
    "Give your fingers a break. Flex and stretch.",
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
    mindfulness: {
      enabled: true,
      intervalMinutes: BREAK_META.mindfulness.defaultMinutes,
    },
    wrist: {
      enabled: true,
      intervalMinutes: BREAK_META.wrist.defaultMinutes,
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
  workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  autoWorkLogging: true,
  dailyLogs: {},
  lastFiredAt: {},
});

const TIME_RE = /^\d{2}:\d{2}$/;
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function computeHours(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  return Math.max(0, (endH * 60 + endM - startH * 60 - startM) / 60);
}

function deriveEndTime(startTime: string, hours: number): string {
  const [startH, startM] = startTime.split(":").map(Number);
  const totalMins = startH * 60 + startM + Math.round(Math.max(0, hours) * 60);
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Migrates raw persisted data (potentially old format) into a valid AppSettings.
 * Safe to call on already-migrated settings (idempotent).
 */
export function migrateLegacySettings(raw: Record<string, unknown>): AppSettings {
  const base = buildDefaultSettings();
  const merged = { ...base, ...(raw as Partial<AppSettings>) };

  // Ensure workDays exists
  if (!Array.isArray(merged.workDays) || merged.workDays.length === 0) {
    merged.workDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  }

  // Ensure autoWorkLogging exists
  if (typeof merged.autoWorkLogging !== "boolean") {
    merged.autoWorkLogging = true;
  }

  const defaultStart =
    typeof raw.workStartTime === "string" && TIME_RE.test(raw.workStartTime)
      ? raw.workStartTime
      : base.workStartTime;

  const rawLogs = raw.dailyLogs as Record<string, unknown> | undefined;
  if (rawLogs && typeof rawLogs === "object") {
    const migratedLogs: Record<string, DailyWorkLog> = {};

    for (const [dateStr, value] of Object.entries(rawLogs)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) continue;
        migratedLogs[dateStr] = {
          date: dateStr,
          day: DAY_NAMES[date.getDay()] ?? "Unknown",
          startTime: defaultStart,
          endTime: deriveEndTime(defaultStart, value),
          hours: Math.max(0, value),
        };
      } else if (value && typeof value === "object" && "hours" in value) {
        migratedLogs[dateStr] = value as DailyWorkLog;
      }
    }

    merged.dailyLogs = migratedLogs;
  }

  return merged;
}

export { computeHours, DAY_NAMES };

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

