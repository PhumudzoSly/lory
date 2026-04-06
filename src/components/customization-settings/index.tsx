import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { useTheme } from "../theme-provider";
import { IconPalette, IconDeviceDesktop, IconSun, IconMoon, IconUser } from "@tabler/icons-react";
import type { AppSettings, BuddySkin } from "../../lib/buddyConfig";
import { BUDDY_SKINS } from "../../lib/buddyConfig";

type CustomizationSettingsProps = {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  skinSwatchClass: Record<BuddySkin, string>;
};

export function CustomizationSettings({
  settings,
  setSettings,
  skinSwatchClass,
}: CustomizationSettingsProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-12">
      <header className="max-w-4xl">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Customization
        </h2>
        <p className="text-muted-foreground text-lg">
          Personalize your Lory buddy and app appearance.
        </p>
      </header>

      <div className="grid gap-6 max-w-4xl">
        {/* Buddy Identity */}
        <section className="bg-card p-8 rounded-xl border shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <IconUser className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Buddy Identity
              </h3>
              <p className="text-muted-foreground text-sm">
                Give your buddy a unique name.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buddy-name" className="text-sm font-semibold">
                Buddy Name
              </Label>
              <Input
                id="buddy-name"
                className="max-w-md bg-background focus-visible:ring-primary"
                type="text"
                value={settings.buddyName}
                maxLength={24}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    buddyName: event.target.value.trimStart().slice(0, 24) || "Lory",
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* Buddy Look */}
        <section className="bg-card p-8 rounded-xl border shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <IconPalette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Buddy Look</h3>
              <p className="text-muted-foreground text-sm">
                Choose a color palette for your buddy.
              </p>
            </div>
          </div>

          <RadioGroup
            value={settings.buddySkin}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, buddySkin: value as BuddySkin }))
            }
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {BUDDY_SKINS.map((skin) => (
              <Label
                key={skin.id}
                htmlFor={`skin-${skin.id}`}
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value={skin.id}
                  id={`skin-${skin.id}`}
                  className="sr-only"
                />
                <span
                  className={`h-12 w-12 rounded-full border shadow-sm mb-3 ${
                    skinSwatchClass[skin.id]
                  }`}
                />
                <span className="font-bold text-sm">{skin.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </section>

        {/* App Theme */}
        <section className="bg-card p-8 rounded-xl border shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <IconDeviceDesktop className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">App Theme</h3>
              <p className="text-muted-foreground text-sm">
                Select your preferred application theme.
              </p>
            </div>
          </div>

          <RadioGroup
            value={theme}
            onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="sr-only"
              />
              <IconSun className="mb-3 h-8 w-8 text-amber-500" />
              <span className="font-bold">Light</span>
            </Label>

            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="sr-only"
              />
              <IconMoon className="mb-3 h-8 w-8 text-indigo-400" />
              <span className="font-bold">Dark</span>
            </Label>

            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="sr-only"
              />
              <IconDeviceDesktop className="mb-3 h-8 w-8 text-slate-500" />
              <span className="font-bold">System</span>
            </Label>
          </RadioGroup>
        </section>
      </div>
    </div>
  );
}
