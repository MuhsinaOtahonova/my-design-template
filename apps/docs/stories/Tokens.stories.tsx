import type { Meta, StoryObj } from "@storybook/react";
import { BRAND, palette } from "@my-design/tokens";
import { Code, Heading, Text } from "@my-design/ui-web";

const meta: Meta = { title: "Foundations/Colors" };
export default meta;

export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <Text>Brand color: <Code>{BRAND}</Code> (edit BRAND in packages/tokens/src/index.ts)</Text>
      {(["brand", "gray"] as const).map((name) => (
        <div key={name}>
          <Heading level={6} style={{ marginBottom: 8 }}>{name}</Heading>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Object.entries(palette[name]).map(([k, hex]) => (
              <div key={k} style={{ textAlign: "center", fontSize: 12 }}>
                <div style={{ width: 64, height: 56, borderRadius: 8, background: hex, border: "1px solid var(--md-color-border)" }} />
                <div>{k}</div>
                <div style={{ opacity: 0.6 }}>{hex}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
