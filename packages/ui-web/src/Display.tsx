import type { HTMLAttributes, ReactNode } from "react";
import { dataColors, type IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "outlined" | "elevated" | "muted";
  padding?: "none" | "sm" | "md" | "lg";
  /** Hover effect + pointer, for cards that are links */
  interactive?: boolean;
  selected?: boolean;
}

export function Card({ variant = "outlined", padding = "md", interactive, selected, className, ...rest }: CardProps) {
  return (
    <div
      className={cx("md-card", `md-card--${variant}`, `md-pad--${padding}`, interactive && "md-card--interactive", selected && "md-card--selected", className)}
      {...rest}
    />
  );
}

export function CardHeader({ title, subtitle, actions, icon, className }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; icon?: IconName; className?: string }) {
  return (
    <div className={cx("md-card__header", className)}>
      {icon && <span className="md-card__icon"><Icon name={icon} size={18} /></span>}
      <div className="md-card__titles">
        <h3 className="md-card__title">{title}</h3>
        {subtitle && <p className="md-card__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="md-card__actions">{actions}</div>}
    </div>
  );
}

export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cx("md-card__body", className)} {...rest} />;
export const CardFooter = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cx("md-card__footer", className)} {...rest} />;

/** Card with an image or colored area on top (articles, products, projects). */
export function MediaCard({ image, title, description, meta, footer, className }: { image?: string; title: ReactNode; description?: ReactNode; meta?: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <Card padding="none" interactive className={cx("md-media-card", className)}>
      <div className="md-media-card__media" style={image ? { backgroundImage: `url(${image})` } : undefined} />
      <div className="md-media-card__body">
        {meta && <span className="md-overline">{meta}</span>}
        <h3 className="md-card__title">{title}</h3>
        {description && <p className="md-card__subtitle">{description}</p>}
      </div>
      {footer && <div className="md-card__footer">{footer}</div>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Badge & Tag
// ---------------------------------------------------------------------------
export type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export function Badge({ tone = "neutral", variant = "soft", dot, icon, className, children }: { tone?: Tone; variant?: "soft" | "solid" | "outline"; dot?: boolean; icon?: IconName; className?: string; children: ReactNode }) {
  return (
    <span className={cx("md-badge", `md-badge--${tone}`, `md-badge--${variant}`, className)}>
      {dot && <span className="md-badge__dot" />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

/** Status pill for workflow states: Draft, In review, Approved… */
export function StatusBadge({ status }: { status: "active" | "pending" | "approved" | "rejected" | "draft" | "inactive" | "overdue" }) {
  const map: Record<typeof status, [Tone, string]> = {
    active: ["success", "Active"],
    approved: ["success", "Approved"],
    pending: ["warning", "Pending"],
    rejected: ["danger", "Rejected"],
    overdue: ["danger", "Overdue"],
    draft: ["neutral", "Draft"],
    inactive: ["neutral", "Inactive"],
  };
  const [tone, label] = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function Tag({ children, onRemove, selected, onClick, icon, className }: { children: ReactNode; onRemove?: () => void; selected?: boolean; onClick?: () => void; icon?: IconName; className?: string }) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-pressed={onClick ? !!selected : undefined}
      onClick={onClick}
      className={cx("md-tag", selected && "md-tag--selected", onClick && "md-tag--clickable", className)}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove"
          className="md-tag__x"
          onClick={(e) => (e.stopPropagation(), onRemove())}
          onKeyDown={(e) => e.key === "Enter" && onRemove()}
        >
          <Icon name="close" size={12} />
        </span>
      )}
    </Comp>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

const colorFor = (name: string) => dataColors[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % dataColors.length];

export function Avatar({ name, src, size = "md", status, square, className }: { name: string; src?: string; size?: AvatarSize; status?: "online" | "away" | "busy" | "offline"; square?: boolean; className?: string }) {
  return (
    <span className={cx("md-avatar", `md-avatar--${size}`, square && "md-avatar--square", className)} title={name} style={src ? undefined : { background: colorFor(name) }}>
      {src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials(name)}</span>}
      {status && <span className={cx("md-avatar__status", `md-avatar__status--${status}`)} aria-label={status} />}
    </span>
  );
}

export function AvatarGroup({ names, max = 4, size = "sm" }: { names: string[]; max?: number; size?: AvatarSize }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="md-avatar-group">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} />
      ))}
      {rest > 0 && <span className={cx("md-avatar", `md-avatar--${size}`, "md-avatar--more")}>+{rest}</span>}
    </span>
  );
}

