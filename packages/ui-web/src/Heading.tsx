import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  /** Thin, wide, uppercase display style */
  display?: boolean;
}

export function Heading({ level = 2, display = level <= 2, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cx("md-heading", `md-heading--${level}`, display && "md-heading--display", className)} {...rest} />;
}

export function Text({ className, muted, ...rest }: HTMLAttributes<HTMLParagraphElement> & { muted?: boolean }) {
  return <p className={cx("md-text", muted && "md-text--muted", className)} {...rest} />;
}
