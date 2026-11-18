import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createScale } from "@my-design/tokens";

export type Theme = "light" | "dark";

/**
 * Swap the brand color at runtime (e.g. per customer or for previews).
 * For a permanent change edit BRAND in packages/tokens/src/index.ts instead.
 */
export function applyBrand(hex: string, el: HTMLElement = document.documentElement) {
  const scale = createScale(hex);
  for (const [k, v] of Object.entries(scale)) el.style.setProperty(`--md-brand-${k}`, v);
}

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: "light", setTheme: () => {} });
export const useTheme = () => useContext(ThemeCtx);

/** Sets data-theme on <html> so the CSS variables switch between light and dark. */
export function ThemeProvider({ children, defaultTheme = "light", brand }: { children: ReactNode; defaultTheme?: Theme; brand?: string }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    if (brand) applyBrand(brand);
  }, [brand]);
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}
