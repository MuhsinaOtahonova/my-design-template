import type { HTMLAttributes } from "react";
import { cx } from "./cx";

/** Full-page dusk-to-sand background that the glass floats on */
export function Scene({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("md-scene", className)} {...rest} />;
}
