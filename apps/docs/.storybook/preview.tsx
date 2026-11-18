import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import { ToastProvider } from "@my-design/ui-web";
import "@my-design/ui-web/styles.css";

const preview: Preview = {
  parameters: { layout: "padded", backgrounds: { disable: true } },
  globalTypes: {
    theme: {
      description: "Day / night theme",
      toolbar: { title: "Theme", icon: "mirror", items: [{ value: "light", title: "Day" }, { value: "dark", title: "Night" }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme ?? "light";
      useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.body.classList.add("md-root");
      }, [theme]);
      return (
        <ToastProvider>
          <div style={{ padding: 24 }}>
            <Story />
          </div>
        </ToastProvider>
      );
    },
  ],
};
export default preview;
