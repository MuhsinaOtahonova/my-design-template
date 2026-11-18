import type { Meta, StoryObj } from "@storybook/react";
import { palette, radii, spacing } from "@my-design/tokens";
import { GlassPanel, Heading, Text } from "@my-design/ui-web";

const meta: Meta = { title: "Foundations/Tokens" };
export default meta;

export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {Object.entries(palette).filter(([, v]) => typeof v === "object").map(([name, shades]) => (
        <GlassPanel key={name} padding="md">
          <Heading level={4} style={{ marginBottom: 12 }}>{name}</Heading>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Object.entries(shades as Record<string, string>).map(([k, hex]) => (
              <div key={k} style={{ textAlign: "center", fontSize: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: hex, border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 6px 14px rgba(0,0,0,.12)" }} />
                <div>{k}</div><div style={{ opacity: 0.7 }}>{hex}</div>
              </div>
            ))}
          </div>
        </GlassPanel>
      ))}
    </div>
  ),
};

export const RadiiAndSpacing: StoryObj = {
  render: () => (
    <GlassPanel style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(radii).map(([k, r]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: Math.min(r, 36), background: "rgba(255,255,255,.35)", border: "1px solid rgba(255,255,255,.7)" }} />
            <Text muted>{k} · {r}</Text>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {Object.entries(spacing).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ width: 40, fontSize: 12 }}>{k}</span>
            <span style={{ height: 10, width: v, borderRadius: 999, background: palette.rose[300] }} />
            <span style={{ fontSize: 12, opacity: 0.7 }}>{v}px</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  ),
};
