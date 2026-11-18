import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@my-design/ui-web/styles.css";
import "./showcase.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
