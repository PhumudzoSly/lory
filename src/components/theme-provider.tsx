import { createContext, useContext, useEffect, useState } from "react"
import { load as loadStore } from "@tauri-apps/plugin-store"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const STORE_FILE = "Lory.json"
const STORE_THEME_KEY = "settings.theme"

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system"

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const rawTheme = localStorage.getItem(storageKey)
    return isTheme(rawTheme) ? rawTheme : defaultTheme
  })

  useEffect(() => {
    let cancelled = false

    const hydrateTheme = async () => {
      try {
        const store = await loadStore(STORE_FILE, {
          defaults: {},
          autoSave: true,
        })

        const persistedTheme = await store.get<Theme>(STORE_THEME_KEY)
        if (cancelled) return

        if (isTheme(persistedTheme)) {
          setTheme(persistedTheme)
          localStorage.setItem(storageKey, persistedTheme)
          return
        }

        await store.set(STORE_THEME_KEY, theme)
      } catch {
        // Ignore store failures so web mode still works with localStorage.
      }
    }

    void hydrateTheme()

    return () => {
      cancelled = true
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(storageKey, theme)

    const persistTheme = async () => {
      try {
        const store = await loadStore(STORE_FILE, {
          defaults: {},
          autoSave: true,
        })
        await store.set(STORE_THEME_KEY, theme)
      } catch {
        // Ignore store failures so localStorage remains the fallback.
      }
    }

    void persistTheme()
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}