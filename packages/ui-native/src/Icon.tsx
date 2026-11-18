import Svg, { Path } from "react-native-svg";
import { iconPaths, type IconName } from "@my-design/tokens";
import { useColors } from "./theme";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Same line icons as the web package (shared path data in @my-design/tokens). */
export function Icon({ name, size = 20, color, strokeWidth = 1.75 }: IconProps) {
  const c = useColors();
  color ??= c.textSecondary;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name].map((d, i) => (
        <Path key={i} d={d} />
      ))}
    </Svg>
  );
}
