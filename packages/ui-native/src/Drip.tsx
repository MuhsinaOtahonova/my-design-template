import Svg, { Path } from "react-native-svg";
import type { StyleProp, ViewStyle } from "react-native";

export interface DripProps {
  intensity?: number;
  drops?: number[];
  tone?: "light" | "dark" | "rose";
  style?: StyleProp<ViewStyle>;
}

const fills = {
  light: "rgba(255,255,255,0.32)",
  dark: "rgba(87,78,83,0.6)",
  rose: "rgba(221,160,180,0.7)",
};

export function dripPath(h: number, drops: number[]) {
  let d = "M0 0 H100 V0.5 ";
  [...drops].sort((a, b) => b - a).forEach((pos, i) => {
    const len = h * (0.55 + ((i * 37) % 45) / 100);
    const w = 4 + ((i * 13) % 4);
    // wide fillet at the top, narrow neck, round drop at the tip
    d += `L${pos + w + 6} 0.5 C${pos + w * 0.6} 0.5 ${pos + w * 0.9} ${len * 0.55} ${pos + w * 0.7} ${len - w * 0.8} A${w * 0.7} ${w * 0.8} 0 0 1 ${pos - w * 0.7} ${len - w * 0.8} C${pos - w * 0.9} ${len * 0.55} ${pos - w * 0.6} 0.5 ${pos - w - 6} 0.5 `;
  });
  return d + "L0 0.5 Z";
}

/** The melting edge, placed under a glass surface */
export function Drip({ intensity = 0.6, drops = [18, 62, 84], tone = "light", style }: DripProps) {
  const h = 10 + intensity * 30;
  return (
    <Svg
      pointerEvents="none"
      viewBox={`0 0 100 ${h}`}
      preserveAspectRatio="none"
      style={[{ position: "absolute", left: "8%", width: "84%", top: "100%", marginTop: -1, height: h }, style]}
    >
      <Path d={dripPath(h, drops)} fill={fills[tone]} />
    </Svg>
  );
}
