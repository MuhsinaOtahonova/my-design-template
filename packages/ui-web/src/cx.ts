/** Joins class names, skipping falsy values. */
export const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string" && p !== "").join(" ");
