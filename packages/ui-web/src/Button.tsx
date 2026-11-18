import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { Spinner } from "./Feedback";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Icon before the label */
  icon?: IconName;
  /** Icon after the label */
  iconRight?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
}

const iconSize = { sm: 15, md: 16, lg: 18 };

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, fullWidth && "md-btn--full", className)}
      {...rest}
    >
      {loading ? <Spinner size={iconSize[size]} /> : icon && <Icon name={icon} size={iconSize[size]} />}
      {children != null && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize[size]} />}
    </button>
  );
}

/** Same look as Button, rendered as a link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant; size?: ControlSize; icon?: IconName }) {
  return (
    <a className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, className)} {...rest}>
      {icon && <Icon name={icon} size={iconSize[size]} />}
      <span>{children}</span>
    </a>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required: describes the action for screen readers and the tooltip */
  label: string;
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Small dot or number in the corner, e.g. unread notifications */
  badge?: number | boolean;
}

export function IconButton({ icon, label, variant = "ghost", size = "md", badge, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx("md-btn", "md-btn--icon", `md-btn--${variant}`, `md-btn--${size}`, className)}
      {...rest}
    >
      <Icon name={icon} size={iconSize[size] + 2} />
      {badge != null && badge !== false && (
        <span className={cx("md-btn__badge", badge === true && "md-btn__badge--dot")}>{badge === true ? "" : badge > 99 ? "99+" : badge}</span>
      )}
    </button>
  );
}

/** Joins buttons into one segmented row. */
export function ButtonGroup({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div role="group" className={cx("md-btn-group", className)} {...rest}>
      {children}
    </div>
  );
}
