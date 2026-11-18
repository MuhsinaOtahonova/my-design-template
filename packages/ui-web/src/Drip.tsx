import type { CSSProperties } from "react";
import { cx } from "./cx";

export interface DripProps {
  /** 0–1: how far the liquid hangs down */
  intensity?: number;
  /** Where the drops fall, 0–100 along the edge */
  drops?: number[];
  tone?: "light" | "dark" | "rose";
  className?: string;
  style?: CSSProperties;
}

const fills = {
  light: "rgba(255,255,255,0.30)",
  dark: "rgba(87,78,83,0.55)",
  rose: "rgba(221,160,180,0.65)",
};

/**
 * The "melting" edge. Sits under the bottom edge of a glass surface and
 * looks like the material is dripping off it.
 */
export function Drip({ intensity = 0.6, drops = [18, 62, 84], tone = "light", className, style }: DripProps) {
  const h = 10 + intensity * 30;
  // Build a liquid edge: flat line with rounded drops hanging from it
  let d = "M0 0 H100 V0.5 ";
  const sorted = [...drops].sort((a, b) => b - a);
  sorted.forEach((pos, i) => {
    const len = h * (0.55 + ((i * 37) % 45) / 100);
    const w = 4 + ((i * 13) % 4);
    // wide fillet at the top, narrow neck, round drop at the tip
    d += `L${pos + w + 6} 0.5 C${pos + w * 0.6} 0.5 ${pos + w * 0.9} ${len * 0.55} ${pos + w * 0.7} ${len - w * 0.8} A${w * 0.7} ${w * 0.8} 0 0 1 ${pos - w * 0.7} ${len - w * 0.8} C${pos - w * 0.9} ${len * 0.55} ${pos - w * 0.6} 0.5 ${pos - w - 6} 0.5 `;
  });
  d += `L0 0.5 Z`;
  return (
    <svg
      className={cx("md-drip", className)}
      style={{ height: h, ...style }}
      viewBox={`0 0 100 ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`md-drip-shine-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path d={d} fill={fills[tone]} />
      <path d={d} fill={`url(#md-drip-shine-${tone})`} />
    </svg>
  );
}
