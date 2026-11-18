import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { Drip, type DripProps } from "./Drip";

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** light = clear frosted glass, dark = smoky tinted glass */
  tone?: "light" | "dark";
  /** Lift: how far it floats off the background */
  elevation?: "sm" | "md" | "lg";
  /** Tilts slightly in 3D on hover */
  tilt?: boolean;
  /** Adds the melting edge at the bottom */
  drip?: boolean | Pick<DripProps, "intensity" | "drops">;
  padding?: "none" | "sm" | "md" | "lg";
  children?: ReactNode;
}

export function GlassPanel({
  tone = "light",
  elevation = "md",
  tilt = false,
  drip = false,
  padding = "md",
  className,
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={cx(
        "md-glass",
        `md-glass--${tone}`,
        `md-elev-${elevation}`,
        `md-pad-${padding}`,
        tilt && "md-tilt",
        drip && "md-has-drip",
        className,
      )}
      {...rest}
    >
      {children}
      {drip && <Drip tone={tone} {...(typeof drip === "object" ? drip : {})} />}
    </div>
  );
}
