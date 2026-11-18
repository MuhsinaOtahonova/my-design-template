import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { Avatar } from "./Display";
import { Field } from "./Form";
import type { MenuItem } from "./Overlay";

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const key = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => (document.removeEventListener("mousedown", down), document.removeEventListener("keydown", key));
  }, [open, close]);
  return ref;
}

const norm = (s: string) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Calls `fn` on Ctrl+key (Windows/Linux) or ⌘+key (macOS). */
export function useHotkey(key: string, fn: () => void) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    const on = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        ref.current();
      }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [key]);
}

// ---------------------------------------------------------------------------
// Command palette (⌘K)
// ---------------------------------------------------------------------------
export interface Command {
  id: string;
  label: string;
  group?: string;
  icon?: IconName;
  hint?: string;
  shortcut?: string;
  keywords?: string;
  onSelect?: () => void;
}

export function CommandPalette({ open, onClose, commands, placeholder = "Type a command or search…" }: { open: boolean; onClose: () => void; commands: Command[]; placeholder?: string }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);
  const list = useMemo(() => commands.filter((c) => norm(`${c.label} ${c.group ?? ""} ${c.keywords ?? ""}`).includes(norm(q))), [commands, q]);
  if (!open) return null;
  const run = (c?: Command) => {
    if (!c) return;
    c.onSelect?.();
    onClose();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(list.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Enter") run(list[active]);
    else if (e.key === "Escape") onClose();
  };
  let lastGroup: string | undefined;
  return (
    <div className="md-overlay md-overlay--top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="md-cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="md-cmdk__search">
          <Icon name="search" size={18} />
          <input ref={input} value={q} onChange={(e) => (setQ(e.target.value), setActive(0))} onKeyDown={onKey} placeholder={placeholder} role="combobox" aria-expanded="true" aria-controls="md-cmdk-list" />
          <kbd className="md-kbd">Esc</kbd>
        </div>
        <ul className="md-cmdk__list" id="md-cmdk-list" role="listbox">
          {list.length === 0 && <li className="md-cmdk__empty">No results for “{q}”</li>}
          {list.map((c, i) => {
            const header = c.group && c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header && <div className="md-cmdk__group">{header}</div>}
                <button type="button" role="option" aria-selected={i === active} className="md-cmdk__item" onMouseMove={() => setActive(i)} onClick={() => run(c)}>
                  {c.icon && <Icon name={c.icon} size={17} />}
                  <span className="md-cmdk__label">{c.label}</span>
                  {c.hint && <span className="md-cmdk__hint">{c.hint}</span>}
                  {c.shortcut && <kbd className="md-kbd">{c.shortcut}</kbd>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="md-cmdk__foot">
          <span><kbd className="md-kbd">↑</kbd> <kbd className="md-kbd">↓</kbd> to move</span>
          <span><kbd className="md-kbd">↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Combobox (searchable select) and MultiSelect
// ---------------------------------------------------------------------------
export interface ComboOption {
  value: string;
  label: string;
  description?: string;
  icon?: IconName;
  avatar?: boolean;
}

function OptionRow({ o, selected, multi }: { o: ComboOption; selected: boolean; multi?: boolean }) {
  return (
    <>
      {multi && <span className={cx("md-combo__check", selected && "is-on")}>{selected && <Icon name="check" size={12} strokeWidth={3} />}</span>}
      {o.avatar && <Avatar name={o.label} size="xs" />}
      {o.icon && <Icon name={o.icon} size={16} />}
      <span className="md-combo__text">
        <span>{o.label}</span>
        {o.description && <small>{o.description}</small>}
      </span>
      {!multi && selected && <Icon name="check" size={16} className="md-combo__tick" />}
    </>
  );
}

export function Combobox({ label, hint, options, value, defaultValue, onChange, placeholder = "Select…", searchPlaceholder = "Search…" }: { label?: ReactNode; hint?: ReactNode; options: ComboOption[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; placeholder?: string; searchPlaceholder?: string }) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useOutsideClose(open, () => setOpen(false));
  const id = useId();
  const sel = options.find((o) => o.value === current);
  const list = options.filter((o) => norm(o.label + (o.description ?? "")).includes(norm(q)));
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div ref={ref} className="md-combo">
        <button id={id} type="button" className="md-input md-input--md md-combo__trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => (setOpen(!open), setQ(""))}>
          {sel ? (
            <span className="md-combo__value">
              {sel.avatar && <Avatar name={sel.label} size="xs" />}
              {sel.icon && <Icon name={sel.icon} size={16} />}
              {sel.label}
            </span>
          ) : (
            <span className="md-combo__placeholder">{placeholder}</span>
          )}
          <Icon name="chevronDown" size={16} className="md-input__icon" />
        </button>
        {open && (
          <div className="md-popover md-combo__pop">
            <div className="md-combo__search">
              <Icon name="search" size={15} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} />
            </div>
            <ul role="listbox" className="md-combo__list">
              {list.length === 0 && <li className="md-cmdk__empty">No matches</li>}
              {list.map((o) => (
                <li key={o.value}>
                  <button type="button" role="option" aria-selected={o.value === current} className="md-combo__opt" onClick={() => (setInner(o.value), onChange?.(o.value), setOpen(false))}>
                    <OptionRow o={o} selected={o.value === current} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Field>
  );
}

export function MultiSelect({ label, hint, options, value, defaultValue = [], onChange, placeholder = "Add…" }: { label?: ReactNode; hint?: ReactNode; options: ComboOption[]; value?: string[]; defaultValue?: string[]; onChange?: (v: string[]) => void; placeholder?: string }) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const current = value ?? inner;
  const set = (v: string[]) => (setInner(v), onChange?.(v));
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useOutsideClose(open, () => setOpen(false));
  const list = options.filter((o) => norm(o.label).includes(norm(q)));
  const toggle = (v: string) => set(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  return (
    <Field label={label} hint={hint}>
      <div ref={ref} className="md-combo">
        <div className="md-input md-tokens" onClick={() => setOpen(true)}>
          {current.map((v) => {
            const o = options.find((x) => x.value === v);
            return (
              <span key={v} className="md-token">
                {o?.avatar && <Avatar name={o.label} size="xs" />}
                {o?.label ?? v}
                <button type="button" aria-label={`Remove ${o?.label ?? v}`} onClick={(e) => (e.stopPropagation(), toggle(v))}>
                  <Icon name="close" size={12} />
                </button>
              </span>
            );
          })}
          <input
            value={q}
            onChange={(e) => (setQ(e.target.value), setOpen(true))}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Backspace" && !q && current.length && set(current.slice(0, -1))}
            placeholder={current.length ? "" : placeholder}
          />
        </div>
        {open && (
          <div className="md-popover md-combo__pop">
            <ul role="listbox" aria-multiselectable="true" className="md-combo__list">
              {list.length === 0 && <li className="md-cmdk__empty">No matches</li>}
              {list.map((o) => (
                <li key={o.value}>
                  <button type="button" role="option" aria-selected={current.includes(o.value)} className="md-combo__opt" onClick={() => toggle(o.value)}>
                    <OptionRow o={o} selected={current.includes(o.value)} multi />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Field>
  );
}

/** Free-text tokens: type and press Enter or comma (emails, keywords). */
export function TagInput({ label, hint, value, defaultValue = [], onChange, placeholder = "Type and press Enter", validate }: { label?: ReactNode; hint?: ReactNode; value?: string[]; defaultValue?: string[]; onChange?: (v: string[]) => void; placeholder?: string; validate?: (t: string) => boolean }) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const tags = value ?? inner;
  const [text, setText] = useState("");
  const set = (v: string[]) => (setInner(v), onChange?.(v));
  const add = () => {
    const t = text.trim().replace(/,$/, "");
    if (t && !tags.includes(t)) set([...tags, t]);
    setText("");
  };
  return (
    <Field label={label} hint={hint}>
      <div className="md-input md-tokens">
        {tags.map((t) => (
          <span key={t} className={cx("md-token", validate && !validate(t) && "md-token--invalid")}>
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => set(tags.filter((x) => x !== t))}>
              <Icon name="close" size={12} />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => (e.target.value.endsWith(",") ? (setText(e.target.value), setTimeout(add)) : setText(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.preventDefault(), add());
            if (e.key === "Backspace" && !text && tags.length) set(tags.slice(0, -1));
          }}
          onBlur={add}
          placeholder={tags.length ? "" : placeholder}
        />
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Date range
// ---------------------------------------------------------------------------
export function DateRangeInput({ label, hint, start, end, onChange, defaultValue = ["", ""] }: { label?: ReactNode; hint?: ReactNode; start?: string; end?: string; defaultValue?: [string, string]; onChange?: (range: [string, string]) => void }) {
  const [inner, setInner] = useState<[string, string]>(defaultValue);
  const a = start ?? inner[0];
  const b = end ?? inner[1];
  const set = (r: [string, string]) => (setInner(r), onChange?.(r));
  const days = a && b ? Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5) + 1 : null;
  return (
    <Field label={label} hint={days && days > 0 ? `${days} day${days === 1 ? "" : "s"}` : hint}>
      <div className="md-input md-input--md md-daterange">
        <Icon name="calendar" size={16} className="md-input__icon" />
        <input type="date" aria-label="Start date" value={a} max={b || undefined} onChange={(e) => set([e.target.value, b])} />
        <Icon name="arrowRight" size={14} className="md-input__icon" />
        <input type="date" aria-label="End date" value={b} min={a || undefined} onChange={(e) => set([a, e.target.value])} />
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Tree list (folders, org chart, categories)
// ---------------------------------------------------------------------------
export interface TreeNode {
  id: string;
  label: string;
  icon?: IconName;
  meta?: ReactNode;
  children?: TreeNode[];
}

export function TreeList({ nodes, defaultExpanded = [], selected, onSelect }: { nodes: TreeNode[]; defaultExpanded?: string[]; selected?: string; onSelect?: (n: TreeNode) => void }) {
  const [open, setOpen] = useState<string[]>(defaultExpanded);
  const [inner, setInner] = useState(selected);
  const sel = selected ?? inner;
  const render = (list: TreeNode[], depth: number): ReactNode => (
    <ul role={depth === 0 ? "tree" : "group"} className="md-tree">
      {list.map((n) => {
        const kids = !!n.children?.length;
        const isOpen = open.includes(n.id);
        return (
          <li key={n.id} role="treeitem" aria-expanded={kids ? isOpen : undefined} aria-selected={sel === n.id}>
            <button
              type="button"
              className={cx("md-tree__row", sel === n.id && "is-selected")}
              style={{ paddingLeft: 8 + depth * 18 }}
              onClick={() => {
                if (kids) setOpen((o) => (isOpen ? o.filter((x) => x !== n.id) : [...o, n.id]));
                setInner(n.id);
                onSelect?.(n);
              }}
            >
              <span className={cx("md-tree__caret", isOpen && "is-open", !kids && "is-leaf")}>
                <Icon name="chevronRight" size={14} />
              </span>
              <Icon name={n.icon ?? (kids ? "folder" : "file")} size={16} />
              <span className="md-tree__label">{n.label}</span>
              {n.meta && <span className="md-tree__meta">{n.meta}</span>}
            </button>
            {kids && isOpen && render(n.children!, depth + 1)}
          </li>
        );
      })}
    </ul>
  );
  return <div className="md-tree-wrap">{render(nodes, 0)}</div>;
}

// ---------------------------------------------------------------------------
// Context menu (right click)
// ---------------------------------------------------------------------------
export function ContextMenu({ items, children, className }: { items: MenuItem[]; children: ReactNode; className?: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useOutsideClose(!!pos, () => setPos(null));
  return (
    <div
      className={cx("md-context", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
      }}
    >
      {children}
      {pos && (
        <div ref={ref} role="menu" className="md-popover md-menu md-context__menu" style={{ left: pos.x, top: pos.y }}>
          {items.map((it, i) => {
            if (it.type === "divider") return <div key={i} className="md-menu__divider" role="separator" />;
            if (it.type === "label") return <div key={i} className="md-menu__label">{it.label}</div>;
            return (
              <button key={i} type="button" role="menuitem" disabled={it.disabled} className={cx("md-menu__item", it.danger && "md-menu__item--danger")} onClick={() => (it.onSelect?.(), setPos(null))}>
                {it.icon && <Icon name={it.icon} size={16} />}
                <span>{it.label}</span>
                {it.shortcut && <kbd className="md-kbd md-menu__kbd">{it.shortcut}</kbd>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// InfoTip & HoverCard
// ---------------------------------------------------------------------------
/** Small (i) icon that explains a label or number on hover / focus. */
export function InfoTip({ children, label = "More info" }: { children: ReactNode; label?: string }) {
  return (
    <span className="md-tooltip md-tooltip--top md-infotip">
      <button type="button" aria-label={label} className="md-infotip__btn">
        <Icon name="info" size={15} />
      </button>
      <span role="tooltip" className="md-tooltip__bubble">{children}</span>
    </span>
  );
}

/** Rich preview on hover, e.g. a person's card when hovering their name. */
export function HoverCard({ trigger, children, width = 300 }: { trigger: ReactNode; children: ReactNode; width?: number }) {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => (clearTimeout(t.current), (t.current = setTimeout(() => setOpen(true), 250)));
  const hide = () => (clearTimeout(t.current), (t.current = setTimeout(() => setOpen(false), 150)));
  return (
    <span className="md-popover-anchor" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}
      {open && (
        <div className="md-popover md-popover--start md-hovercard" style={{ width }}>
          {children}
        </div>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Toolbar, ToggleButton
// ---------------------------------------------------------------------------
export function Toolbar({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="toolbar" className={cx("md-toolbar", className)} {...rest} />;
}
export const ToolbarDivider = () => <span className="md-toolbar__divider" role="separator" />;

export function ToggleButton({ icon, label, pressed, defaultPressed, onChange, showLabel, size = "md" }: { icon?: IconName; label: string; pressed?: boolean; defaultPressed?: boolean; onChange?: (p: boolean) => void; showLabel?: boolean; size?: "sm" | "md" }) {
  const [inner, setInner] = useState(!!defaultPressed);
  const on = pressed ?? inner;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={showLabel ? undefined : label}
      title={showLabel ? undefined : label}
      className={cx("md-toggle", `md-toggle--${size}`, !showLabel && "md-toggle--icon")}
      onClick={() => (setInner(!on), onChange?.(!on))}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Timestamp & StatusDot
// ---------------------------------------------------------------------------
const rtf = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;
export function relativeTime(date: Date, now = new Date()) {
  const s = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(s);
  const [v, u]: [number, Intl.RelativeTimeFormatUnit] =
    abs < 60 ? [s, "second"] : abs < 3600 ? [Math.round(s / 60), "minute"] : abs < 86400 ? [Math.round(s / 3600), "hour"] : abs < 604800 ? [Math.round(s / 86400), "day"] : abs < 2629800 ? [Math.round(s / 604800), "week"] : [Math.round(s / 2629800), "month"];
  return rtf ? rtf.format(v, u) : date.toLocaleString();
}

/** "5 minutes ago" with the full date on hover. Updates every minute. */
export function Timestamp({ date, format = "relative" }: { date: Date; format?: "relative" | "date" | "datetime" }) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (format !== "relative") return;
    const t = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, [format]);
  const full = date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
  const text = format === "relative" ? relativeTime(date) : format === "date" ? date.toLocaleDateString("en-GB", { dateStyle: "medium" }) : full;
  return (
    <time className="md-timestamp" dateTime={date.toISOString()} title={full}>
      {text}
    </time>
  );
}

export function StatusDot({ tone = "success", label, pulse }: { tone?: "success" | "warning" | "danger" | "neutral" | "primary"; label?: ReactNode; pulse?: boolean }) {
  return (
    <span className="md-statusdot">
      <span className={cx("md-statusdot__dot", `md-statusdot__dot--${tone}`, pulse && "md-statusdot__dot--pulse")} />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Selectable cards (choose a plan, a room, a delivery option)
// ---------------------------------------------------------------------------
export function SelectableCards<T extends string>({ options, value, defaultValue, onChange, multiple, columns = 3, label }: { options: Array<{ value: T; title: ReactNode; description?: ReactNode; icon?: IconName; aside?: ReactNode; disabled?: boolean }>; value?: T[]; defaultValue?: T[]; onChange?: (v: T[]) => void; multiple?: boolean; columns?: number; label?: ReactNode }) {
  const [inner, setInner] = useState<T[]>(defaultValue ?? []);
  const sel = value ?? inner;
  const pick = (v: T) => {
    const next = multiple ? (sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]) : [v];
    setInner(next);
    onChange?.(next);
  };
  return (
    <Field label={label}>
      <div role={multiple ? "group" : "radiogroup"} className="md-selcards" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${Math.round(720 / columns)}px, 100%), 1fr))` }}>
        {options.map((o) => {
          const on = sel.includes(o.value);
          return (
            <button key={o.value} type="button" role={multiple ? "checkbox" : "radio"} aria-checked={on} disabled={o.disabled} className={cx("md-selcard", on && "is-on")} onClick={() => pick(o.value)}>
              <span className="md-selcard__top">
                {o.icon && <span className="md-card__icon"><Icon name={o.icon} size={18} /></span>}
                <span className={cx("md-selcard__mark", multiple && "md-selcard__mark--square")}>{on && <Icon name="check" size={12} strokeWidth={3} />}</span>
              </span>
              <span className="md-selcard__title">{o.title}</span>
              {o.description && <span className="md-selcard__desc">{o.description}</span>}
              {o.aside && <span className="md-selcard__aside">{o.aside}</span>}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Chat (team messages, support, comments)
// ---------------------------------------------------------------------------
export function ChatMessage({ author, time, children, own, avatar = true, status }: { author: string; time?: ReactNode; children: ReactNode; own?: boolean; avatar?: boolean; status?: "sent" | "read" }) {
  return (
    <div className={cx("md-chat__msg", own && "md-chat__msg--own")}>
      {avatar && !own && <Avatar name={author} size="sm" />}
      <div className="md-chat__body">
        {!own && <div className="md-chat__meta"><strong>{author}</strong>{time && <span>{time}</span>}</div>}
        <div className="md-chat__bubble">{children}</div>
        {own && (time || status) && (
          <div className="md-chat__meta md-chat__meta--own">
            {time && <span>{time}</span>}
            {status && <Icon name="check" size={13} strokeWidth={2.25} className={status === "read" ? "md-chat__read" : undefined} />}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatThread({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("md-chat", className)}>{children}</div>;
}

export function ChatComposer({ onSend, placeholder = "Write a message…" }: { onSend?: (text: string) => void; placeholder?: string }) {
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };
  return (
    <div className="md-composer">
      <button type="button" className="md-composer__btn" aria-label="Attach file"><Icon name="paperclip" size={18} /></button>
      <textarea
        rows={1}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
      />
      <button type="button" className="md-composer__send" aria-label="Send" disabled={!text.trim()} onClick={send}>
        <Icon name="send" size={17} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lightbox (image / attachment preview)
// ---------------------------------------------------------------------------
export interface LightboxItem {
  src?: string;
  title: string;
  /** Background used when there is no image (placeholders, file types) */
  color?: string;
}

export function Lightbox({ items, columns = 4 }: { items: LightboxItem[]; columns?: number }) {
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    if (index == null) return;
    const on = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i! + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i! - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [index, items.length]);
  const bg = (it: LightboxItem) => (it.src ? { backgroundImage: `url(${it.src})` } : { background: it.color ?? "var(--md-color-surfaceSunken)" });
  const cur = index != null ? items[index] : null;
  return (
    <>
      <div className="md-thumbs" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {items.map((it, i) => (
          <button key={i} type="button" className="md-thumb" style={bg(it)} onClick={() => setIndex(i)} aria-label={`Open ${it.title}`}>
            <span className="md-thumb__title">{it.title}</span>
          </button>
        ))}
      </div>
      {cur && (
        <div className="md-overlay md-lightbox" onMouseDown={(e) => e.target === e.currentTarget && setIndex(null)}>
          <div className="md-lightbox__bar">
            <span>{cur.title} · {index! + 1} / {items.length}</span>
            <button type="button" aria-label="Close" onClick={() => setIndex(null)}><Icon name="close" size={20} /></button>
          </div>
          <button type="button" className="md-lightbox__nav md-lightbox__nav--prev" aria-label="Previous" onClick={() => setIndex((index! - 1 + items.length) % items.length)}><Icon name="chevronLeft" size={24} /></button>
          <div className="md-lightbox__img" style={bg(cur)} role="img" aria-label={cur.title} />
          <button type="button" className="md-lightbox__nav md-lightbox__nav--next" aria-label="Next" onClick={() => setIndex((index! + 1) % items.length)}><Icon name="chevronRight" size={24} /></button>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Blockquote
// ---------------------------------------------------------------------------
export function Blockquote({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return (
    <figure className="md-quote">
      <blockquote>{children}</blockquote>
      {cite && <figcaption>— {cite}</figcaption>}
    </figure>
  );
}
