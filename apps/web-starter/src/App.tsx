import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  BarChart,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  CardFooter,
  CardHeader,
  Checkbox,
  DescriptionList,
  DonutChart,
  Drawer,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  Logo,
  Menu,
  Modal,
  NavItem,
  NavSection,
  Pagination,
  Progress,
  ProfileHeader,
  SearchInput,
  SegmentedControl,
  Select,
  Sidebar,
  Sparkline,
  Stat,
  StatusBadge,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Timeline,
  Topbar,
  UserCell,
  useTheme,
  useToast,
  type Column,
  AnimatedNumber,
  IconGrid,
  iconNames,
} from "@my-design/ui-web";

type Page = "dashboard" | "employees" | "profile" | "settings" | "icons";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "pending" | "inactive";
  joined: string;
}

const employees: Employee[] = [
  { id: "1", name: "Ayşe Demir", email: "ayse.demir@company.com", role: "Senior Accountant", department: "Finance", status: "active", joined: "2019-03-04" },
  { id: "2", name: "Mehmet Kaya", email: "mehmet.kaya@company.com", role: "Product Manager", department: "Product", status: "active", joined: "2020-07-15" },
  { id: "3", name: "Elif Şahin", email: "elif.sahin@company.com", role: "HR Specialist", department: "People", status: "pending", joined: "2024-10-01" },
  { id: "4", name: "Can Yılmaz", email: "can.yilmaz@company.com", role: "Frontend Engineer", department: "Engineering", status: "active", joined: "2021-01-11" },
  { id: "5", name: "Zeynep Ak", email: "zeynep.ak@company.com", role: "Sales Lead", department: "Sales", status: "inactive", joined: "2018-05-22" },
  { id: "6", name: "Ali Vural", email: "ali.vural@company.com", role: "IT Administrator", department: "IT", status: "active", joined: "2022-09-30" },
  { id: "7", name: "Selin Öztürk", email: "selin.ozturk@company.com", role: "Legal Counsel", department: "Legal", status: "active", joined: "2023-02-13" },
];

