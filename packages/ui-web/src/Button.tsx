import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, PointerEvent, ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { Spinner } from "./Feedback";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link" | "elevated";
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

/** Ink ripple from the pointer position. Lives in a clipped layer so badges and focus rings are not cut off. */
export function addRipple(e: PointerEvent<HTMLElement>) {
  const host = e.currentTarget.querySelector<HTMLElement>(":scope > .md-btn__fx");
  if (!host || e.button !== 0) return;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const r = host.getBoundingClientRect();
  const d = Math.max(r.width, r.height) * 2.2;
  const dot = document.createElement("span");
  dot.className = "md-ripple";
  dot.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  host.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove());
}

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
  onPointerDown,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, fullWidth && "md-btn--full", className)}
      onPointerDown={(e) => (variant !== "link" && addRipple(e), onPointerDown?.(e))}
      {...rest}
    >
      <span className="md-btn__fx" aria-hidden />
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
    <a className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, className)} onPointerDown={addRipple} {...rest}>
      <span className="md-btn__fx" aria-hidden />
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

export function IconButton({ icon, label, variant = "ghost", size = "md", badge, className, type = "button", onPointerDown, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx("md-btn", "md-btn--icon", `md-btn--${variant}`, `md-btn--${size}`, className)}
      onPointerDown={(e) => (addRipple(e), onPointerDown?.(e))}
      {...rest}
    >
      <span className="md-btn__fx" aria-hidden />
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
