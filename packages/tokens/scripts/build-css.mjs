// Turns the TS tokens into CSS custom properties: dist/tokens.css
//   :root                  light theme + every scale
//   [data-theme="dark"]    dark theme overrides
// Colors derived from the brand scale are written as var(--md-brand-*) so the
// brand can also be swapped at runtime by setting the --md-brand-* variables.
import { writeFileSync } from "node:fs";
import { tokens } from "../dist/index.js";

const px = (v) => (typeof v === "number" ? `${v}px` : v);
const brand = tokens.palette.brand;

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
};
const brandRef = (value) => {
  for (const [k, hex] of Object.entries(brand)) {
    if (value.toUpperCase() === hex) return `var(--md-brand-${k})`;
    const m = value.match(/^rgba\((\d+, \d+, \d+), ([\d.]+)\)$/);
    if (m && m[1] === hexToRgb(hex)) return `color-mix(in srgb, var(--md-brand-${k}) ${Math.round(m[2] * 100)}%, transparent)`;
  }
  return value;
};

const root = [];
const add = (name, value) => root.push(`  --md-${name}: ${value};`);

for (const [hue, shades] of Object.entries(tokens.palette)) {
  if (typeof shades === "string") add(hue, shades);
  else for (const [k, v] of Object.entries(shades)) add(`${hue}-${k}`, v);
}
for (const [k, v] of Object.entries(tokens.colors)) add(`color-${k}`, brandRef(v));
tokens.dataColors.forEach((v, i) => add(`data-${i + 1}`, brandRef(v)));
for (const [k, v] of Object.entries(tokens.typography.fontFamily)) add(`font-${k}`, v);
for (const [k, v] of Object.entries(tokens.typography.fontWeight)) add(`weight-${k}`, v);
for (const [k, v] of Object.entries(tokens.typography.fontSize)) add(`text-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.spacing)) add(`space-${String(k).replace(".", "_")}`, px(v));
for (const [k, v] of Object.entries(tokens.radii)) add(`radius-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.shadows)) add(`shadow-${k}`, v);
for (const [k, v] of Object.entries(tokens.sizes.control)) add(`control-${k}`, px(v));
add("sidebar", px(tokens.sizes.sidebar));
add("topbar", px(tokens.sizes.topbar));
for (const [k, v] of Object.entries(tokens.zIndex)) add(`z-${k}`, v);
for (const [k, v] of Object.entries(tokens.motion.duration)) add(`duration-${k}`, `${v}ms`);
for (const [k, v] of Object.entries(tokens.motion.easing)) add(`ease-${k}`, v);

const dark = Object.entries(tokens.darkColors).map(([k, v]) => `  --md-color-${k}: ${brandRef(v)};`);

writeFileSync(
  new URL("../dist/tokens.css", import.meta.url),
  `/* Generated from src/index.ts — do not edit by hand */\n:root {\n${root.join("\n")}\n  color-scheme: light;\n}\n\n[data-theme="dark"] {\n${dark.join("\n")}\n  --md-data-1: var(--md-brand-400);
  --md-shadow-sm: 0 1px 2px rgba(0,0,0,.4);\n  --md-shadow-md: 0 4px 12px rgba(0,0,0,.45);\n  --md-shadow-lg: 0 12px 32px rgba(0,0,0,.5);\n  --md-shadow-xl: 0 24px 56px rgba(0,0,0,.6);\n  color-scheme: dark;\n}\n`,
);
console.log(`tokens.css: ${root.length + dark.length} variables`);
