import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider } from "@my-design/ui-web";
import "@my-design/ui-web/styles.css";
import "./app.css";
import { App } from "./App";
import { loadTheme } from "./store";

document.body.classList.add("md-root");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={loadTheme()}>
      <ToastProvider position="bottom-center">
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
