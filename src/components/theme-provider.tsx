import { createContext, useContext, useEffect, useState } from "react";
import {
  readSqliteString,
  SQLITE_KEYS,
  writeSqliteString,
} from "../lib/sqliteStorage";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrateTheme = async () => {
      try {
        const persistedTheme = await readSqliteString(SQLITE_KEYS.theme);
        if (cancelled) return;

        if (isTheme(persistedTheme)) {
          setTheme(persistedTheme);
        }
      } catch {
        // Keep default theme when SQLite access fails.
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void hydrateTheme();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const persistTheme = async () => {
      try {
        await writeSqliteString(SQLITE_KEYS.theme, theme);
      } catch {
        // Ignore persistence failures to avoid breaking rendering.
      }
    };

    void persistTheme();
  }, [hydrated, theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
