import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { getDefaultTheme, getTheme, themeCssVars, type HomeTheme } from "./themes";

const STORAGE_KEY = "homeTheme";

const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

type Ctx = { theme: HomeTheme; setThemeId: (id: string) => void };

const HomeThemeContext = createContext<Ctx | null>(null);

export function useHomeTheme() {
  const ctx = useContext(HomeThemeContext);
  if (!ctx) throw new Error("useHomeTheme must be used within HomeThemeProvider");
  return ctx;
}

function initialTheme() {
  const saved = storage.get(STORAGE_KEY);
  return saved ? getTheme(saved) : getDefaultTheme();
}

export function HomeThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<HomeTheme>(initialTheme);

  const setThemeId = (id: string) => {
    setTheme(getTheme(id));
    storage.set(STORAGE_KEY, id);
  };

  // Push theme colors into CSS vars on <html>; removed when leaving the home page.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const vars = themeCssVars(theme);
    for (const [k, v] of vars) root.style.setProperty(k, v);
    return () => {
      for (const [k] of vars) root.style.removeProperty(k);
    };
  }, [theme]);

  return <HomeThemeContext.Provider value={{ theme, setThemeId }}>{children}</HomeThemeContext.Provider>;
}
