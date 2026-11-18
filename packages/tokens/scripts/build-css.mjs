// Turns the TS tokens into CSS custom properties: dist/tokens.css
import { writeFileSync } from "node:fs";
import { tokens } from "../dist/index.js";

const px = (v) => (typeof v === "number" ? `${v}px` : v);
const lines = [];
const add = (name, value) => lines.push(`  --md-${name}: ${value};`);

for (const [hue, shades] of Object.entries(tokens.palette)) {
  if (typeof shades === "string") add(`${hue}`, shades);
  else for (const [k, v] of Object.entries(shades)) add(`${hue}-${k}`, v);
}
for (const [k, v] of Object.entries(tokens.colors)) add(`color-${k}`, v);
for (const [k, v] of Object.entries(tokens.gradients)) add(`gradient-${k}`, v);
for (const [k, v] of Object.entries(tokens.typography.fontFamily)) add(`font-${k}`, v);
for (const [k, v] of Object.entries(tokens.typography.fontWeight)) add(`weight-${k}`, v);
for (const [k, v] of Object.entries(tokens.typography.fontSize)) add(`text-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.typography.letterSpacing)) add(`tracking-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.spacing)) add(`space-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.radii)) add(`radius-${k}`, px(v));
for (const [k, v] of Object.entries(tokens.shadows)) add(`shadow-${k}`, v);
add("glass-blur", px(tokens.glass.blur));
add("glass-saturate", tokens.glass.saturate);
for (const [k, v] of Object.entries(tokens.motion.duration)) add(`duration-${k}`, `${v}ms`);
for (const [k, v] of Object.entries(tokens.motion.easing)) add(`ease-${k}`, v);

writeFileSync(
  new URL("../dist/tokens.css", import.meta.url),
  `/* Generated from src/index.ts — do not edit by hand */\n:root {\n${lines.join("\n")}\n}\n`,
);
console.log(`tokens.css: ${lines.length} variables`);
