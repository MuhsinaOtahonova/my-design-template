import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { palette, radii, spacing } from "@my-design/tokens";
import { Text } from "./Typography";

export function Progress({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={{ gap: spacing[2] }}>
      {label && <Text muted style={{ fontSize: 12 }}>{label}</Text>}
      <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max, now: value }}>
        <LinearGradient
          colors={[palette.rose[200], palette.rose[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: radii.pill, backgroundColor: "rgba(43,38,41,0.35)", overflow: "hidden" },
  fill: { height: "100%", borderRadius: radii.pill, shadowColor: palette.rose[200], shadowOpacity: 0.9, shadowRadius: 8 },
});
