import { cx } from "./cx";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

/** Glowing rose track, like the "My Routine" sliders */
export function Progress({ value, max = 100, label, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx("md-progress", className)}>
      {label && <span className="md-progress__label">{label}</span>}
      <div className="md-progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div className="md-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
