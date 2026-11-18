import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { nativeShadows, radii, spacing } from "@my-design/tokens";
import { Drip } from "./Drip";

export interface GlassPanelProps {
  tone?: "light" | "dark";
  elevation?: "sm" | "md" | "lg";
  drip?: boolean;
  padding?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function GlassPanel({ tone = "light", elevation = "md", drip = false, padding = 6, style, children }: GlassPanelProps) {
  return (
    <View style={[styles.outer, nativeShadows[elevation], style]}>
      <View style={styles.clip}>
        <BlurView intensity={tone === "light" ? 40 : 30} tint={tone === "light" ? "light" : "dark"} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={
            tone === "light"
              ? ["rgba(255,255,255,0.40)", "rgba(255,255,255,0.10)"]
              : ["rgba(120,108,114,0.55)", "rgba(64,57,61,0.45)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.border, tone === "dark" && styles.borderDark]} />
        <View style={{ padding: spacing[padding] }}>{children}</View>
      </View>
      {drip && <Drip tone={tone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { borderRadius: radii.xl },
  clip: { borderRadius: radii.xl, overflow: "hidden" },
  border: {
    position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    borderTopColor: "rgba(255,255,255,0.8)",
  },
  borderDark: { borderColor: "rgba(255,255,255,0.22)", borderTopColor: "rgba(255,255,255,0.45)" },
});
