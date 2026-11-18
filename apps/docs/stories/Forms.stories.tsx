import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, FileUpload, Input, Radio, RadioGroup, RangeSlider, SegmentedControl, Select, Slider, Switch, Textarea } from "@my-design/ui-web";

const meta: Meta = { title: "Forms/All fields" };
export default meta;

const grid = { display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", maxWidth: 900 } as const;

export const TextFields: StoryObj = {
  render: () => (
    <div style={grid}>
      <Input label="Full name" placeholder="Ayşe Demir" required />
      <Input label="Email" type="email" icon="mail" hint="Use your work email." />
      <Input label="Password" type="password" />
      <Input label="IBAN" defaultValue="TR12" error="IBAN must be 26 characters" />
      <Select label="Department" options={["Finance", "Sales", "IT"]} placeholder="Choose…" />
      <Textarea label="Notes" maxLength={200} showCount />
    </div>
  ),
};

export const Selection: StoryObj = {
  render: () => (
    <div style={grid}>
      <Checkbox label="Remember me" defaultChecked />
      <Switch label="Email notifications" defaultChecked />
      <RadioGroup label="Plan" defaultValue="team">
        <Radio value="solo" label="Solo" />
        <Radio value="team" label="Team" />
      </RadioGroup>
      <SegmentedControl options={[{ value: "d", label: "Day" }, { value: "w", label: "Week" }]} />
      <Slider label="Budget" defaultValue={60} format={(v) => `${v}%`} />
      <RangeSlider label="Salary" min={30} max={200} defaultValue={[60, 140]} />
    </div>
  ),
};

export const Upload: StoryObj = { render: () => <div style={{ maxWidth: 480 }}><FileUpload label="Attachments" /></div> };
