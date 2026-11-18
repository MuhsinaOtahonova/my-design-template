import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@my-design/ui-web";

const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: { children: "Discover", variant: "glass", size: "md", drip: false },
  argTypes: { variant: { control: "inline-radio", options: ["glass", "solid", "ghost"] }, size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Glass: Story = {};
export const Solid: Story = { args: { variant: "solid", children: "Subscribe" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Learn more" } };
export const Melting: Story = { args: { drip: true } };
export const WithIcon: Story = { args: { icon: <Pin />, children: "Destinations", drip: true } };
export const All: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button>Glass</Button>
      <Button variant="solid">Solid</Button>
      <Button variant="ghost">Ghost</Button>
      <Button drip>Melting</Button>
      <Button icon={<Pin />} size="lg" drip>Destinations</Button>
    </div>
  ),
};
