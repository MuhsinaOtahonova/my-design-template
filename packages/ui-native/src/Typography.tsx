import { StyleSheet, Text as RNText, type TextProps } from "react-native";
import { colors, typography } from "@my-design/tokens";

export function Heading({ level = 1, style, children, ...rest }: TextProps & { level?: 1 | 2 | 3 }) {
  const display = level <= 2;
  return (
    <RNText
      accessibilityRole="header"
      style={[styles.heading, styles[`h${level}`], display && styles.display, style]}
      {...rest}
    >
      {display && typeof children === "string" ? children.toUpperCase() : children}
    </RNText>
  );
}

export function Text({ muted, style, ...rest }: TextProps & { muted?: boolean }) {
  return <RNText style={[styles.text, muted && styles.muted, style]} {...rest} />;
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontFamily: typography.nativeFontFamily.regular },
  display: { fontFamily: typography.nativeFontFamily.light, letterSpacing: typography.letterSpacing.display },
  h1: { fontSize: typography.fontSize["2xl"], lineHeight: typography.fontSize["2xl"] * 1.1 },
  h2: { fontSize: typography.fontSize.xl, lineHeight: typography.fontSize.xl * 1.15 },
  h3: { fontSize: typography.fontSize.lg },
  text: { color: colors.text, fontSize: typography.fontSize.md, lineHeight: 24, fontFamily: typography.nativeFontFamily.light },
  muted: { color: colors.textMuted },
});
