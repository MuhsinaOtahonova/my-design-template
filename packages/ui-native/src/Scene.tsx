import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { palette } from "@my-design/tokens";

/** Dusk-to-sand screen background */
export function Scene({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient colors={[palette.rose[200], palette.lavender[100], palette.sand[200]]} locations={[0, 0.45, 1]} style={[StyleSheet.absoluteFill, style]}>
      {children}
    </LinearGradient>
  );
}
