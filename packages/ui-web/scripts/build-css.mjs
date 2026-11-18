// dist/styles.css = token variables + component styles, so apps import one file
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve("@my-design/tokens/css"), "utf8");
const componentsCss = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
writeFileSync(new URL("../dist/styles.css", import.meta.url), `${tokensCss}\n${componentsCss}`);
console.log("styles.css written");