const columns: Column<Employee>[] = [
  { key: "name", header: "Name", render: (e) => <UserCell name={e.name} detail={e.email} />, sortValue: (e) => e.name },
  { key: "role", header: "Role", sortValue: (e) => e.role },
  { key: "department", header: "Department", sortValue: (e) => e.department },
  { key: "status", header: "Status", render: (e) => <StatusBadge status={e.status} /> },
  { key: "joined", header: "Joined", sortValue: (e) => e.joined, render: (e) => new Date(e.joined).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
  {
    key: "actions",
    header: "",
    align: "right",
    render: () => (
      <Menu
        align="end"
        trigger={(p) => <IconButton {...p} icon="more" label="Actions" size="sm" />}
        items={[{ label: "View profile", icon: "user" }, { label: "Edit", icon: "edit" }, { type: "divider" }, { label: "Deactivate", icon: "trash", danger: true }]}
      />
    ),
  },
];

export function App() {
  const [page, setPage] = useState<Page>(() => (window.location.hash.slice(1) as Page) || "dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  const nav = (
    <>
      <NavSection title="Workspace">
        <NavItem icon="dashboard" label="Dashboard" active={page === "dashboard"} onClick={() => (setPage("dashboard"), setMenuOpen(false))} />
        <NavItem icon="users" label="Employees" count={employees.length} active={page === "employees"} onClick={() => (setPage("employees"), setMenuOpen(false))} />
        <NavItem icon="inbox" label="Requests" count={4} />
        <NavItem icon="folder" label="Documents" />
        <NavItem icon="calendar" label="Calendar" />
        <NavItem icon="chart" label="Reports" />
      </NavSection>
      <NavSection title="Design">
        <NavItem icon="grid" label="Icons" count={iconNames.length} active={page === "icons"} onClick={() => (setPage("icons"), setMenuOpen(false))} />
      </NavSection>
      <NavSection title="Account">
        <NavItem icon="user" label="My profile" active={page === "profile"} onClick={() => (setPage("profile"), setMenuOpen(false))} />
        <NavItem icon="settings" label="Settings" active={page === "settings"} onClick={() => (setPage("settings"), setMenuOpen(false))} />
      </NavSection>
    </>
  );
  const sidebarFooter = <UserCell name="Ayşe Demir" detail="Finance · Admin" status="online" />;

  return (
    <div className="app">
      <Sidebar className="app__sidebar" header={<Logo name="Workplace" short="WP" />} footer={sidebarFooter}>
        {nav}
      </Sidebar>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" width={280} title={<Logo name="Workplace" short="WP" />}>
        <div className="app__drawer-nav">{nav}</div>
      </Drawer>

      <div className="app__main">
        <Topbar
          left={
            <>
              <IconButton className="app__menu" icon="menu" label="Open menu" onClick={() => setMenuOpen(true)} />
              <div className="app__search"><SearchInput shortcut="⌘K" size="sm" /></div>
            </>
          }
          right={
            <>
              <IconButton icon={theme === "light" ? "moon" : "sun"} label={theme === "light" ? "Night mode" : "Day mode"} onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
              <IconButton icon="help" label="Help" />
              <IconButton icon="bell" label="Notifications" badge={3} />
              <Menu
                align="end"
                trigger={(p) => (
                  <button {...p} className="app__avatar" aria-label="Account menu">
                    <Avatar name="Ayşe Demir" size="sm" />
                  </button>
                )}
                items={[
                  { type: "label", label: "ayse.demir@company.com" },
                  { label: "My profile", icon: "user", onSelect: () => setPage("profile") },
                  { label: "Settings", icon: "settings", onSelect: () => setPage("settings") },
                  { type: "divider" },
                  { label: "Sign out", icon: "logout", danger: true },
                ]}
              />
            </>
          }
        />
        <main key={page} className="app__content md-page">
          {page === "dashboard" && <Dashboard go={setPage} />}
          {page === "employees" && <Employees />}
          {page === "profile" && <Profile />}
          {page === "settings" && <Settings />}
          {page === "icons" && <Icons />}
        </main>
      </div>
    </div>
  );
}

function Icons() {
  const [q, setQ] = useState("");
  const toast = useToast();
  const names = iconNames.filter((n) => n.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <PageHeader title="Icons" crumbs={["Home", "Design", "Icons"]} subtitle={`${iconNames.length} line icons shared by web and mobile. Click one to copy its code.`} />
      <Card>
        <div className="md-card__body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input size="sm" icon="search" placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} clearable onClear={() => setQ("")} />
          {names.length ? (
            <IconGrid
              names={names}
              min={88}
              onSelect={(n) => {
                navigator.clipboard?.writeText(`<Icon name="${n}" />`).catch(() => {});
                toast({ tone: "success", title: "Copied", description: `<Icon name="${n}" />` });
              }}
            />
          ) : (
            <Text tone="muted">No icon matches “{q}”.</Text>
          )}
        </div>
      </Card>
    </>
  );
}

function PageHeader({ title, crumbs, subtitle, actions }: { title: string; crumbs: string[]; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <Breadcrumbs items={crumbs.map((c, i) => ({ label: c, href: i < crumbs.length - 1 ? "#" : undefined }))} />
        <h1 className="md-heading md-heading--3 page-header__title">{title}</h1>
        {subtitle && <Text tone="muted">{subtitle}</Text>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

function Dashboard({ go }: { go: (p: Page) => void }) {
  const toast = useToast();
  const [range, setRange] = useState("month");
  return (
    <>
      <PageHeader
        title="Good morning, Ayşe"
        subtitle="Here is what is happening across your teams today."
        crumbs={["Home", "Dashboard"]}
        actions={
          <>
            <SegmentedControl value={range} onChange={setRange} options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }]} aria-label="Range" />
            <Button icon="download" variant="outline">Export</Button>
            <Button icon="plus" onClick={() => toast({ tone: "success", title: "Report created", description: "Monthly report is ready to share." })}>New report</Button>
          </>
        }
      />
      <Alert tone="info" title="Year-end closing starts on 1 December" onClose={() => {}}>Please submit all open expense reports before 28 November.</Alert>
      <Grid min={200}>
        <Stat label="Headcount" value={<AnimatedNumber value={248} />} delta="4.2%" hint="vs last month" icon="users" />
        <Stat label="Open requests" value={<AnimatedNumber value={36} />} delta="12%" trend="down" hint="vs last month" icon="inbox" />
        <Stat label="Budget used" value={<AnimatedNumber value={68} suffix="%" />} delta="flat" trend="flat" hint="of ₺4.8M" icon="wallet" />
        <Stat label="Satisfaction" value={<AnimatedNumber value={4.6} decimals={1} />} delta="0.3" hint="out of 5" icon="star" />
      </Grid>
      <div className="dash-grid">
        <Card className="dash-grid__wide">
          <CardHeader title="Expenses by month" subtitle="Planned vs actual, ₺ thousands" actions={<IconButton icon="more" label="More" size="sm" />} />
          <div className="md-card__body">
            <BarChart
              height={220}
              data={[
                { label: "Jun", value: 320, value2: 300 },
                { label: "Jul", value: 280, value2: 310 },
                { label: "Aug", value: 410, value2: 360 },
                { label: "Sep", value: 380, value2: 390 },
                { label: "Oct", value: 450, value2: 420 },
                { label: "Nov", value: 395, value2: 430 },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Headcount by team" />
          <div className="md-card__body">
            <DonutChart
              size={130}
              center={<div><strong style={{ fontSize: 20 }}>248</strong><div className="md-field__hint">people</div></div>}
              data={[{ label: "Engineering", value: 92 }, { label: "Sales", value: 54 }, { label: "Operations", value: 41 }, { label: "Finance", value: 33 }, { label: "People", value: 28 }]}
            />
          </div>
        </Card>
        <Card className="dash-grid__wide" padding="none">
          <div className="pad">
            <CardHeader title="Recent hires" subtitle="Last 90 days" actions={<Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("employees")}>View all</Button>} />
          </div>
          <Table rows={employees.slice(0, 4)} rowKey={(e) => e.id} columns={columns.filter((c) => ["name", "department", "status", "joined"].includes(c.key))} />
        </Card>
        <Card>
          <CardHeader title="Activity" />
          <div className="md-card__body">
            <Timeline
              items={[
                { title: "Contract signed", time: "09:40", description: "Acme Ltd. · Legal", tone: "success", icon: "check" },
                { title: "Invoice #1042 sent", time: "Yesterday", description: "Finance", tone: "primary", icon: "send" },
                { title: "Elif joined People team", time: "Mon", tone: "info", icon: "user" },
                { title: "Server maintenance", time: "Sun", description: "02:00 – 04:00", tone: "warning", icon: "alert" },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Projects" />
          <div className="md-card__body stack-16">
            <Progress label="Website redesign" value={72} />
            <Progress label="ERP migration" value={45} tone="warning" />
            <Progress label="Security audit" value={92} tone="success" />
          </div>
        </Card>
        <Card>
          <CardHeader title="Traffic" subtitle="Intranet visits this week" />
          <div className="md-card__body">
            <div className="spark-row"><strong className="md-stat__value">12.4k</strong><Sparkline values={[8, 9, 7, 11, 10, 13, 12.4]} width={140} height={48} /></div>
          </div>
        </Card>
        <Card padding="sm">
          <Calendar events={[new Date(), new Date(Date.now() + 2 * 864e5), new Date(Date.now() + 6 * 864e5)]} />
        </Card>
      </div>
    </>
  );
}

function Employees() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [invite, setInvite] = useState(false);
  const toast = useToast();
  const rows = employees.filter((e) => (tab === "all" || e.status === tab) && e.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Employees" crumbs={["Home", "People", "Employees"]} actions={<Button icon="plus" onClick={() => setInvite(true)}>Invite people</Button>} />
      <Card padding="none">
        <div className="table-toolbar">
          <Tabs variant="pills" value={tab} onChange={setTab} items={[{ value: "all", label: "All", count: employees.length }, { value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "inactive", label: "Inactive" }]} />
          <div className="table-toolbar__right">
            <Input size="sm" icon="search" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} clearable onClear={() => setQ("")} />
            <Button size="sm" variant="outline" icon="filter">Filters</Button>
          </div>
        </div>
        <Table selectable rows={rows} rowKey={(e) => e.id} columns={columns} />
        <div className="pad">
          <Pagination page={page} total={12} onChange={setPage} summary={`Showing 1–${rows.length} of 84`} />
        </div>
      </Card>
      <Modal
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite people"
        description="They will get an email with a link to join the workspace."
        footer={
          <>
            <Button variant="outline" onClick={() => setInvite(false)}>Cancel</Button>
            <Button icon="send" onClick={() => (setInvite(false), toast({ tone: "success", title: "Invitations sent" }))}>Send invites</Button>
          </>
        }
      >
        <div className="stack-16">
          <Input label="Email addresses" placeholder="name@company.com, …" icon="mail" />
          <Select label="Department" options={["Finance", "Engineering", "Sales", "People", "IT", "Legal"]} placeholder="Choose a department" />
          <Select label="Role" options={["Member", "Manager", "Admin"]} defaultValue="Member" />
        </div>
      </Modal>
    </>
  );
}

function Profile() {
  return (
    <>
      <ProfileHeader
        name="Ayşe Demir"
        title="Senior Accountant · Finance"
        meta={[{ icon: "mapPin", value: "Istanbul HQ" }, { icon: "mail", value: "ayse.demir@company.com" }, { icon: "calendar", value: "Joined March 2019" }]}
        actions={<><Button variant="outline" icon="message">Message</Button><Button icon="edit">Edit profile</Button></>}
      />
      <div className="dash-grid">
        <Card className="dash-grid__wide">
          <Tabs items={[{ value: "about", label: "About" }, { value: "team", label: "Team", count: 6 }, { value: "docs", label: "Documents" }]}>
            {(t) =>
              t === "about" ? (
                <DescriptionList
                  columns={2}
                  items={[
                    { label: "Employee ID", value: "FN-00412" },
                    { label: "Manager", value: <UserCell name="Mehmet Kaya" size="xs" /> },
                    { label: "Department", value: "Finance" },
                    { label: "Location", value: "Istanbul, Türkiye" },
                    { label: "Phone", value: "+90 212 555 01 23" },
                    { label: "Work hours", value: "09:00 – 18:00 (GMT+3)" },
                  ]}
                />
              ) : t === "team" ? (
                <List>
                  {employees.slice(1, 6).map((e) => (
                    <ListItem key={e.id} leading={<Avatar name={e.name} size="sm" />} title={e.name} description={e.role} trailing={<StatusBadge status={e.status} />} />
                  ))}
                </List>
              ) : (
                <List>
                  {["Employment contract.pdf", "Q3 performance review.docx", "Payroll 2026-10.pdf"].map((f) => (
                    <ListItem key={f} leading={<IconButton icon="file" label="File" variant="secondary" size="sm" />} title={f} description="Updated 2 weeks ago" trailing={<IconButton icon="download" label="Download" size="sm" />} />
                  ))}
                </List>
              )
            }
          </Tabs>
        </Card>
        <Card>
          <CardHeader title="Leave balance" />
          <div className="md-card__body stack-16">
            <Progress label="Annual · 14 of 20 days left" value={70} showValue={false} />
            <Progress label="Sick · 8 of 10 days left" value={80} showValue={false} tone="success" />
          </div>
        </Card>
      </div>
    </>
  );
}

function Settings() {
  const toast = useToast();
  return (
    <>
      <PageHeader title="Settings" crumbs={["Home", "Account", "Settings"]} />
      <Card className="settings">
        <CardHeader title="Personal information" subtitle="This is shown to your colleagues." />
        <div className="md-card__body settings__grid">
          <Input label="First name" defaultValue="Ayşe" />
          <Input label="Last name" defaultValue="Demir" />
          <Input label="Email" type="email" icon="mail" defaultValue="ayse.demir@company.com" hint="Used for sign-in and notifications." />
          <Input label="Phone" prefix="+90" defaultValue="212 555 01 23" />
          <Select label="Language" options={["English", "Türkçe", "Deutsch"]} defaultValue="English" />
          <Select label="Time zone" options={["(GMT+3) Istanbul", "(GMT+0) London", "(GMT+1) Berlin"]} />
          <Textarea className="settings__full" label="Bio" placeholder="A few words about you" maxLength={200} showCount defaultValue="" />
        </div>
        <CardFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast({ tone: "success", title: "Settings saved" })}>Save changes</Button>
        </CardFooter>
      </Card>
      <Card className="settings">
        <CardHeader title="Notifications" />
        <div className="md-card__body stack-16">
          <Switch defaultChecked label="Email notifications" description="Approvals, mentions and weekly summary" />
          <Switch label="Desktop notifications" description="Pop-ups while the app is open" />
          <Checkbox defaultChecked label="Send me a weekly summary" />
        </div>
      </Card>
      <Card className="settings">
        <CardHeader title="Danger zone" subtitle="Irreversible actions." />
        <div className="md-card__body"><Button variant="danger" icon="trash">Delete account</Button></div>
      </Card>
    </>
  );
}
