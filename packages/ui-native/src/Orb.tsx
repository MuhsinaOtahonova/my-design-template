import { View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/** Decorative 3D sphere */
export function Orb({ size = 64, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View pointerEvents="none" style={[{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" }, style]}>
      <LinearGradient
        colors={["#FFFFFF", "rgba(235,196,208,0.55)", "rgba(156,128,194,0.45)"]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.9, y: 1 }}
        style={{ flex: 1 }}
      />
      <View style={{ position: "absolute", top: size * 0.14, left: size * 0.2, width: size * 0.28, height: size * 0.18, borderRadius: size, backgroundColor: "rgba(255,255,255,0.85)" }} />
    </View>
  );
}
