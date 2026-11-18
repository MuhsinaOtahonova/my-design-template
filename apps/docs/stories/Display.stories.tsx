import type { Meta, StoryObj } from "@storybook/react";
import { Alert, Avatar, AvatarGroup, Badge, Card, CardHeader, ProfileCard, Progress, Stat, StatusBadge, Table, Tabs, Timeline, UserCell } from "@my-design/ui-web";

const meta: Meta = { title: "Data display/Examples" };
export default meta;

export const Cards: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
      <Stat label="Revenue" value="₺1.2M" delta="8%" icon="wallet" />
      <Stat label="Tickets" value="36" delta="12%" trend="down" icon="inbox" />
      <Card>
        <CardHeader title="Card title" subtitle="Subtitle" icon="briefcase" />
      </Card>
      <ProfileCard name="Ayşe Demir" title="Senior Accountant" department="Finance" status="online" details={[{ icon: "mail", value: "ayse@company.com" }]} />
    </div>
  ),
};

export const PeopleAndBadges: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge tone="primary">Primary</Badge>
        <StatusBadge status="approved" />
        <StatusBadge status="pending" />
        <StatusBadge status="rejected" />
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Avatar name="Ayşe Demir" size="lg" status="online" />
        <AvatarGroup names={["A B", "C D", "E F", "G H", "I J"]} />
        <UserCell name="Mehmet Kaya" detail="Product Manager" />
      </div>
    </div>
  ),
};

export const TableStory: StoryObj = {
  name: "Table",
  render: () => (
    <Table
      selectable
      rowKey={(r) => r.id}
      rows={[
        { id: "1", name: "Ayşe Demir", team: "Finance" },
        { id: "2", name: "Mehmet Kaya", team: "Product" },
      ]}
      columns={[
        { key: "name", header: "Name", render: (r) => <UserCell name={r.name} />, sortValue: (r) => r.name },
        { key: "team", header: "Team" },
      ]}
    />
  ),
};

export const Feedback: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
      <Alert tone="success" title="Saved">Your changes were saved.</Alert>
      <Alert tone="warning" title="Expiring">Password expires in 3 days.</Alert>
      <Progress label="Upload" value={64} />
      <Tabs items={[{ value: "a", label: "Overview" }, { value: "b", label: "Files", count: 3 }]} />
      <Timeline items={[{ title: "Approved", time: "09:40", tone: "success", icon: "check" }, { title: "Submitted", time: "Mon" }]} />
    </div>
  ),
};
