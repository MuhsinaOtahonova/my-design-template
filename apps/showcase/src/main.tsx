import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider } from "@my-design/ui-web";
import "@my-design/ui-web/styles.css";
import "./showcase.css";
import { App } from "./App";

const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
document.body.classList.add("md-root");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={new URLSearchParams(location.search).get("theme") === "dark" || prefersDark ? "dark" : "light"}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
