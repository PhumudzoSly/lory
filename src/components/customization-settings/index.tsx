import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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

export function CustomizationSettings({
  settings,
  setSettings,
  skinSwatchClass,
}: CustomizationSettingsProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-0">
      <header className="mb-12 max-w-4xl">
        <h2 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Customization
        </h2>
        <p className="text-lg text-muted-foreground">
          Personalize your Lory buddy and app appearance.
        </p>
      </header>

      <div className="flex flex-col space-y-0 divide-y divide-border/40 max-w-4xl">
        {/* Buddy Identity */}
        <section className="py-8 flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3 shrink-0">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Buddy Identity
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Give your buddy a unique name.
            </p>
          </div>

          <div className="md:w-2/3 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="buddy-name"
                className="text-sm font-medium text-muted-foreground"
              >
                Buddy Name
              </Label>
              <Input
                id="buddy-name"
                className="max-w-md bg-background focus-visible:ring-primary h-10"
                type="text"
                value={settings.buddyName}
                maxLength={24}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    buddyName:
                      event.target.value.trimStart().slice(0, 24) || "Lory",
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* Buddy Look */}
        <section className="py-8 flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3 shrink-0">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Buddy Look
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Choose a color palette for your buddy.
            </p>
          </div>

          <div className="md:w-2/3">
            <RadioGroup
              value={settings.buddySkin}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  buddySkin: value as BuddySkin,
                }))
              }
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {BUDDY_SKINS.map((skin) => (
                <Label
                  key={skin.id}
                  htmlFor={`skin-${skin.id}`}
                  className="flex flex-col items-center justify-between rounded-md border border-border/40 bg-card/50 p-4 hover:bg-accent/50 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
                >
                  <RadioGroupItem
                    value={skin.id}
                    id={`skin-${skin.id}`}
                    className="sr-only"
                  />
                  <span
                    className={`h-10 w-10 rounded-full border border-border/50 mb-3 ${
                      skinSwatchClass[skin.id]
                    }`}
                  />
                  <span className="font-semibold text-xs">{skin.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </section>

        {/* App Theme */}
        <section className="py-8 flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3 shrink-0">
            <h3 className="text-lg font-bold text-foreground mb-1">
              App Theme
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Select your preferred application theme.
            </p>
          </div>

          <div className="md:w-2/3">
            <RadioGroup
              value={theme}
              onValueChange={(value: "light" | "dark" | "system") =>
                setTheme(value)
              }
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border border-border/40 bg-card/50 p-4 hover:bg-accent/50 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value="light"
                  id="theme-light"
                  className="sr-only"
                />
                <IconSun className="mb-3 h-6 w-6 text-amber-500" />
                <span className="font-semibold text-xs">Light</span>
              </Label>

              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border border-border/40 bg-card/50 p-4 hover:bg-accent/50 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value="dark"
                  id="theme-dark"
                  className="sr-only"
                />
                <IconMoon className="mb-3 h-6 w-6 text-indigo-400" />
                <span className="font-semibold text-xs">Dark</span>
              </Label>

              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border border-border/40 bg-card/50 p-4 hover:bg-accent/50 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
              >
                <RadioGroupItem
                  value="system"
                  id="theme-system"
                  className="sr-only"
                />
                <IconDeviceDesktop className="mb-3 h-6 w-6 text-slate-500" />
                <span className="font-semibold text-xs">System</span>
              </Label>
            </RadioGroup>
          </div>
        </section>
      </div>
    </div>
  );
}
