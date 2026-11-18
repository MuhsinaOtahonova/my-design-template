import { createContext, createElement, useContext, type ReactNode } from "react";
import { colors, darkColors, palette, radii, spacing, typography, nativeShadows, sizes, type ColorToken } from "@my-design/tokens";

export type ThemeMode = "light" | "dark";
export type Colors = Record<ColorToken, string>;

const ThemeCtx = createContext<ThemeMode>("light");

/**
 * Wrap the app to pick day (light) or night (dark) colors:
 *   <ThemeProvider mode={useColorScheme() ?? "light"}>…</ThemeProvider>
 */
export function ThemeProvider({ mode = "light", children }: { mode?: ThemeMode; children: ReactNode }) {
  return createElement(ThemeCtx.Provider, { value: mode }, children);
}

export const useThemeMode = () => useContext(ThemeCtx);
/** Semantic colors for the current theme (same keys as `colors` in @my-design/tokens). */
export const useColors = (): Colors => (useContext(ThemeCtx) === "dark" ? darkColors : colors);

/** Creates a hook that returns styles built for the current theme (cached per theme). */
export function themed<T>(factory: (c: Colors) => T) {
  const cache: Partial<Record<ThemeMode, T>> = {};
  return (): T => {
    const mode = useContext(ThemeCtx);
    return (cache[mode] ??= factory(mode === "dark" ? darkColors : colors));
  };
}

export const p = palette;
export const r = radii;
export const s = spacing;
export const sh = nativeShadows;
export const touch = sizes.touch;
export const font = typography.nativeFontFamily;
export const fs = typography.fontSize;
