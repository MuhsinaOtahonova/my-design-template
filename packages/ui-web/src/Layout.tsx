import type { CSSProperties, HTMLAttributes } from "react";
import { spacing } from "@my-design/tokens";
import { cx } from "./cx";

type Space = keyof typeof spacing;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap on the 4px grid (token key) */
  gap?: Space;
  direction?: "column" | "row";
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
}

/** Flex column (or row) with a token gap. */
export function Stack({ gap = 4, direction = "column", align, justify, wrap, className, style, ...rest }: StackProps) {
  return (
    <div
      className={cx("md-stack", className)}
      style={{
        display: "flex",
        flexDirection: direction,
        gap: spacing[gap],
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}

/** Row of items that wraps, centered vertically. */
export const Inline = (props: Omit<StackProps, "direction">) => <Stack direction="row" align="center" wrap gap={3} {...props} />;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Minimum column width; columns auto-fill the row */
  min?: number;
  columns?: number;
  gap?: Space;
}

export function Grid({ min = 240, columns, gap = 4, className, style, ...rest }: GridProps) {
  return (
    <div
      className={cx("md-grid", className)}
      style={{
        display: "grid",
        gap: spacing[gap],
        gridTemplateColumns: columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`,
        ...style,
      }}
      {...rest}
    />
  );
}

export function Container({ className, size = "lg", ...rest }: HTMLAttributes<HTMLDivElement> & { size?: "md" | "lg" | "xl" }) {
  return <div className={cx("md-container", `md-container--${size}`, className)} {...rest} />;
}

export function Divider({ label, vertical, className }: { label?: string; vertical?: boolean; className?: string }) {
  if (vertical) return <span role="separator" aria-orientation="vertical" className={cx("md-divider--v", className)} />;
  if (label)
    return (
      <div role="separator" className={cx("md-divider md-divider--label", className)}>
        <span>{label}</span>
      </div>
    );
  return <hr className={cx("md-divider", className)} />;
}
