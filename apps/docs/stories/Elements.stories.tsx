import type { Meta, StoryObj } from "@storybook/react";
import { GlassPanel, Heading, Input, Orb, Progress, Text } from "@my-design/ui-web";

const meta: Meta = { title: "Components/Elements" };
export default meta;

export const Typography: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Heading level={1}>Display One</Heading>
      <Heading level={2}>Display Two</Heading>
      <Heading level={3}>Heading Three</Heading>
      <Heading level={4}>Label Four</Heading>
      <Text>Body text in Jost Light. Calm, airy and easy to read.</Text>
      <Text muted>Muted body text for secondary information.</Text>
    </div>
  ),
};

export const Routine: StoryObj = {
  render: () => (
    <GlassPanel tone="dark" style={{ maxWidth: 380, display: "grid", gap: 18 }}>
      <Heading level={3}>My Routine</Heading>
      <Progress label="Hydration" value={72} />
      <Progress label="Progress" value={48} />
      <Progress label="Balance" value={86} />
    </GlassPanel>
  ),
};

export const Field: StoryObj = {
  render: () => (
    <GlassPanel style={{ maxWidth: 380 }}>
      <Input label="Email" placeholder="you@example.com" />
    </GlassPanel>
  ),
};

export const Orbs: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Orb size={120} />
      <Orb size={80} variant="pearl" />
      <Orb size={60} variant="rose" />
    </div>
  ),
};
