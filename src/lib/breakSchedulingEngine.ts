import type { BreakSetting, BreakType } from "./buddyConfig";

export const SMART_BREAK_INTERVALS: Record<BreakType, number> = {
  eye: 90,
  hydrate: 90,
  posture: 180,
  stretch: 270,
  full: 270,
  mindfulness: 270,
  wrist: 270,
};

const QUICK_BREAK_GROUP: BreakType[] = ["eye", "hydrate"];
const DEEP_BREAK_GROUP: BreakType[] = [
  "stretch",
  "full",
  "mindfulness",
  "wrist",
];

const COMBINE_WINDOW_MS = 12 * 60 * 1_000;
const SAFETY_DEFER_MS = 20 * 60 * 1_000;
const MIN_RECOMMENDED_GAP_MINUTES = 20;

const BREAK_GROUP_LABELS: Record<"quick" | "deep", string> = {
  quick: "Quick Recharge",
  deep: "Deep Reset",
};

const BREAK_GROUP_ACTIONS: Record<"quick" | "deep", string> = {
  quick: "Rest your eyes and hydrate.",
  deep: "Step away from your desk and reset your body.",
};

export type BreakBatch = {
  triggered: BreakType[];
  deferred: BreakType[];
};

const isInGroup = (breakType: BreakType, group: BreakType[]): boolean =>
  group.includes(breakType);

const inferGroup = (breakType: BreakType): "quick" | "deep" | null => {
  if (isInGroup(breakType, QUICK_BREAK_GROUP)) {
    return "quick";
  }
  if (isInGroup(breakType, DEEP_BREAK_GROUP)) {
    return "deep";
  }
  return null;
};

export const applySmartBreakIntervals = (
  breaks: Record<BreakType, BreakSetting>,
): Record<BreakType, BreakSetting> => {
  const next = { ...breaks };
  for (const breakType of Object.keys(SMART_BREAK_INTERVALS) as BreakType[]) {
    next[breakType] = {
      ...next[breakType],
      intervalMinutes: SMART_BREAK_INTERVALS[breakType],
    };
  }
  return next;
};

export const getBreakSpacingWarnings = (
  breaks: Record<BreakType, BreakSetting>,
): string[] => {
  const enabled = (Object.keys(breaks) as BreakType[])
    .filter((breakType) => breaks[breakType].enabled)
    .map((breakType) => ({
      breakType,
      minutes: breaks[breakType].intervalMinutes,
    }))
    .sort((a, b) => a.minutes - b.minutes);

  const warnings: string[] = [];
  for (let i = 1; i < enabled.length; i += 1) {
    const prev = enabled[i - 1];
    const curr = enabled[i];
    const gap = curr.minutes - prev.minutes;
    if (gap < MIN_RECOMMENDED_GAP_MINUTES) {
      warnings.push(
        `${prev.breakType} (${prev.minutes}m) and ${curr.breakType} (${curr.minutes}m) are too close.`,
      );
    }
  }

  return warnings;
};

export const selectBreakBatch = ({
  now,
  due,
  enabled,
  nextDueAt,
}: {
  now: number;
  due: BreakType[];
  enabled: BreakType[];
  nextDueAt: Record<BreakType, number>;
}): BreakBatch => {
  if (due.length === 0) {
    return { triggered: [], deferred: [] };
  }

  const sortedDue = [...due].sort((a, b) => nextDueAt[a] - nextDueAt[b]);
  const anchor = sortedDue[0];
  const anchorGroup = inferGroup(anchor);

  const triggered = new Set<BreakType>([anchor]);
  if (anchorGroup) {
    const candidates =
      anchorGroup === "quick" ? QUICK_BREAK_GROUP : DEEP_BREAK_GROUP;
    for (const breakType of candidates) {
      if (!enabled.includes(breakType)) {
        continue;
      }
      const deltaMs = nextDueAt[breakType] - now;
      if (due.includes(breakType) || deltaMs <= COMBINE_WINDOW_MS) {
        triggered.add(breakType);
      }
    }
  }

  const deferred = sortedDue.filter((breakType) => !triggered.has(breakType));
  return { triggered: Array.from(triggered), deferred };
};

export const buildBreakNotification = (
  breakTypes: BreakType[],
): { title: string; body: string } => {
  if (breakTypes.length === 1) {
    return {
      title: "Wellbeing Break",
      body:
        breakTypes[0] === "posture"
          ? "Quick posture reset. Shoulders down, spine tall."
          : "Time for your scheduled break.",
    };
  }

  const groups = breakTypes
    .map((breakType) => inferGroup(breakType))
    .filter((value): value is "quick" | "deep" => value !== null);

  const group = groups.includes("deep") ? "deep" : "quick";
  return {
    title: BREAK_GROUP_LABELS[group],
    body: BREAK_GROUP_ACTIONS[group],
  };
};

export { SAFETY_DEFER_MS };
