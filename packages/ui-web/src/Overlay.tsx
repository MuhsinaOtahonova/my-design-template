import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

// ---------------------------------------------------------------------------
// Modal (dialog)
// ---------------------------------------------------------------------------
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons at the bottom, right-aligned */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Icon + tone for confirmation dialogs */
  tone?: "default" | "danger" | "success";
}

export function Modal({ open, onClose, title, description, children, footer, size = "md", tone = "default" }: ModalProps) {
  useEscape(open, onClose);
  const titleId = useId();
  if (!open) return null;
  return (
    <div className="md-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} className={cx("md-modal", `md-modal--${size}`)}>
        <div className="md-modal__header">
          {tone !== "default" && (
            <span className={cx("md-modal__icon", `md-modal__icon--${tone}`)}>
              <Icon name={tone === "danger" ? "alert" : "checkCircle"} size={20} />
            </span>
          )}
          <div className="md-modal__titles">
            {title && <h2 id={titleId} className="md-modal__title">{title}</h2>}
            {description && <p className="md-modal__desc">{description}</p>}
          </div>
          <button type="button" className="md-modal__close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        {children && <div className="md-modal__body">{children}</div>}
        {footer && <div className="md-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drawer (side panel)
// ---------------------------------------------------------------------------
export function Drawer({ open, onClose, title, children, footer, side = "right", width = 420 }: { open: boolean; onClose: () => void; title?: ReactNode; children?: ReactNode; footer?: ReactNode; side?: "left" | "right"; width?: number }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="md-overlay md-overlay--drawer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" className={cx("md-drawer", `md-drawer--${side}`)} style={{ width: `min(${width}px, 100vw)` }}>
        <div className="md-modal__header">
          <div className="md-modal__titles">{title && <h2 className="md-modal__title">{title}</h2>}</div>
          <button type="button" className="md-modal__close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="md-drawer__body">{children}</div>
        {footer && <div className="md-modal__footer">{footer}</div>}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popover & Menu (dropdown)
// ---------------------------------------------------------------------------
function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);
  return ref;
}

export function Popover({ trigger, children, align = "start", width = 280 }: { trigger: (props: { onClick: () => void; "aria-expanded": boolean }) => ReactNode; children: ReactNode; align?: "start" | "end"; width?: number }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useOutside(open, close);
  useEscape(open, close);
  return (
    <div ref={ref} className="md-popover-anchor">
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open })}
      {open && (
        <div className={cx("md-popover", `md-popover--${align}`)} style={{ width }}>
          {children}
        </div>
      )}
    </div>
  );
}

export type MenuItem =
  | { type?: "item"; label: ReactNode; icon?: IconName; shortcut?: string; danger?: boolean; disabled?: boolean; onSelect?: () => void }
  | { type: "divider" }
  | { type: "label"; label: ReactNode };

export function Menu({ trigger, items, align = "start" }: { trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-haspopup": "menu" }) => ReactNode; items: MenuItem[]; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useOutside(open, close);
  useEscape(open, close);
  return (
    <div ref={ref} className="md-popover-anchor">
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-haspopup": "menu" })}
      {open && (
        <div role="menu" className={cx("md-popover", "md-menu", `md-popover--${align}`)}>
          {items.map((it, i) => {
            if (it.type === "divider") return <div key={i} className="md-menu__divider" role="separator" />;
            if (it.type === "label") return <div key={i} className="md-menu__label">{it.label}</div>;
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                className={cx("md-menu__item", it.danger && "md-menu__item--danger")}
                onClick={() => (it.onSelect?.(), close())}
              >
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
