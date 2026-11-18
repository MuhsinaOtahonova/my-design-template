/**
 * My Design — design tokens
 *
 * Mood: frosted glass floating over a pink desert dusk. Dusty rose,
 * lavender and sand, soft 3D depth, liquid "melting" edges, pill buttons,
 * thin uppercase headings.
 *
 * Change values here and every web and mobile package picks them up.
 */

export const palette = {
  rose: {
    50: "#FBF3F5",
    100: "#F5E1E7",
    200: "#EBC4D0",
    300: "#DDA0B4",
    400: "#CC7E98",
    500: "#B8627F",
    600: "#9A4C67",
    700: "#7A3B51",
  },
  lavender: {
    50: "#F6F3FA",
    100: "#EAE3F3",
    200: "#D6C8E8",
    300: "#BBA5D7",
    400: "#9C80C2",
    500: "#7F60A8",
    600: "#644A87",
  },
  sand: {
    50: "#FBF8F4",
    100: "#F3ECE3",
    200: "#E7DACB",
    300: "#D6C2AC",
    400: "#BFA488",
    500: "#A0846A",
  },
  smoke: {
    // the dark tinted glass of the panels
    100: "#8A7F84",
    200: "#6F656A",
    300: "#574E53",
    400: "#40393D",
    500: "#2B2629",
  },
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const colors = {
  background: palette.sand[100],
  backgroundAccent: palette.rose[100],
  surface: "rgba(255, 255, 255, 0.18)",
  surfaceStrong: "rgba(255, 255, 255, 0.32)",
  surfaceDark: "rgba(64, 57, 61, 0.42)",
  border: "rgba(255, 255, 255, 0.45)",
  borderSubtle: "rgba(255, 255, 255, 0.22)",
  text: palette.white,
  textOnLight: palette.smoke[400],
  textMuted: "rgba(255, 255, 255, 0.72)",
  primary: palette.rose[300],
  primaryStrong: palette.rose[500],
  secondary: palette.lavender[300],
  accent: palette.sand[300],
  glow: "rgba(235, 196, 208, 0.65)",
  success: "#8FBFA3",
  warning: "#E3B47A",
  danger: "#D9788A",
} as const;

/** Page backgrounds: soft dusk sky melting into sand */
export const gradients = {
  dusk: `linear-gradient(180deg, ${palette.rose[200]} 0%, ${palette.lavender[100]} 45%, ${palette.sand[200]} 100%)`,
  glass:
    "linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.06) 100%)",
  glassDark:
    "linear-gradient(160deg, rgba(120,108,114,0.55) 0%, rgba(64,57,61,0.45) 100%)",
  rose: `linear-gradient(90deg, ${palette.rose[200]} 0%, ${palette.rose[400]} 100%)`,
  orb: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, rgba(255,255,255,0.6) 12%, rgba(235,196,208,0.35) 45%, rgba(156,128,194,0.35) 75%, rgba(255,255,255,0.15) 100%)",
} as const;

export const typography = {
  fontFamily: {
    display: "'Jost', 'Futura', 'Avenir Next', system-ui, sans-serif",
    body: "'Jost', 'Avenir Next', system-ui, sans-serif",
  },
  /** React Native font family names (load with expo-font / @expo-google-fonts/jost) */
  nativeFontFamily: {
    light: "Jost_300Light",
    regular: "Jost_400Regular",
    medium: "Jost_500Medium",
  },
  fontWeight: { light: 300, regular: 400, medium: 500, semibold: 600 },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    "2xl": 40,
    "3xl": 56,
  },
  lineHeight: { tight: 1.1, normal: 1.45, relaxed: 1.65 },
  letterSpacing: { tight: -0.2, normal: 0, wide: 1.5, display: 2.5 },
} as const;

/** 4px grid */
export const spacing = {
  0: 0,
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
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

/** Glass material */
export const glass = {
  blur: 18,
  saturate: 1.4,
  borderWidth: 1,
} as const;

/** Soft 3D depth: layered shadows from close contact to far ambient */
export const shadows = {
  sm: "0 1px 2px rgba(64,57,61,0.10), 0 4px 10px rgba(64,57,61,0.08)",
  md: "0 2px 4px rgba(64,57,61,0.10), 0 12px 28px rgba(122,59,81,0.16)",
  lg: "0 4px 8px rgba(64,57,61,0.10), 0 24px 60px rgba(122,59,81,0.22)",
  glow: "0 0 24px rgba(235,196,208,0.75)",
  /** top highlight + bottom inner shade that make glass look thick */
  innerGlass:
    "inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -10px 24px rgba(64,57,61,0.12)",
} as const;

/** React Native shadow equivalents */
export const nativeShadows = {
  sm: { shadowColor: "#40393D", shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  md: { shadowColor: "#7A3B51", shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  lg: { shadowColor: "#7A3B51", shadowOpacity: 0.24, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 16 },
} as const;

export const motion = {
  duration: { fast: 150, normal: 260, slow: 480 },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    liquid: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export const tokens = {
  palette,
  colors,
  gradients,
  typography,
  spacing,
  radii,
  glass,
  shadows,
  nativeShadows,
  motion,
} as const;

export type Tokens = typeof tokens;
export default tokens;
