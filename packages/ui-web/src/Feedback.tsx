import { createContext, useCallback, useContext, useState, type CSSProperties, type ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";

export type FeedbackTone = "info" | "success" | "warning" | "danger";
const toneIcon: Record<FeedbackTone, IconName> = { info: "info", success: "checkCircle", warning: "alert", danger: "xCircle" };

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export function Alert({
  tone = "info",
  title,
  children,
  onClose,
  action,
  variant = "soft",
  className,
}: {
  tone?: FeedbackTone;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
  /** "banner" spans the full width with no radius, for the top of a page */
  variant?: "soft" | "outline" | "banner";
  className?: string;
}) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("md-alert", `md-alert--${tone}`, `md-alert--${variant}`, className)}>
      <Icon name={toneIcon[tone]} size={18} className="md-alert__icon" />
      <div className="md-alert__content">
        {title && <div className="md-alert__title">{title}</div>}
        {children && <div className="md-alert__text">{children}</div>}
        {action && <div className="md-alert__action">{action}</div>}
      </div>
      {onClose && (
        <button type="button" className="md-alert__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress, Spinner, Skeleton
// ---------------------------------------------------------------------------
export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  tone = "primary",
  size = "md",
  indeterminate,
}: {
  value?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  tone?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100));
  return (
    <div className="md-progress">
      {(label || showValue) && !indeterminate && (
        <div className="md-progress__top">
          {label && <span>{label}</span>}
          {showValue && <span className="md-progress__value">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={cx("md-progress__track", `md-progress__track--${size}`, indeterminate && "md-progress__track--indeterminate")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
      >
        <div className={cx("md-progress__fill", `md-progress__fill--${tone}`)} style={indeterminate ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CircularProgress({ value, size = 56, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="md-ring" style={{ width: size, height: size }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="md-ring__track" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="md-ring__fill" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="md-ring__label">{label ?? `${Math.round(value)}%`}</span>
    </div>
  );
}

export function Spinner({ size = 18, label = "Loading" }: { size?: number; label?: string }) {
  return <span className="md-spinner" role="status" aria-label={label} style={{ width: size, height: size }} />;
}

export function Skeleton({ width = "100%", height = 14, radius, circle, className, style }: { width?: CSSProperties["width"]; height?: CSSProperties["height"]; radius?: number; circle?: boolean; className?: string; style?: CSSProperties }) {
  return <span className={cx("md-skeleton", className)} aria-hidden style={{ width, height: circle ? width : height, borderRadius: circle ? "50%" : radius, ...style }} />;
}

// ---------------------------------------------------------------------------
// Tooltip (CSS only, shows on hover and keyboard focus)
// ---------------------------------------------------------------------------
export function Tooltip({ content, side = "top", children }: { content: ReactNode; side?: "top" | "bottom" | "left" | "right"; children: ReactNode }) {
  return (
    <span className={cx("md-tooltip", `md-tooltip--${side}`)}>
      {children}
      <span role="tooltip" className="md-tooltip__bubble">{content}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Toasts: wrap the app in <ToastProvider>, then const toast = useToast()
// ---------------------------------------------------------------------------
interface ToastItem {
  id: number;
  tone: FeedbackTone;
  title: ReactNode;
  description?: ReactNode;
}
type ToastFn = (t: Omit<ToastItem, "id" | "tone"> & { tone?: FeedbackTone; duration?: number }) => void;

const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children, position = "bottom-right" }: { children: ReactNode; position?: "top-right" | "bottom-right" | "bottom-center" }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = (id: number) => setItems((all) => all.filter((t) => t.id !== id));
  const push = useCallback<ToastFn>(({ tone = "info", duration = 4000, ...t }) => {
    const id = Date.now() + Math.random();
    setItems((all) => [...all, { id, tone, ...t }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className={cx("md-toasts", `md-toasts--${position}`)} aria-live="polite">
        {items.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title} description={t.description} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/** A single toast, also usable on its own. */
export function Toast({ tone = "info", title, description, onClose }: { tone?: FeedbackTone; title: ReactNode; description?: ReactNode; onClose?: () => void }) {
  return (
    <div className={cx("md-toast", `md-toast--${tone}`)} role="status">
      <Icon name={toneIcon[tone]} size={18} className="md-toast__icon" />
      <div className="md-toast__body">
        <div className="md-toast__title">{title}</div>
        {description && <div className="md-toast__desc">{description}</div>}
      </div>
      {onClose && (
        <button type="button" className="md-alert__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
