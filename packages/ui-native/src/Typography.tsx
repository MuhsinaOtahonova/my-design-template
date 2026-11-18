import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from "react-native";
import { font, fs, themed, useColors, type Colors } from "./theme";

export function Heading({ level = 2, style, ...rest }: RNTextProps & { level?: 1 | 2 | 3 | 4 }) {
  const c = useColors();
  const styles = useStyles();
  return <RNText accessibilityRole="header" style={[styles.heading, styles[`h${level}`], style]} {...rest} />;
}

export interface TextProps extends RNTextProps {
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "default" | "secondary" | "muted" | "primary" | "success" | "warning" | "danger" | "inverse";
  weight?: "regular" | "medium" | "semibold" | "bold";
}

const toneColorFor = (c: Colors) => ({
  default: c.text,
  secondary: c.textSecondary,
  muted: c.textMuted,
  primary: c.primaryText,
  success: c.successText,
  warning: c.warningText,
  danger: c.dangerText,
  inverse: c.textInverse,
});
const sizePx = { xs: fs.xs, sm: fs.sm, md: fs.md + 1, lg: fs.lg };

export function Text({ size = "md", tone = "default", weight = "regular", style, ...rest }: TextProps) {
  const c = useColors();
  const styles = useStyles();
  return <RNText style={[{ color: toneColorFor(c)[tone], fontSize: sizePx[size], lineHeight: Math.round(sizePx[size] * 1.45), fontFamily: font[weight] }, style]} {...rest} />;
}

/** Small uppercase section label */
export function Overline({ style, ...rest }: RNTextProps) {
  const c = useColors();
  const styles = useStyles();
  return <RNText style={[styles.overline, style]} {...rest} />;
}

const useStyles = themed((c) => StyleSheet.create({
  heading: { color: c.text, fontFamily: font.semibold, letterSpacing: -0.2 },
  h1: { fontSize: fs["4xl"], lineHeight: 38, fontFamily: font.bold, letterSpacing: -0.5 },
  h2: { fontSize: fs["3xl"], lineHeight: 30 },
  h3: { fontSize: fs["2xl"], lineHeight: 26 },
  h4: { fontSize: fs.lg + 1, lineHeight: 22 },
  overline: { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: c.textMuted, fontFamily: font.semibold },
}));
