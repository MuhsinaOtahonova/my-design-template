/**
 * My Design — design tokens
 *
 * Mood: calm, professional office software. Navy and white: white
 * surfaces, a navy sidebar, navy primary actions, cool gray text, thin
 * borders and small radii. Comes with a day (light) and night (dark) theme.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  TO CHANGE THE BRAND COLOR: edit BRAND below. That's it.          │
 * │  The full 50–900 scale, buttons, links, focus rings, charts and   │
 * │  both web and mobile packages are derived from this one value.    │
 * └──────────────────────────────────────────────────────────────────┘
 */
export const BRAND = "#1F3B70"; // navy (lacivert)

// ---------------------------------------------------------------------------
// Color helpers (no dependencies, work in Node, browsers and React Native)
// ---------------------------------------------------------------------------
const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("").toUpperCase();

/** Mix `hex` with `target` by `amount` (0 = hex, 1 = target). */
export const mix = (hex: string, target: string, amount: number) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount);
};

/** `rgba()` string from a hex color. */
export const alpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export type Scale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;

const toHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};
const fromHsl = (h: number, s: number, l: number) => {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
};

/**
 * Builds a 50–900 scale from one color. The color you pass becomes 600,
 * the shade used for primary buttons, so it looks exactly like your brand.
 * Lighter shades keep the hue and saturation (clean tints, not grays).
 */
export const createScale = (hex: string): Scale => {
  const [h, sat, l] = toHsl(hex);
  const lighter = (t: number) => fromHsl(h, sat, l + (0.97 - l) * t);
  const darker = (t: number) => fromHsl(h, sat, l * (1 - t));
  return {
    50: lighter(0.97),
    100: lighter(0.9),
    200: lighter(0.76),
    300: lighter(0.58),
    400: lighter(0.38),
    500: lighter(0.18),
    600: hex.toUpperCase(),
    700: darker(0.16),
    800: darker(0.32),
    900: darker(0.5),
  };
};

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
export const palette = {
  brand: createScale(BRAND),
  /** Cool neutral gray, the backbone of the interface */
  gray: {
    0: "#FFFFFF",
    50: "#F8F9FB",
    100: "#F1F3F6",
    200: "#E4E7EC",
    300: "#CDD2DA",
    400: "#9AA3B0",
    500: "#6B7482",
    600: "#4E5664",
    700: "#363D49",
    800: "#232831",
    900: "#14171D",
  },
  green: { 50: "#EDF8F1", 100: "#D3EEDD", 500: "#2E9E5B", 600: "#22834A", 700: "#1B6A3C" },
  amber: { 50: "#FFF7E8", 100: "#FDEBC4", 500: "#D98E04", 600: "#B57503", 700: "#8F5C02" },
  red: { 50: "#FDEFEF", 100: "#F9D6D6", 500: "#D64545", 600: "#BC3333", 700: "#982828" },
  sky: { 50: "#EEF6FC", 100: "#D4E9F7", 500: "#2B86C5", 600: "#1F6FA8", 700: "#195A88" },
  white: "#FFFFFF",
  black: "#000000",
} as const;

const { brand, gray, green, amber, red, sky } = palette;

/** Semantic colors, light theme (also used by React Native). */
export const colors = {
  background: gray[100],
  surface: gray[0],
  surfaceMuted: gray[50],
  surfaceSunken: gray[100],
  surfaceInverse: gray[800],
  overlay: "rgba(20, 23, 29, 0.48)",

  border: gray[200],
  borderStrong: gray[300],

  text: gray[900],
  textSecondary: gray[600],
  textMuted: gray[500],
  textDisabled: gray[400],
  textInverse: gray[0],

  primary: brand[600],
  primaryHover: brand[700],
  primaryActive: brand[800],
  primarySoft: brand[50],
  primarySoftHover: brand[100],
  primaryText: brand[700],
  onPrimary: palette.white,
  focus: alpha(brand[500], 0.35),

  /** App shell: the navy sidebar / top header */
  nav: brand[700],
  navHover: alpha(palette.white, 0.08),
  navActive: alpha(palette.white, 0.14),
  navText: alpha(palette.white, 0.72),
  navTextActive: palette.white,
  navBorder: alpha(palette.white, 0.1),

  success: green[600],
  successSoft: green[50],
  successText: green[700],
  warning: amber[500],
  warningSoft: amber[50],
  warningText: amber[700],
  danger: red[600],
  dangerHover: red[700],
  dangerSoft: red[50],
  dangerText: red[700],
  info: sky[600],
  infoSoft: sky[50],
  infoText: sky[700],
} as const;

export type ColorToken = keyof typeof colors;

