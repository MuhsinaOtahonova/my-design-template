import type { CSSProperties } from "react";
import { cx } from "./cx";

export interface OrbProps {
  size?: number;
  /** pearl = milky, bubble = clear soap bubble, rose = tinted */
  variant?: "bubble" | "pearl" | "rose";
  float?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Decorative 3D sphere for backgrounds and hero sections */
export function Orb({ size = 64, variant = "bubble", float = true, className, style }: OrbProps) {
  return (
    <span
      aria-hidden
      className={cx("md-orb", `md-orb--${variant}`, float && "md-orb--float", className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}
