import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { IconName } from "@my-design/tokens";
import { font, fs, r, sh, themed, useColors, type Colors } from "./theme";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps {
  children?: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const heights = { sm: 36, md: 44, lg: 52 };
const pads = { sm: 12, md: 16, lg: 20 };
const text = { sm: fs.sm, md: fs.md + 1, lg: fs.lg };

const lookFor = (c: Colors): Record<ButtonVariant, { bg: string; pressed: string; fg: string; border?: string }> => ({
  primary: { bg: c.primary, pressed: c.primaryHover, fg: c.onPrimary },
  secondary: { bg: c.primarySoft, pressed: c.primarySoftHover, fg: c.primaryText },
  outline: { bg: c.surface, pressed: c.surfaceSunken, fg: c.text, border: c.borderStrong },
  ghost: { bg: "transparent", pressed: c.surfaceSunken, fg: c.textSecondary },
  danger: { bg: c.danger, pressed: c.dangerHover, fg: "#FFFFFF" },
});

export function Button({ children, onPress, variant = "primary", size = "md", icon, iconRight, loading, disabled, fullWidth, style }: ButtonProps) {
  const c = useColors();
  const styles = useStyles();
  const l = lookFor(c)[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        { height: heights[size], paddingHorizontal: pads[size], backgroundColor: pressed ? l.pressed : l.bg, opacity: disabled ? 0.5 : 1 },
        l.border && { borderWidth: 1, borderColor: l.border },
        variant === "primary" && sh.sm,
        fullWidth ? { alignSelf: "stretch" } : { alignSelf: "flex-start" },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={l.fg} /> : icon && <Icon name={icon} size={text[size] + 3} color={l.fg} />}
      {children != null && <Text style={[styles.label, { color: l.fg, fontSize: text[size] }]}>{children}</Text>}
      {iconRight && !loading && <Icon name={iconRight} size={text[size] + 3} color={l.fg} />}
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, variant = "ghost", size = 40, badge }: { icon: IconName; label: string; onPress?: () => void; variant?: ButtonVariant; size?: number; badge?: number | boolean }) {
  const c = useColors();
  const styles = useStyles();
  const l = lookFor(c)[variant];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.icon, { width: size, height: size, backgroundColor: pressed ? l.pressed : l.bg }, l.border && { borderWidth: 1, borderColor: l.border }]}
    >
      <Icon name={icon} size={size * 0.52} color={variant === "ghost" ? c.text : l.fg} />
      {badge != null && badge !== false && (
        <View style={[styles.badge, badge === true && styles.dot]}>{badge !== true && <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>}</View>
      )}
    </Pressable>
  );
}

const useStyles = themed((c) => StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: r.md },
  label: { fontFamily: font.semibold },
  icon: { alignItems: "center", justifyContent: "center", borderRadius: r.md },
  badge: { position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: c.danger, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: c.surface },
  dot: { minWidth: 10, width: 10, height: 10, top: 6, right: 6, paddingHorizontal: 0 },
  badgeText: { color: "#fff", fontSize: 9, fontFamily: font.bold },
}));
