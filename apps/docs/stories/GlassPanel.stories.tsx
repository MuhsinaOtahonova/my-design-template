import type { Meta, StoryObj } from "@storybook/react";
import { Button, GlassPanel, Heading, Text } from "@my-design/ui-web";

const meta: Meta<typeof GlassPanel> = {
  title: "Components/GlassPanel",
  component: GlassPanel,
  args: { tone: "dark", elevation: "md", tilt: true, drip: true, padding: "lg" },
  argTypes: { tone: { control: "inline-radio", options: ["light", "dark"] }, elevation: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  render: (args) => (
    <GlassPanel {...args} style={{ maxWidth: 520, display: "grid", gap: 16 }}>
      <Heading level={1}>Glass Panel</Heading>
      <Text muted>Frosted, floating and slightly melting at the edge.</Text>
      <Button drip>Discover</Button>
    </GlassPanel>
  ),
};
export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Dark: Story = {};
export const Light: Story = { args: { tone: "light" } };
export const NoDrip: Story = { args: { drip: false } };
