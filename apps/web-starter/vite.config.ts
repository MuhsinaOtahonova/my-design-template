import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build also works under a sub-path (GitHub Pages demo).
export default defineConfig({ base: "./", plugins: [react()] });
