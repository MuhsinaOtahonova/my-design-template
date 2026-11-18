import type { Preview } from "@storybook/react";
import { Scene } from "@my-design/ui-web";
import "@my-design/ui-web/styles.css";

const preview: Preview = {
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  decorators: [
    (Story) => (
      <Scene style={{ padding: 48, minHeight: "100vh", boxSizing: "border-box" }}>
        <Story />
      </Scene>
    ),
  ],
};
export default preview;
