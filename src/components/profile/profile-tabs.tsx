import { useState } from "react";
import { IconUser, IconBriefcase } from "@tabler/icons-react";
import { AuthTab } from "./auth-tab";
import { WorkTab } from "./work-tab";

type TabKey = "account" | "work";

type TabDef = {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
};

const TABS: TabDef[] = [
  { key: "account", label: "Account", icon: IconUser },
  { key: "work", label: "Work", icon: IconBriefcase },
];

type Props = {
  user: {
    name?: string | null;
    image?: string | null;
    email: string;
  };
};

export function ProfileTabs({ user }: Props) {
  const [active, setActive] = useState<TabKey>("account");

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-6 border-b border-border/40">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={[
                "group relative -mb-px flex items-center gap-2 pb-3 pt-1 text-[12px] font-medium tracking-wide transition-colors",
                isActive
                  ? "text-foreground/90"
                  : "text-muted-foreground/50 hover:text-foreground/70",
              ].join(" ")}
            >
              <Icon size={14} stroke={2} />
              {label}
              <span
                className={[
                  "absolute inset-x-0 bottom-0 h-px transition-colors",
                  isActive ? "bg-foreground/80" : "bg-transparent",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </nav>

      <div>
        {active === "account" && (
          <AuthTab
            name={user.name ?? ""}
            image={user.image ?? ""}
            email={user.email}
          />
        )}
        {active === "work" && <WorkTab />}
      </div>
    </div>
  );
}