/** Avatar + name + secondary line, used in tables, lists and menus. */
export function UserCell({ name, detail, src, size = "sm", status }: { name: string; detail?: ReactNode; src?: string; size?: AvatarSize; status?: "online" | "away" | "busy" | "offline" }) {
  return (
    <span className="md-user">
      <Avatar name={name} src={src} size={size} status={status} />
      <span className="md-user__text">
        <span className="md-user__name">{name}</span>
        {detail && <span className="md-user__detail">{detail}</span>}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stat / KPI
// ---------------------------------------------------------------------------
export function Stat({ label, value, delta, trend = "up", icon, hint, className }: { label: ReactNode; value: ReactNode; delta?: string; trend?: "up" | "down" | "flat"; icon?: IconName; hint?: ReactNode; className?: string }) {
  return (
    <Card className={cx("md-stat", className)}>
      <div className="md-stat__top">
        <span className="md-stat__label">{label}</span>
        {icon && <span className="md-stat__icon"><Icon name={icon} size={18} /></span>}
      </div>
      <div className="md-stat__value">{value}</div>
      {(delta || hint) && (
        <div className="md-stat__foot">
          {delta && (
            <span className={cx("md-stat__delta", `md-stat__delta--${trend}`)}>
              {trend !== "flat" && <Icon name={trend === "up" ? "arrowUp" : "arrowDown"} size={12} strokeWidth={2.25} />}
              {delta}
            </span>
          )}
          {hint && <span className="md-stat__hint">{hint}</span>}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------
export function List({ children, divided = true, className }: { children: ReactNode; divided?: boolean; className?: string }) {
  return <ul className={cx("md-list", divided && "md-list--divided", className)}>{children}</ul>;
}

export function ListItem({ title, description, leading, trailing, onClick, active, className }: { title: ReactNode; description?: ReactNode; leading?: ReactNode; trailing?: ReactNode; onClick?: () => void; active?: boolean; className?: string }) {
  const inner = (
    <>
      {leading && <span className="md-list__leading">{leading}</span>}
      <span className="md-list__text">
        <span className="md-list__title">{title}</span>
        {description && <span className="md-list__desc">{description}</span>}
      </span>
      {trailing && <span className="md-list__trailing">{trailing}</span>}
    </>
  );
  return (
    <li className={cx("md-list__item", active && "md-list__item--active", className)}>
      {onClick ? (
        <button type="button" className="md-list__row" onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className="md-list__row">{inner}</div>
      )}
    </li>
  );
}

/** Label / value pairs, e.g. the details panel of a record. */
export function DescriptionList({ items, columns = 1 }: { items: Array<{ label: ReactNode; value: ReactNode }>; columns?: 1 | 2 | 3 }) {
  return (
    <dl className={cx("md-dl", `md-dl--${columns}`)}>
      {items.map((it, i) => (
        <div key={i} className="md-dl__row">
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ items }: { items: Array<{ title: ReactNode; time?: ReactNode; description?: ReactNode; icon?: IconName; tone?: Tone }> }) {
  return (
    <ol className="md-timeline">
      {items.map((it, i) => (
        <li key={i} className="md-timeline__item">
          <span className={cx("md-timeline__dot", `md-timeline__dot--${it.tone ?? "neutral"}`)}>{it.icon && <Icon name={it.icon} size={12} strokeWidth={2.25} />}</span>
          <div className="md-timeline__body">
            <div className="md-timeline__head">
              <span className="md-timeline__title">{it.title}</span>
              {it.time && <time className="md-timeline__time">{it.time}</time>}
            </div>
            {it.description && <div className="md-timeline__desc">{it.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EmptyState({ icon = "inbox", title, description, action, className }: { icon?: IconName; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("md-empty", className)}>
      <span className="md-empty__icon"><Icon name={icon} size={24} /></span>
      <h3 className="md-empty__title">{title}</h3>
      {description && <p className="md-empty__desc">{description}</p>}
      {action && <div className="md-empty__action">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export interface ProfileCardProps {
  name: string;
  title?: ReactNode;
  department?: ReactNode;
  src?: string;
  status?: "online" | "away" | "busy" | "offline";
  details?: Array<{ icon: IconName; value: ReactNode }>;
  stats?: Array<{ label: ReactNode; value: ReactNode }>;
  actions?: ReactNode;
  /** Colored strip on top */
  cover?: boolean;
  className?: string;
}

export function ProfileCard({ name, title, department, src, status, details, stats, actions, cover = true, className }: ProfileCardProps) {
  return (
    <Card padding="none" className={cx("md-profile", className)}>
      {cover && <div className="md-profile__cover" />}
      <div className={cx("md-profile__main", !cover && "md-profile__main--flat")}>
        <Avatar name={name} src={src} size="xl" status={status} className="md-profile__avatar" />
        <div>
          <h3 className="md-profile__name">{name}</h3>
          {title && <p className="md-profile__title">{title}</p>}
          {department && <Badge tone="primary" className="md-profile__dept">{department}</Badge>}
        </div>
      </div>
      {details && (
        <ul className="md-profile__details">
          {details.map((d, i) => (
            <li key={i}>
              <Icon name={d.icon} size={16} />
              <span className="md-truncate">{d.value}</span>
            </li>
          ))}
        </ul>
      )}
      {stats && (
        <div className="md-profile__stats">
          {stats.map((s, i) => (
            <div key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="md-profile__actions">{actions}</div>}
    </Card>
  );
}

/** Large header for a person's own page or settings. */
export function ProfileHeader({ name, title, src, meta, actions }: { name: string; title?: ReactNode; src?: string; meta?: Array<{ icon: IconName; value: ReactNode }>; actions?: ReactNode }) {
  return (
    <div className="md-profile-header">
      <div className="md-profile-header__cover" />
      <div className="md-profile-header__row">
        <Avatar name={name} src={src} size="xl" className="md-profile-header__avatar" />
        <div className="md-profile-header__text">
          <h2 className="md-heading md-heading--3">{name}</h2>
          {title && <p className="md-text md-tone--secondary">{title}</p>}
          {meta && (
            <div className="md-profile-header__meta">
              {meta.map((m, i) => (
                <span key={i}>
                  <Icon name={m.icon} size={15} /> {m.value}
                </span>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="md-profile-header__actions">{actions}</div>}
      </div>
    </div>
  );
}