/** Same keys, night theme (web: <html data-theme="dark">, native: useColors("dark")). */
export const darkColors: Record<ColorToken, string> = {
  background: "#0A1120",
  surface: "#111A2C",
  surfaceMuted: "#152036",
  surfaceSunken: "#0D1526",
  surfaceInverse: gray[100],
  overlay: "rgba(2, 6, 16, 0.66)",
  border: "#22304A",
  borderStrong: "#30405E",
  text: "#E8EDF5",
  textSecondary: "#B3BED0",
  textMuted: "#8592A8",
  textDisabled: "#56637A",
  textInverse: gray[900],
  primary: brand[400],
  primaryHover: brand[300],
  primaryActive: brand[200],
  primarySoft: alpha(brand[300], 0.16),
  primarySoftHover: alpha(brand[300], 0.26),
  primaryText: brand[200],
  onPrimary: palette.white,
  focus: alpha(brand[300], 0.45),
  nav: "#0C1424",
  navHover: alpha(palette.white, 0.06),
  navActive: alpha(brand[300], 0.2),
  navText: "#9AA7BD",
  navTextActive: palette.white,
  navBorder: "#1C2840",
  success: green[500],
  successSoft: alpha(green[500], 0.16),
  successText: "#7FD3A0",
  warning: amber[500],
  warningSoft: alpha(amber[500], 0.16),
  warningText: "#F2C46B",
  danger: red[500],
  dangerHover: red[600],
  dangerSoft: alpha(red[500], 0.16),
  dangerText: "#F09A9A",
  info: sky[500],
  infoSoft: alpha(sky[500], 0.16),
  infoText: "#8CC6EE",
};

/** Ordered colors for charts and avatars. */
export const dataColors = [brand[600], "#2B86C5", "#0F9D8F", "#E08A1E", "#8257E6", "#D6476B"] as const;

// ---------------------------------------------------------------------------
// Type, space, shape, depth, motion
// ---------------------------------------------------------------------------
export const typography = {
  fontFamily: {
    sans: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
  },
  /** React Native font family names (load with @expo-google-fonts/inter) */
  nativeFontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 30,
    "5xl": 36,
  },
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.65 },
  letterSpacing: { tight: -0.2, normal: 0, wide: 0.4 },
} as const;

/** 4px grid */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const shadows = {
  xs: "0 1px 2px rgba(20, 23, 29, 0.06)",
  sm: "0 1px 2px rgba(20, 23, 29, 0.06), 0 1px 3px rgba(20, 23, 29, 0.08)",
  md: "0 2px 4px rgba(20, 23, 29, 0.06), 0 4px 12px rgba(20, 23, 29, 0.08)",
  lg: "0 4px 8px rgba(20, 23, 29, 0.06), 0 12px 32px rgba(20, 23, 29, 0.12)",
  xl: "0 8px 16px rgba(20, 23, 29, 0.08), 0 24px 56px rgba(20, 23, 29, 0.18)",
} as const;

/** React Native shadow equivalents */
export const nativeShadows = {
  sm: { shadowColor: "#14171D", shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md: { shadowColor: "#14171D", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  lg: { shadowColor: "#14171D", shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
} as const;

export const sizes = {
  control: { sm: 32, md: 36, lg: 44 },
  /** Touch targets on mobile */
  touch: 44,
  sidebar: 248,
  topbar: 56,
} as const;

export const zIndex = { dropdown: 1000, sticky: 1100, drawer: 1200, modal: 1300, toast: 1400, tooltip: 1500 } as const;

export const motion = {
  duration: { fast: 120, normal: 200, slow: 320, slower: 560 },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    /** Slight overshoot, for things that pop or settle (buttons, cards, menus) */
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    /** Strong ease-out for large surfaces entering the screen */
    emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  /** The same curves as numbers, for React Native's Easing.bezier(x1, y1, x2, y2). */
  bezier: {
    standard: [0.2, 0, 0, 1],
    out: [0, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
    emphasized: [0.16, 1, 0.3, 1],
  },
  /** Spring presets for React Native's Animated.spring. Low bounce on purpose. */
  spring: {
    /** Press feedback: quick, almost no overshoot */
    press: { speed: 40, bounciness: 4 },
    /** Things settling back into place */
    settle: { speed: 22, bounciness: 6 },
  },
} as const;

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export { iconPaths, type IconName } from "./icons";

export const tokens = {
  brand: BRAND,
  palette,
  colors,
  darkColors,
  dataColors,
  typography,
  spacing,
  radii,
  shadows,
  nativeShadows,
  sizes,
  zIndex,
  motion,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
export default tokens;
