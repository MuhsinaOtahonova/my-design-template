import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, if it should differ from the semantic level */
  size?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 2, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cx("md-heading", `md-heading--${size ?? level}`, className)} {...rest} />;
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "default" | "secondary" | "muted" | "primary" | "success" | "warning" | "danger";
  weight?: "regular" | "medium" | "semibold" | "bold";
  as?: "p" | "span" | "div" | "label" | "small";
  truncate?: boolean;
}

export function Text({ size = "md", tone = "default", weight, as: Tag = "p", truncate, className, ...rest }: TextProps) {
  return (
    <Tag
      className={cx(
        "md-text",
        `md-text--${size}`,
        tone !== "default" && `md-tone--${tone}`,
        weight && `md-weight--${weight}`,
        truncate && "md-truncate",
        className,
      )}
      {...rest}
    />
  );
}

/** Small uppercase label above groups, e.g. in sidebars and forms. */
export function Overline({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("md-overline", className)} {...rest} />;
}

export function Link({ className, external, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  return (
    <a
      className={cx("md-link", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external && <span aria-hidden> ↗</span>}
    </a>
  );
}

export function Code({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <code className={cx("md-code", className)} {...rest} />;
}

export function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre className={cx("md-codeblock", className)}>
      <code>{children}</code>
    </pre>
  );
}

export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cx("md-kbd", className)} {...rest} />;
}
