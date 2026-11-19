import type { CSSProperties, PointerEvent } from "react";
import type { IconName } from "@my-design/tokens";
import { Icon, iconNames } from "./Icon";
import { prefersReducedMotion } from "./Motion";
import { cx } from "./cx";

/** Max tilt in degrees. Kept small on purpose: depth you notice, motion you don't. */
const TILT = 9;

function reset(el: HTMLElement) {
  el.style.removeProperty("--rx");
  el.style.removeProperty("--ry");
}

/** One delegated handler tilts whichever tile is under a mouse pointer (touch and pen skip it). */
function onMove(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
  const el = (e.target as HTMLElement).closest<HTMLElement>(".md-icon-tile");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--rx", `${((0.5 - py) * TILT * 2).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((px - 0.5) * TILT * 2).toFixed(2)}deg`);
}
function onOut(e: PointerEvent<HTMLElement>) {
  const from = (e.target as HTMLElement).closest<HTMLElement>(".md-icon-tile");
  const to = (e.relatedTarget as HTMLElement | null)?.closest?.(".md-icon-tile");
  if (from && from !== to) reset(from);
}

export interface IconTileProps {
  name: IconName;
  /** Text under the icon. Defaults to the icon name. */
  label?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

/** A small 3D tile: soft depth, lifts gently on hover, the glyph floats a few px above the face. */
export function IconTile({ name, label = name, size = 20, onClick, className }: IconTileProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className={cx("md-icon-tile", className)} title={name} onClick={onClick}>
      <span className="md-icon-tile__glyph"><Icon name={name} size={size} /></span>
      <small className="md-icon-tile__label">{label}</small>
    </Tag>
  );
}

/** Responsive grid of 3D icon tiles. Columns follow the width, so it fits desktop, tablet and phone. */
export function IconGrid({ names = iconNames, size = 20, min = 96, onSelect, className, style }: { names?: IconName[]; size?: number; /** Minimum tile width in px */ min?: number; onSelect?: (name: IconName) => void; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cx("md-icon-grid", className)}
      style={{ ...style, ["--md-icon-min" as string]: `${min}px` }}
      onPointerMove={onMove}
      onPointerOut={onOut}
    >
      {names.map((n) => (
        <IconTile key={n} name={n} size={size} onClick={onSelect ? () => onSelect(n) : undefined} />
      ))}
    </div>
  );
}
