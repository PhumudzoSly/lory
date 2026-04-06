import type { PointerEvent as ReactPointerEvent } from "react";
import type { BuddySkin } from "../lib/buddyConfig";
import "./BuddyCharacter.css";

type BuddyCharacterProps = {
  emotion: "idle" | "nudging" | "happy" | "concerned" | "sleeping";
  skin: BuddySkin;
  name: string;
  onClick: () => void;
  onContextMenu: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
};

// Map skins directly to hex values so they can be injected as custom CSS variables
const skinColors: Record<BuddySkin, { start: string; end: string }> = {
  sunny: { start: "#fde68a", end: "#fdba74" }, // amber-200 to orange-300
  mint: { start: "#d1fae5", end: "#6ee7b7" }, // emerald-100 to emerald-300
  sky: { start: "#e0f2fe", end: "#93c5fd" }, // sky-100 to blue-300
  rose: { start: "#ffe4e6", end: "#fda4af" }, // pink-100 to rose-300
  lavender: { start: "#f3e8ff", end: "#d8b4fe" }, // purple-100 to purple-300
  peach: { start: "#ffedd5", end: "#fecaca" }, // orange-100 to red-200
  slate: { start: "#e2e8f0", end: "#94a3b8" }, // slate-200 to slate-400
  charcoal: { start: "#3f3f46", end: "#18181b" }, // zinc-700 to zinc-900
};

export function BuddyCharacter({
  emotion,
  skin,
  name,
  onClick,
  onContextMenu,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BuddyCharacterProps) {
  const colors = skinColors[skin];

  return (
    <button
      type="button"
      className={`buddy-character buddy-emotion-${emotion}`}
      style={
        {
          "--buddy-grad-start": colors.start,
          "--buddy-grad-end": colors.end,
        } as React.CSSProperties
      }
      title={name}
      aria-label={`${name} companion`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <span className="buddy-glass" />
      <span className="buddy-face">
        <span className="buddy-eye eye-left" />
        <span className="buddy-eye eye-right" />
        <span className="buddy-cheek cheek-left" />
        <span className="buddy-cheek cheek-right" />
        <span className="buddy-mouth" />
      </span>
      {emotion === "sleeping" && <span className="buddy-zzz">zzz</span>}
    </button>
  );
}
