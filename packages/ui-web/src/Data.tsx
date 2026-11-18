import { Children, useMemo, useRef, useState, type ReactNode } from "react";
import { dataColors } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { Checkbox } from "./Form";

// ---------------------------------------------------------------------------
// Table: columns + rows, optional sorting and row selection
// ---------------------------------------------------------------------------
export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Cell content; defaults to row[key] */
  render?: (row: T) => ReactNode;
  /** Value used for sorting; enables the sort button */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  width?: number | string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  onRowClick?: (row: T) => void;
  density?: "compact" | "normal";
  striped?: boolean;
  /** Shown when rows is empty */
  empty?: ReactNode;
  stickyHeader?: boolean;
}

export function Table<T>({ columns, rows, rowKey, selectable, selected, onSelectedChange, onRowClick, density = "normal", striped, empty, stickyHeader }: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [innerSel, setInnerSel] = useState<string[]>([]);
  const sel = selected ?? innerSel;
  const setSel = (k: string[]) => (setInnerSel(k), onSelectedChange?.(k));

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const x = col.sortValue!(a);
      const y = col.sortValue!(b);
      return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
    });
  }, [rows, sort, columns]);

  const allKeys = rows.map(rowKey);
  const allOn = allKeys.length > 0 && allKeys.every((k) => sel.includes(k));
  const someOn = !allOn && allKeys.some((k) => sel.includes(k));

  return (
    <div className={cx("md-table-wrap", stickyHeader && "md-table-wrap--sticky")}>
      <table className={cx("md-table", `md-table--${density}`, striped && "md-table--striped", onRowClick && "md-table--clickable")}>
        <thead>
          <tr>
            {selectable && (
              <th className="md-table__check">
                <Checkbox aria-label="Select all" checked={allOn} indeterminate={someOn} onChange={() => setSel(allOn ? [] : allKeys)} />
              </th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th key={c.key} style={{ width: c.width, textAlign: c.align }} aria-sort={active ? (sort!.dir === 1 ? "ascending" : "descending") : undefined}>
                  {c.sortValue ? (
                    <button
                      type="button"
                      className={cx("md-table__sort", active && "md-table__sort--active")}
                      onClick={() => setSort(active ? (sort!.dir === 1 ? { key: c.key, dir: -1 } : null) : { key: c.key, dir: 1 })}
                    >
                      {c.header}
                      <Icon name={active ? (sort!.dir === 1 ? "arrowUp" : "arrowDown") : "sort"} size={13} />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="md-table__empty">{empty ?? "No results"}</td>
            </tr>
          ) : (
            sorted.map((row) => {
              const k = rowKey(row);
              const on = sel.includes(k);
              return (
                <tr key={k} className={cx(on && "md-table__row--selected")} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {selectable && (
                    <td className="md-table__check" onClick={(e) => e.stopPropagation()}>
                      <Checkbox aria-label="Select row" checked={on} onChange={() => setSel(on ? sel.filter((x) => x !== k) : [...sel, k])} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} style={{ textAlign: c.align }}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendar / date picker (single date)
// ---------------------------------------------------------------------------
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();

export function Calendar({ value, onChange, events = [], defaultMonth }: { value?: Date | null; onChange?: (d: Date) => void; events?: Date[]; defaultMonth?: Date }) {
  const [inner, setInner] = useState<Date | null>(value ?? null);
  const selected = value ?? inner;
  const [month, setMonth] = useState(() => {
    const d = defaultMonth ?? selected ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = new Date();
  const offset = (month.getDay() + 6) % 7; // Monday first
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return (
    <div className="md-calendar">
      <div className="md-calendar__head">
        <button type="button" aria-label="Previous month" onClick={() => shift(-1)}><Icon name="chevronLeft" size={16} /></button>
        <span>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <button type="button" aria-label="Next month" onClick={() => shift(1)}><Icon name="chevronRight" size={16} /></button>
      </div>
      <div className="md-calendar__grid" role="grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="md-calendar__wd">{w}</span>
        ))}
        {cells.map((d, i) =>
          d ? (
            <button
              key={i}
              type="button"
              className={cx("md-calendar__day", sameDay(d, today) && "md-calendar__day--today", sameDay(d, selected) && "md-calendar__day--selected")}
              aria-pressed={sameDay(d, selected)}
              onClick={() => (setInner(d), onChange?.(d))}
            >
              {d.getDate()}
              {events.some((e) => sameDay(e, d)) && <span className="md-calendar__event" />}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel (content slider)
// ---------------------------------------------------------------------------
export function Carousel({ children, perView = 1, gap = 16 }: { children: ReactNode; perView?: number; gap?: number }) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const pages = Math.max(1, slides.length - perView + 1);
  const track = useRef<HTMLDivElement>(null);
  const go = (i: number) => setIndex(Math.max(0, Math.min(pages - 1, i)));
  return (
    <div className="md-carousel">
      <div className="md-carousel__viewport">
        <div
          ref={track}
          className="md-carousel__track"
          style={{ gap, transform: `translateX(calc(${-index} * (100% + ${gap}px) / ${perView}))` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="md-carousel__slide" style={{ flexBasis: `calc((100% - ${gap * (perView - 1)}px) / ${perView})` }} aria-hidden={i < index || i >= index + perView}>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="md-carousel__controls">
        <div className="md-carousel__dots">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
        <div className="md-carousel__arrows">
          <button type="button" aria-label="Previous" disabled={index === 0} onClick={() => go(index - 1)}><Icon name="chevronLeft" size={18} /></button>
          <button type="button" aria-label="Next" disabled={index >= pages - 1} onClick={() => go(index + 1)}><Icon name="chevronRight" size={18} /></button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Charts (lightweight SVG; swap for a chart library in real apps)
// ---------------------------------------------------------------------------
export function BarChart({ data, height = 180, format = String }: { data: Array<{ label: string; value: number; value2?: number }>; height?: number; format?: (v: number) => string }) {
  const max = Math.max(...data.flatMap((d) => [d.value, d.value2 ?? 0])) || 1;
  const twin = data.some((d) => d.value2 != null);
  return (
    <div className="md-barchart" style={{ height }}>
      {[1, 0.5, 0].map((g) => (
        <div key={g} className="md-barchart__grid" style={{ bottom: `calc(${g * 100}% * (1 - 22 / ${height}) + 22px)` }}>
          <span>{format(Math.round(max * g))}</span>
        </div>
      ))}
      <div className="md-barchart__bars">
        {data.map((d) => (
          <div key={d.label} className="md-barchart__col">
            <div className="md-barchart__pair">
              <span className="md-barchart__bar" style={{ height: `${(d.value / max) * 100}%` }} title={`${d.label}: ${format(d.value)}`} />
              {twin && <span className="md-barchart__bar md-barchart__bar--2" style={{ height: `${((d.value2 ?? 0) / max) * 100}%` }} title={`${d.label}: ${format(d.value2 ?? 0)}`} />}
            </div>
            <span className="md-barchart__label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ values, width = 120, height = 36, area = true }: { values: number[]; width?: number; height?: number; area?: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - 2 - ((v - min) / (max - min || 1)) * (height - 4)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]!.toFixed(1)} ${p[1]!.toFixed(1)}`).join(" ");
  return (
    <svg className="md-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {area && <path d={`${line} L${width} ${height} L0 ${height} Z`} className="md-sparkline__area" />}
      <path d={line} className="md-sparkline__line" />
    </svg>
  );
}

export function DonutChart({ data, size = 140, thickness = 18, center }: { data: Array<{ label: string; value: number }>; size?: number; thickness?: number; center?: ReactNode }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="md-donut">
      <div className="md-donut__chart" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="md-ring__track" />
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const el = <circle key={d.label} cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} stroke={`var(--md-data-${(i % dataColors.length) + 1})`} strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-acc} />;
            acc += len;
            return el;
          })}
        </svg>
        {center && <div className="md-donut__center">{center}</div>}
      </div>
      <ul className="md-legend">
        {data.map((d, i) => (
          <li key={d.label}>
            <span className="md-legend__swatch" style={{ background: `var(--md-data-${(i % dataColors.length) + 1})` }} />
            <span>{d.label}</span>
            <strong>{Math.round((d.value / total) * 100)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
