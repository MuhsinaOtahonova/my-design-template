import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider } from "@my-design/ui-web";
import "@my-design/ui-web/styles.css";
import "./app.css";
import { App } from "./App";

// ?theme=dark and ?brand=%23RRGGBB let the demo site preview other looks
const params = new URLSearchParams(window.location.search);
const theme = params.get("theme") === "dark" ? "dark" : "light";
const brand = params.get("brand") ?? undefined;

document.body.classList.add("md-root");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={theme} brand={brand}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
