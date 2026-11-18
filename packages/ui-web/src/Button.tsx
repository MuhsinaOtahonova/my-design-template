import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { Drip } from "./Drip";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "glass" | "solid" | "ghost";
  size?: "sm" | "md" | "lg";
  /** A circular icon bubble on the left, like the "Destinations" chips */
  icon?: ReactNode;
  drip?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "glass",
  size = "md",
  icon,
  drip = false,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "md-btn",
        `md-btn--${variant}`,
        `md-btn--${size}`,
        icon != null && "md-btn--with-icon",
        fullWidth && "md-btn--full",
        drip && "md-has-drip",
        className,
      )}
      {...rest}
    >
      {icon != null && <span className="md-btn__icon">{icon}</span>}
      <span className="md-btn__label">{children}</span>
      {drip && <Drip tone={variant === "solid" ? "rose" : "light"} intensity={0.35} drops={[30, 72]} />}
    </button>
  );
}
