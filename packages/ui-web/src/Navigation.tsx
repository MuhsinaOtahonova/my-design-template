import { useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
export interface TabItem<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: IconName;
  count?: number;
  disabled?: boolean;
}

export function Tabs<T extends string>({
  items,
  value,
  defaultValue,
  onChange,
  variant = "line",
  children,
}: {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (v: T) => void;
  /** line: underline (pages) · pills: rounded (filters) · enclosed: boxed (panels) */
  variant?: "line" | "pills" | "enclosed";
  /** Render function for the active panel */
  children?: (active: T) => ReactNode;
}) {
  const [inner, setInner] = useState<T>(defaultValue ?? items[0]!.value);
  const active = value ?? inner;
  return (
    <div className="md-tabs">
      <div role="tablist" className={cx("md-tabs__list", `md-tabs__list--${variant}`)}>
        {items.map((t) => (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active === t.value}
            disabled={t.disabled}
            className="md-tabs__tab"
            onClick={() => (setInner(t.value), onChange?.(t.value))}
          >
            {t.icon && <Icon name={t.icon} size={16} />}
            {t.label}
            {t.count != null && <span className="md-tabs__count">{t.count}</span>}
          </button>
        ))}
      </div>
      {children && <div role="tabpanel" className="md-tabs__panel">{children(active)}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
export function Breadcrumbs({ items }: { items: Array<{ label: ReactNode; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="md-breadcrumbs">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !it.href ? <span aria-current={last ? "page" : undefined}>{it.label}</span> : <a href={it.href}>{it.label}</a>}
              {!last && <Icon name="chevronRight" size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
function pages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function Pagination({ page, total, onChange, summary }: { page: number; total: number; onChange: (p: number) => void; summary?: ReactNode }) {
  return (
    <nav className="md-pagination" aria-label="Pagination">
      {summary && <span className="md-pagination__summary">{summary}</span>}
      <div className="md-pagination__pages">
        <button type="button" className="md-pagination__btn" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <Icon name="chevronLeft" size={16} />
        </button>
        {pages(page, total).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="md-pagination__ellipsis">…</span>
          ) : (
            <button key={p} type="button" aria-current={p === page ? "page" : undefined} className="md-pagination__btn" onClick={() => onChange(p)}>
              {p}
            </button>
          ),
        )}
        <button type="button" className="md-pagination__btn" aria-label="Next page" disabled={page >= total} onClick={() => onChange(page + 1)}>
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Steps (wizard progress)
// ---------------------------------------------------------------------------
export function Steps({ steps, current, orientation = "horizontal" }: { steps: Array<{ title: ReactNode; description?: ReactNode }>; current: number; orientation?: "horizontal" | "vertical" }) {
  return (
    <ol className={cx("md-steps", `md-steps--${orientation}`)}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={i} className={cx("md-steps__step", `md-steps__step--${state}`)} aria-current={state === "current" ? "step" : undefined}>
            <span className="md-steps__marker">{state === "done" ? <Icon name="check" size={14} strokeWidth={2.5} /> : i + 1}</span>
            <span className="md-steps__text">
              <span className="md-steps__title">{s.title}</span>
              {s.description && <span className="md-steps__desc">{s.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------
export function Accordion({ items, multiple, defaultOpen = [] }: { items: Array<{ title: ReactNode; content: ReactNode; id?: string }>; multiple?: boolean; defaultOpen?: number[] }) {
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  return (
    <div className="md-accordion">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={it.id ?? i} className={cx("md-accordion__item", isOpen && "md-accordion__item--open")}>
            <button type="button" className="md-accordion__trigger" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span>{it.title}</span>
              <Icon name="chevronDown" size={18} />
            </button>
            {isOpen && <div className="md-accordion__content">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// App shell: Sidebar, NavItem, Topbar, BottomNav
// ---------------------------------------------------------------------------
export function Sidebar({ header, footer, children, collapsed, className }: { header?: ReactNode; footer?: ReactNode; children: ReactNode; collapsed?: boolean; className?: string }) {
  return (
    <aside className={cx("md-sidebar", collapsed && "md-sidebar--collapsed", className)}>
      {header && <div className="md-sidebar__header">{header}</div>}
      <nav className="md-sidebar__nav">{children}</nav>
      {footer && <div className="md-sidebar__footer">{footer}</div>}
    </aside>
  );
}

export function NavSection({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="md-navsection">
      {title && <div className="md-navsection__title">{title}</div>}
      <ul>{children}</ul>
    </div>
  );
}

export function NavItem({ icon, label, active, count, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { icon?: IconName; label: ReactNode; active?: boolean; count?: number }) {
  return (
    <li>
      <a className={cx("md-navitem", active && "md-navitem--active", className)} aria-current={active ? "page" : undefined} {...rest}>
        {icon && <Icon name={icon} size={18} />}
        <span className="md-navitem__label">{label}</span>
        {count != null && <span className="md-navitem__count">{count}</span>}
      </a>
    </li>
  );
}

export function Topbar({ left, center, right, className }: { left?: ReactNode; center?: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <header className={cx("md-topbar", className)}>
      <div className="md-topbar__left">{left}</div>
      {center && <div className="md-topbar__center">{center}</div>}
      <div className="md-topbar__right">{right}</div>
    </header>
  );
}

/** Tab bar at the bottom of small screens (mobile web). */
export function BottomNav<T extends string>({ items, value, onChange }: { items: Array<{ value: T; label: string; icon: IconName; badge?: number }>; value: T; onChange: (v: T) => void }) {
  return (
    <nav className="md-bottomnav">
      {items.map((it) => (
        <button key={it.value} type="button" aria-current={value === it.value ? "page" : undefined} onClick={() => onChange(it.value)}>
          <span className="md-bottomnav__icon">
            <Icon name={it.icon} size={22} />
            {it.badge ? <span className="md-btn__badge">{it.badge}</span> : null}
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

/** Brand mark: a square with initials + product name. */
export function Logo({ name = "My Design", short = "MD", collapsed }: { name?: string; short?: string; collapsed?: boolean }) {
  return (
    <span className="md-logo">
      <span className="md-logo__mark">{short}</span>
      {!collapsed && <span className="md-logo__name">{name}</span>}
    </span>
  );
}
