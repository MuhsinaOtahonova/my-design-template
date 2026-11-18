import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonGroup, IconButton } from "@my-design/ui-web";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Save changes", variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "outline", "ghost", "danger", "link"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline", children: "Cancel" } };
export const WithIcon: Story = { args: { icon: "plus", children: "New request" } };
export const Loading: Story = { args: { loading: true, children: "Saving" } };
export const All: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" icon="trash">Delete</Button>
      <IconButton icon="bell" label="Notifications" badge={3} variant="outline" />
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
    </div>
  ),
};
