import { Input } from "../ui/input";
import { useTheme } from "../theme-provider";
import { IconDeviceDesktop, IconSun, IconMoon } from "@tabler/icons-react";
import type { AppSettings, BuddySkin } from "../../lib/buddyConfig";
import { BUDDY_SKINS } from "../../lib/buddyConfig";

type CustomizationSettingsProps = Readonly<{
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
}>;

type Theme = "light" | "dark" | "system";

const THEMES: ReadonlyArray<{ id: Theme; label: string; Icon: typeof IconSun }> = [
  { id: "light", label: "Light", Icon: IconSun },
  { id: "dark", label: "Dark", Icon: IconMoon },
  { id: "system", label: "Auto", Icon: IconDeviceDesktop },
];

function Row({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-center justify-between gap-8 py-5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function CustomizationSettings({
  settings,
  setSettings,
  skinSwatchClass,
}: CustomizationSettingsProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight mb-8">Customization</h2>

      <div className="divide-y divide-border/40">
        <Row label="Name">
          <Input
            type="text"
            value={settings.buddyName}
            maxLength={24}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                buddyName: event.target.value.trimStart().slice(0, 24) || "Lory",
              }))
            }
            className="h-8 w-48 border-0 bg-transparent text-right focus-visible:ring-0 focus-visible:bg-muted/50"
          />
        </Row>

        <Row label="Skin">
          <div className="flex gap-2">
            {BUDDY_SKINS.map((skin) => {
              const selected = settings.buddySkin === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  aria-label={skin.label}
                  aria-pressed={selected}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, buddySkin: skin.id }))
                  }
                  className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition ${skinSwatchClass[skin.id]} ${selected ? "ring-2 ring-foreground" : "hover:scale-110"}`}
                />
              );
            })}
          </div>
        </Row>

        <Row label="Theme">
          <div className="inline-flex rounded-md bg-muted/50 p-0.5">
            {THEMES.map(({ id, label, Icon }) => {
              const selected = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition ${selected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </Row>
      </div>

    </div>
  );
}
