import type { SVGProps } from "react";
import { iconPaths, type IconName } from "@my-design/tokens";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  label?: string;
}

/** Line icon from the shared set in @my-design/tokens (see `iconPaths`). */
export function Icon({ name, size = 18, strokeWidth = 1.75, label, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className="md-icon"
      {...rest}
    >
      {iconPaths[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export const iconNames = Object.keys(iconPaths) as IconName[];
