export type BuddySkin =
  | "sunny"
  | "mint"
  | "sky"
  | "rose"
  | "lavender"
  | "peach"
  | "slate"
  | "charcoal";

export type AppSettings = {
  buddyName: string;
  buddySkin: BuddySkin;
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

export const buildDefaultSettings = (): AppSettings => ({
  buddyName: "Lory",
  buddySkin: "sunny",
});

export function migrateLegacySettings(
  raw: Record<string, unknown>,
): AppSettings {
  const base = buildDefaultSettings();

  const candidateName = raw.buddyName;
  const candidateSkin = raw.buddySkin;

  const buddyName =
    typeof candidateName === "string" && candidateName.trim().length > 0
      ? candidateName.trim().slice(0, 24)
      : base.buddyName;

  const buddySkin =
    typeof candidateSkin === "string" &&
    BUDDY_SKINS.some((skin) => skin.id === candidateSkin)
      ? (candidateSkin as BuddySkin)
      : base.buddySkin;

  return {
    buddyName,
    buddySkin,
  };
}
