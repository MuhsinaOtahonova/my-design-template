import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { Menu, type MenuItem } from "./Overlay";
import { addRipple, type ButtonVariant, type ControlSize } from "./Button";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** True when the user asked the OS for less motion. Every animated component checks this. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Becomes true once the element scrolls into view. */
export function useInView<T extends Element>({ once = true, rootMargin = "0px 0px -8% 0px" }: { once?: boolean; rootMargin?: string } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) return setInView(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);
  return [ref, inView] as const;
}

// ---------------------------------------------------------------------------
// Reveal: content that animates in when it scrolls into view
// ---------------------------------------------------------------------------
export type RevealEffect = "up" | "down" | "left" | "right" | "scale" | "blur" | "flip";

export function Reveal({
  children,
  effect = "up",
  delay = 0,
  duration,
  as: Tag = "div",
  once = true,
  className,
  style,
}: {
  children: ReactNode;
  effect?: RevealEffect;
  /** ms */
  delay?: number;
  /** ms */
  duration?: number;
  as?: ElementType;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, inView] = useInView<HTMLElement>({ once });
  return (
    <Tag
      ref={ref}
      className={cx("md-reveal", `md-reveal--${effect}`, inView && "is-visible", className)}
      style={{ ...style, "--md-reveal-delay": `${delay}ms`, ...(duration ? { "--md-reveal-duration": `${duration}ms` } : null) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Reveals each child one after another. */
export function RevealGroup({ children, effect = "up", stagger = 70, delay = 0, className }: { children: ReactNode; effect?: RevealEffect; stagger?: number; delay?: number; className?: string }) {
  return (
    <div className={className}>
      {Children.toArray(children).map((child, i) => (
        <Reveal key={i} effect={effect} delay={delay + i * stagger}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AnimatedNumber: counts up when visible, and tweens between values
// ---------------------------------------------------------------------------
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedNumber({
  value,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) return setShown(value);
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const v = a + (value - a) * easeOutCubic(t);
      setShown(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  const text = format ? format(shown) : shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={cx("md-countup", className)} aria-label={`${prefix}${format ? format(value) : value.toLocaleString("en-US")}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// TiltCard: a card that leans toward the pointer in 3D, with a soft glare
// ---------------------------------------------------------------------------
export function TiltCard({
  children,
  max = 10,
  glare = true,
  scale = 1.02,
  padding = "md",
  variant = "surface",
  className,
  style,
}: {
  children: ReactNode;
  /** Maximum tilt in degrees */
  max?: number;
  glare?: boolean;
  scale?: number;
  padding?: "none" | "sm" | "md" | "lg";
  /** surface = white card, brand = navy gradient card */
  variant?: "surface" | "brand";
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--ts", String(scale));
    el.classList.add("is-tilting");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--ts", "1");
    el.classList.remove("is-tilting");
  };
  return (
    <div className={cx("md-tilt-wrap", className)} style={style}>
      <div ref={ref} className={cx("md-tilt", `md-tilt--${variant}`, `md-tilt--pad-${padding}`)} onPointerMove={move} onPointerLeave={leave}>
        {children}
        {glare && <span className="md-tilt__glare" aria-hidden />}
      </div>
    </div>
  );
}

/** Lifts its content off a TiltCard by `depth` px, for a parallax 3D effect. */
export function TiltLayer({ depth = 30, children, className }: { depth?: number; children: ReactNode; className?: string }) {
  return (
    <div className={cx("md-tilt__layer", className)} style={{ transform: `translateZ(${depth}px)` }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpotlightCard: a soft light and border glow that follows the pointer
// ---------------------------------------------------------------------------
export function SpotlightCard({ children, padding = "md", className, as: Tag = "div", ...rest }: { children: ReactNode; padding?: "none" | "sm" | "md" | "lg"; className?: string; as?: ElementType; href?: string; onClick?: () => void }) {
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag className={cx("md-spotlight", `md-spotlight--pad-${padding}`, className)} onPointerMove={move} {...rest}>
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// CardStack: a deck of cards in 3D; click or use the arrows to flip through
// ---------------------------------------------------------------------------
export function CardStack({ items, height = 220, label = "Cards", className }: { items: ReactNode[]; height?: number; label?: string; className?: string }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  useEffect(() => setOrder(items.map((_, i) => i)), [items.length]);
  const next = useCallback(() => {
    if (leaving != null) return;
    const top = order[0];
    if (prefersReducedMotion()) return setOrder((o) => [...o.slice(1), o[0]]);
    setLeaving(top);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
    }, 280);
  }, [order, leaving]);
  const prev = () => leaving == null && setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const visible = 4;
  return (
    <div className={cx("md-cardstack", className)} role="group" aria-roledescription="card stack" aria-label={label}>
      <div className="md-cardstack__deck" style={{ height }}>
        {items.map((item, i) => {
          const pos = order.indexOf(i);
          const isTop = pos === 0;
          return (
            <div
              key={i}
              className={cx("md-cardstack__card", isTop && "is-top", leaving === i && "is-leaving")}
              style={{ "--pos": Math.min(pos, visible), zIndex: items.length - pos, opacity: pos > visible - 1 ? 0 : undefined } as CSSProperties}
              aria-hidden={!isTop}
              onClick={isTop ? next : undefined}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="md-cardstack__controls">
        <button type="button" className="md-cardstack__btn" onClick={prev} aria-label="Previous card">
          <Icon name="chevronLeft" size={16} />
        </button>
        <span className="md-cardstack__dots" aria-live="polite">
          {items.map((_, i) => (
            <span key={i} className={cx("md-cardstack__dot", order[0] === i && "is-active")} />
          ))}
          <span className="md-visually-hidden">
            Card {order[0] + 1} of {items.length}
          </span>
        </span>
        <button type="button" className="md-cardstack__btn" onClick={next} aria-label="Next card">
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HoldButton: press and hold to confirm a destructive action
// ---------------------------------------------------------------------------
export function HoldButton({
  children,
  onConfirm,
  duration = 1400,
  variant = "danger",
  size = "md",
  icon = "trash",
  doneLabel = "Done",
}: {
  children: ReactNode;
  onConfirm?: () => void;
  duration?: number;
  variant?: ButtonVariant;
  size?: ControlSize;
  icon?: IconName;
  doneLabel?: ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef(0);
  const start = useRef(0);
  const stop = () => {
    cancelAnimationFrame(raf.current);
    if (!done) setProgress(0);
  };
  const begin = () => {
    if (done) return;
    start.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start.current) / duration);
      setProgress(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        setDone(true);
        onConfirm?.();
        window.setTimeout(() => (setDone(false), setProgress(0)), 1800);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const key = (e: KeyboardEvent<HTMLButtonElement>, down: boolean) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (down && !e.repeat) begin();
    if (!down) stop();
  };
  return (
    <button
      type="button"
      className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, "md-hold", done && "is-done")}
      style={{ "--hold": progress } as CSSProperties}
      onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), begin())}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => key(e, true)}
      onKeyUp={(e) => key(e, false)}
      aria-label={typeof children === "string" ? `${children} (press and hold)` : undefined}
    >
      <span className="md-hold__fill" aria-hidden />
      <Icon name={done ? "check" : icon} size={16} />
      <span>{done ? doneLabel : children}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// SplitButton: main action plus a menu of related actions
// ---------------------------------------------------------------------------
export function SplitButton({
  children,
  onClick,
  items,
  variant = "primary",
  size = "md",
  icon,
  menuLabel = "More options",
}: {
  children: ReactNode;
  onClick?: () => void;
  items: MenuItem[];
  variant?: ButtonVariant;
  size?: ControlSize;
  icon?: IconName;
  menuLabel?: string;
}) {
  return (
    <div className={cx("md-splitbtn", `md-splitbtn--${variant}`)}>
      <button type="button" className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, "md-splitbtn__main")} onClick={onClick} onPointerDown={addRipple}>
        <span className="md-btn__fx" aria-hidden />
        {icon && <Icon name={icon} size={16} />}
        <span>{children}</span>
      </button>
      <Menu
        align="end"
        items={items}
        trigger={(p) => (
          <button type="button" aria-label={menuLabel} className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, "md-btn--icon", "md-splitbtn__toggle")} onPointerDown={addRipple} {...p}>
            <span className="md-btn__fx" aria-hidden />
            <Icon name="chevronDown" size={16} />
          </button>
        )}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpeedDial: a floating action button that fans out related actions
// ---------------------------------------------------------------------------
export function SpeedDial({
  actions,
  icon = "plus",
  label = "Quick actions",
  direction = "up",
  className,
}: {
  actions: Array<{ icon: IconName; label: string; onClick?: () => void }>;
  icon?: IconName;
  label?: string;
  direction?: "up" | "left";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => (document.removeEventListener("mousedown", onDown), document.removeEventListener("keydown", onKey));
  }, [open]);
  return (
    <div ref={ref} className={cx("md-speeddial", `md-speeddial--${direction}`, open && "is-open", className)}>
      <ul className="md-speeddial__actions" aria-hidden={!open}>
        {actions.map((a, i) => (
          <li key={a.label} style={{ "--i": i } as CSSProperties}>
            <span className="md-speeddial__label">{a.label}</span>
            <button type="button" className="md-speeddial__action" aria-label={a.label} tabIndex={open ? 0 : -1} onClick={() => (a.onClick?.(), setOpen(false))}>
              <Icon name={a.icon} size={18} />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="md-speeddial__fab" aria-label={label} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name={icon} size={24} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CopyButton: copies text, and the icon morphs into a check
// ---------------------------------------------------------------------------
export function CopyButton({ value, children, variant = "outline", size = "md" }: { value: string; children?: ReactNode; variant?: ButtonVariant; size?: ControlSize }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      /* clipboard may be blocked; still show feedback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button type="button" className={cx("md-btn", `md-btn--${variant}`, `md-btn--${size}`, "md-copy", copied && "is-copied", !children && "md-btn--icon")} onClick={copy} onPointerDown={addRipple} aria-label={children ? undefined : copied ? "Copied" : "Copy"}>
      <span className="md-btn__fx" aria-hidden />
      <span className="md-copy__icons" aria-hidden>
        <Icon name="copy" size={16} />
        <Icon name="check" size={16} strokeWidth={2.5} />
      </span>
      {children && <span>{copied ? "Copied" : children}</span>}
      <span className="md-visually-hidden" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
  );
}
