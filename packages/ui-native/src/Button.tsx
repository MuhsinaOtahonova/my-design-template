import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, nativeShadows, palette, radii, spacing, typography } from "@my-design/tokens";
import { Drip } from "./Drip";

export interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "glass" | "solid" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  drip?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const heights = { sm: 32, md: 44, lg: 56 };
const fontSizes = { sm: typography.fontSize.sm, md: typography.fontSize.md, lg: typography.fontSize.lg };

export function Button({ children, onPress, variant = "glass", size = "md", icon, drip, disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { minHeight: heights[size], opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        variant !== "ghost" && nativeShadows.sm,
        style,
      ]}
    >
      <View style={[styles.clip, { paddingLeft: icon ? spacing[1] : spacing[6] }]}>
        {variant === "glass" && <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />}
        {variant === "glass" && (
          <LinearGradient colors={["rgba(255,255,255,0.40)", "rgba(255,255,255,0.10)"]} style={StyleSheet.absoluteFill} />
        )}
        {variant === "solid" && <LinearGradient colors={[palette.rose[300], palette.rose[500]]} style={StyleSheet.absoluteFill} />}
        {icon && (
          <LinearGradient colors={[palette.rose[200], palette.rose[400]]} style={[styles.icon, { width: heights[size] - 8, height: heights[size] - 8 }]}>
            {icon}
          </LinearGradient>
        )}
        <Text style={[styles.label, { fontSize: fontSizes[size] }]}>{children}</Text>
      </View>
      {drip && <Drip tone={variant === "solid" ? "rose" : "light"} intensity={0.35} drops={[30, 72]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.pill, alignSelf: "flex-start" },
  clip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingRight: spacing[6],
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    flexGrow: 1,
  },
  icon: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  label: { color: colors.text, fontFamily: typography.nativeFontFamily.regular },
});
