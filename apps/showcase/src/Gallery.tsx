import { useEffect, useState, type ReactNode } from "react";
import { BRAND, palette, radii, shadows, spacing } from "@my-design/tokens";
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  BottomNav,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardFooter,
  CardHeader,
  Carousel,
  Checkbox,
  CircularProgress,
  Code,
  CodeBlock,
  DescriptionList,
  Divider,
  DonutChart,
  Drawer,
  EmptyState,
  FileUpload,
  Heading,
  Icon,
  IconButton,
  iconNames,
  Input,
  Kbd,
  Link,
  List,
  ListItem,
  Logo,
  MediaCard,
  Menu,
  Modal,
  NavItem,
  NavSection,
  NumberInput,
  Overline,
  Pagination,
  PinInput,
  Popover,
  ProfileCard,
  ProfileHeader,
  Progress,
  Radio,
  RadioGroup,
  RangeSlider,
  SearchInput,
  SegmentedControl,
  Select,
  Sidebar,
  Skeleton,
  Slider,
  Sparkline,
  Spinner,
  Stat,
  StatusBadge,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Text,
  Textarea,
  Timeline,
  Toast,
  Tooltip,
  Topbar,
  UserCell,
  useToast,
  Blockquote,
  ChatComposer,
  ChatMessage,
  ChatThread,
  Combobox,
  CommandPalette,
  ContextMenu,
  DateRangeInput,
  HoverCard,
  InfoTip,
  Inline,
  Lightbox,
  MultiSelect,
  SelectableCards,
  StatusDot,
  TagInput,
  Timestamp,
  ToggleButton,
  Toolbar,
  ToolbarDivider,
  TreeList,
  useHotkey,
  type Column,
  type Command,
} from "@my-design/ui-web";
import { Col, Example, Group, Row } from "./blocks";
import { Hero } from "./Hero";
import { MotionGroup } from "./MotionGroup";

export const sections = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "foundations", label: "Foundations", icon: "layers" },
  { id: "buttons", label: "Buttons", icon: "zap" },
  { id: "motion", label: "Motion & 3D", icon: "layers" },
  { id: "forms", label: "Forms", icon: "edit" },
  { id: "selection", label: "Selection & sliders", icon: "check" },
  { id: "cards", label: "Cards & stats", icon: "grid" },
  { id: "data", label: "Data display", icon: "list" },
  { id: "table", label: "Tables", icon: "file" },
  { id: "profile", label: "Profile & people", icon: "user" },
  { id: "feedback", label: "Feedback", icon: "info" },
  { id: "overlays", label: "Overlays", icon: "copy" },
  { id: "navigation", label: "Navigation", icon: "menu" },
  { id: "shell", label: "App shell", icon: "dashboard" },
  { id: "date", label: "Calendar & carousel", icon: "calendar" },
  { id: "charts", label: "Charts", icon: "chart" },
  { id: "advanced", label: "Pickers & power tools", icon: "search" },
  { id: "chat", label: "Chat & media", icon: "message" },
  { id: "patterns", label: "Page patterns", icon: "briefcase" },
] as const;

// ---------------------------------------------------------------------------
// Data used by several demos
// ---------------------------------------------------------------------------
interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: "active" | "pending" | "inactive";
  salary: number;
}
const people: Person[] = [
  { id: "1", name: "Ayşe Demir", email: "ayse@company.com", role: "Senior Accountant", team: "Finance", status: "active", salary: 92000 },
  { id: "2", name: "Mehmet Kaya", email: "mehmet@company.com", role: "Product Manager", team: "Product", status: "active", salary: 105000 },
  { id: "3", name: "Elif Şahin", email: "elif@company.com", role: "HR Specialist", team: "People", status: "pending", salary: 68000 },
  { id: "4", name: "Can Yılmaz", email: "can@company.com", role: "Frontend Engineer", team: "Engineering", status: "active", salary: 98000 },
  { id: "5", name: "Zeynep Ak", email: "zeynep@company.com", role: "Sales Lead", team: "Sales", status: "inactive", salary: 87000 },
];
const money = (n: number) => `₺${n.toLocaleString("en-US")}`;
const personColumns: Column<Person>[] = [
  { key: "name", header: "Employee", render: (p) => <UserCell name={p.name} detail={p.email} />, sortValue: (p) => p.name },
  { key: "role", header: "Role", sortValue: (p) => p.role },
  { key: "team", header: "Team", render: (p) => <Tag>{p.team}</Tag> },
  { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  { key: "salary", header: "Salary", align: "right", sortValue: (p) => p.salary, render: (p) => money(p.salary) },
];

// ---------------------------------------------------------------------------
// The gallery
// ---------------------------------------------------------------------------
export function Gallery() {
  const toast = useToast();
  const [modal, setModal] = useState<null | "form" | "confirm">(null);
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(3);
  const [step, setStep] = useState(1);
  const [tags, setTags] = useState(["Finance", "Q4", "Urgent"]);
  const [filter, setFilter] = useState<string[]>(["Open"]);
  const [nav, setNav] = useState("home");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string>(sections[0].id);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [treeSel, setTreeSel] = useState("q4");
  const [chat, setChat] = useState([
    { author: "Mehmet Kaya", text: "Can you review the Q4 budget before the 15:00 meeting?", time: "10:42", own: false },
    { author: "You", text: "Sure. I'll leave my comments in the sheet.", time: "10:44", own: true },
    { author: "Zeynep Ak", text: "I added the travel costs to tab 3.", time: "10:51", own: false },
  ]);
  useHotkey("k", () => setCmdOpen(true));
  const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const commands: Command[] = [
    { id: "new", label: "New expense request", group: "Actions", icon: "plus", shortcut: "N", onSelect: () => toast({ tone: "success", title: "Draft request created" }) },
    { id: "theme", label: "Invite a colleague", group: "Actions", icon: "users", onSelect: () => toast({ title: "Invitation sent" }) },
    { id: "export", label: "Export table as CSV", group: "Actions", icon: "download", onSelect: () => toast({ title: "Export started" }) },
    ...sections.map((s) => ({ id: `go-${s.id}`, label: s.label, group: "Go to section", icon: s.icon, onSelect: go(s.id) })),
  ];

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="gallery">
      <aside className="gallery__nav">
        <Overline>Components</Overline>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#components/${s.id}`} className={active === s.id ? "is-active" : undefined} onClick={(e) => (e.preventDefault(), document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }))}>
                <Icon name={s.icon} size={16} />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="gallery__body">
        <Hero go={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} />
        {/* ------------------------------------------------------------ */}
        <Group id="foundations" title="Foundations" intro="Tokens live in packages/tokens. Change BRAND there and every color below, on web and mobile, follows.">
          <Example title="Brand scale" note={<>Generated from one color: <Code>BRAND = "{BRAND}"</Code>. 600 is the primary button color.</>}>
            <div className="swatches">
              {Object.entries(palette.brand).map(([k, hex]) => (
                <div key={k} className="swatch">
                  <div style={{ background: hex }} />
                  <strong>{k}</strong>
                  <small>{hex}</small>
                </div>
              ))}
            </div>
          </Example>
          <Example title="Neutrals & status colors">
            <Col>
              <div className="swatches">
                {Object.entries(palette.gray).map(([k, hex]) => (
                  <div key={k} className="swatch">
                    <div style={{ background: hex }} />
                    <strong>gray {k}</strong>
                    <small>{hex}</small>
                  </div>
                ))}
              </div>
              <div className="swatches">
                {(["green", "amber", "red", "sky"] as const).map((h) => (
                  <div key={h} className="swatch">
                    <div style={{ background: palette[h][600] }} />
                    <strong>{h === "green" ? "success" : h === "amber" ? "warning" : h === "red" ? "danger" : "info"}</strong>
                    <small>{palette[h][600]}</small>
                  </div>
                ))}
              </div>
            </Col>
          </Example>
          <Example title="Typography" note="Inter · 12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 36 px" code={`<Heading level={1}>Page title</Heading>\n<Text tone="muted" size="sm">Caption</Text>`}>
            <Col gap={10}>
              {([1, 2, 3, 4, 5, 6] as const).map((l) => (
                <Heading key={l} level={l}>Heading {l} · Quarterly report</Heading>
              ))}
              <Text size="lg">Large body text for introductions and empty states.</Text>
              <Text>Body text. The default size for tables, forms and most of the interface.</Text>
              <Text tone="secondary">Secondary text for supporting information.</Text>
              <Text size="sm" tone="muted">Small muted caption · Updated 5 minutes ago</Text>
              <Row>
                <Overline>Overline label</Overline>
                <Link href="#">Text link</Link>
                <Link href="https://example.com" external>External link</Link>
                <Code>inline code</Code>
                <span>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search</span>
              </Row>
            </Col>
          </Example>
          <Example title={`Icons (${iconNames.length})`} note={<>Shared by web and mobile: <Code>{'<Icon name="calendar" />'}</Code></>}>
            <div className="icons">
              {iconNames.map((n) => (
                <div key={n} className="icons__item" title={n}>
                  <Icon name={n} size={20} />
                  <small>{n}</small>
                </div>
              ))}
            </div>
          </Example>
          <Example title="Radii, spacing & shadows">
            <Col gap={24}>
              <Row gap={16}>
                {Object.entries(radii).map(([k, r]) => (
                  <div key={k} className="token-box">
                    <div style={{ borderRadius: Math.min(r, 32) }} />
                    <small>{k} · {r}px</small>
                  </div>
                ))}
              </Row>
              <Row gap={16}>
                {Object.entries(shadows).map(([k, v]) => (
                  <div key={k} className="token-box">
                    <div style={{ boxShadow: v, borderRadius: 8, background: "var(--md-color-surface)" }} />
                    <small>shadow {k}</small>
                  </div>
                ))}
              </Row>
              <Col gap={6}>
                {Object.entries(spacing).map(([k, v]) => (
                  <div key={k} className="space-row">
                    <small>{k}</small>
                    <span style={{ width: v }} />
                    <small>{v}px</small>
                  </div>
                ))}
              </Col>
            </Col>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="buttons" title="Buttons" intro="Primary for the main action on a screen, outline/secondary for the rest, ghost in toolbars, danger for destructive actions.">
          <Example title="Variants" code={`<Button>Save</Button>\n<Button variant="secondary">Draft</Button>\n<Button variant="outline">Cancel</Button>\n<Button variant="ghost">Skip</Button>\n<Button variant="danger">Delete</Button>\n<Button variant="link">Learn more</Button>`}>
            <Row>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link button</Button>
            </Row>
          </Example>
          <Example title="Sizes" code={`<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`}>
            <Row>
              <Button size="sm">Small · 32</Button>
              <Button>Medium · 36</Button>
              <Button size="lg">Large · 44</Button>
            </Row>
          </Example>
          <Example title="With icons, loading, disabled, full width" code={`<Button icon="plus">New</Button>\n<Button iconRight="arrowRight">Next</Button>\n<Button loading>Saving</Button>\n<Button disabled>Disabled</Button>\n<Button fullWidth>Continue</Button>`}>
            <Col>
              <Row>
                <Button icon="plus">New request</Button>
                <Button variant="outline" icon="download">Export</Button>
                <Button variant="secondary" iconRight="arrowRight">Next step</Button>
                <Button variant="outline" icon="filter" iconRight="chevronDown">Filter</Button>
                <Button loading={loading} onClick={() => (setLoading(true), setTimeout(() => setLoading(false), 1500))}>{loading ? "Saving…" : "Click to load"}</Button>
                <Button disabled>Disabled</Button>
              </Row>
              <Button fullWidth size="lg">Full width</Button>
            </Col>
          </Example>
          <Example title="Icon buttons & groups" code={`<IconButton icon="edit" label="Edit" />\n<IconButton icon="bell" label="Notifications" badge={3} />\n<ButtonGroup>\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n</ButtonGroup>`}>
            <Row gap={20}>
              <Row gap={4}>
                <IconButton icon="edit" label="Edit" />
                <IconButton icon="copy" label="Duplicate" />
                <IconButton icon="trash" label="Delete" />
                <IconButton icon="more" label="More" />
              </Row>
              <Row gap={8}>
                <IconButton icon="plus" label="Add" variant="primary" />
                <IconButton icon="settings" label="Settings" variant="outline" />
                <IconButton icon="bell" label="Notifications" variant="outline" badge={3} />
                <IconButton icon="message" label="Messages" variant="secondary" badge />
              </Row>
              <ButtonGroup>
                <Button variant="outline" icon="chevronLeft" />
                <Button variant="outline">Today</Button>
                <Button variant="outline" icon="chevronRight" />
              </ButtonGroup>
              <ButtonGroup>
                <Button>Save</Button>
                <Menu align="end" trigger={(p) => <Button {...p} icon="chevronDown" aria-label="More save options" />} items={[{ label: "Save as draft", icon: "file" }, { label: "Save and close", icon: "check" }]} />
              </ButtonGroup>
            </Row>
          </Example>
        </Group>

        <MotionGroup />

        {/* ------------------------------------------------------------ */}
        <Group id="forms" title="Forms" intro="Every field takes label, hint, error and required props, so forms look the same everywhere.">
          <Example title="Text inputs" code={`<Input label="Email" type="email" icon="mail" hint="Work email" />\n<Input label="Password" type="password" />\n<Input label="Website" prefix="https://" />\n<Input label="IBAN" error="IBAN must be 26 characters" />`}>
            <div className="form-grid">
              <Input label="Full name" placeholder="Ayşe Demir" required />
              <Input label="Email" type="email" icon="mail" placeholder="name@company.com" hint="Use your work email." />
              <Input label="Password" type="password" defaultValue="secret123" labelAside={<Link href="#">Forgot?</Link>} />
              <Input label="Website" prefix="https://" placeholder="company.com" optional />
              <Input label="Amount" prefix="₺" suffix="TRY" placeholder="0.00" inputMode="decimal" />
              <Input label="IBAN" defaultValue="TR12 3456" error="IBAN must be 26 characters" />
              <Input label="Disabled" defaultValue="Read only value" disabled />
              <Input label="Date" type="date" defaultValue="2026-11-18" />
              <Input label="Time" type="time" defaultValue="09:30" />
            </div>
          </Example>
          <Example title="Sizes & search" code={`<SearchInput shortcut="⌘K" />\n<Input size="sm" placeholder="Small" />\n<Input size="lg" placeholder="Large" />`}>
            <div className="form-grid">
              <Input size="sm" placeholder="Small · 32px" />
              <Input placeholder="Medium · 36px" />
              <Input size="lg" placeholder="Large · 44px" />
              <SearchInput shortcut="⌘K" />
            </div>
          </Example>
          <Example title="Select, textarea, number" code={`<Select label="Department" options={["Finance", "Sales"]} placeholder="Choose…" />\n<Textarea label="Notes" maxLength={200} showCount />\n<NumberInput label="Quantity" defaultValue={2} min={0} />`}>
            <div className="form-grid">
              <Select label="Department" placeholder="Choose a department" options={["Finance", "Engineering", "Sales", "People", "Legal"]} />
              <Select label="Priority" defaultValue="Medium" options={["Low", "Medium", "High", "Critical"]} hint="Used to order the queue." />
              <NumberInput label="Seats" defaultValue={4} min={1} max={50} />
              <div className="form-grid__full">
                <Textarea label="Description" placeholder="Describe the request…" maxLength={200} showCount hint="Markdown is supported." />
              </div>
            </div>
          </Example>
          <Example title="File upload & verification code" code={`<FileUpload label="Attachments" accept=".pdf,.docx" />\n<PinInput length={6} onComplete={(code) => verify(code)} />`}>
            <div className="form-grid">
              <div className="form-grid__wide">
                <FileUpload label="Attachments" />
              </div>
              <PinInput label="Verification code" onComplete={(code) => toast({ tone: "success", title: `Code ${code} entered` })} />
            </div>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="selection" title="Selection & sliders">
          <Example title="Checkbox, radio, switch" code={`<Checkbox label="Remember me" />\n<RadioGroup label="Plan" defaultValue="team">\n  <Radio value="team" label="Team" />\n</RadioGroup>\n<Switch label="Email notifications" defaultChecked />`}>
            <div className="form-grid">
              <Col gap={12}>
                <Overline>Checkbox</Overline>
                <Checkbox label="Remember me" defaultChecked />
                <Checkbox label="Partially selected" indeterminate />
                <Checkbox label="Accept terms" description="You agree to the data processing policy." />
                <Checkbox label="Disabled" disabled />
              </Col>
              <RadioGroup label="Approval flow" defaultValue="manager">
                <Radio value="manager" label="Line manager" description="Fastest, for small amounts" />
                <Radio value="finance" label="Manager + Finance" />
                <Radio value="board" label="Board" disabled />
              </RadioGroup>
              <Col gap={12}>
                <Overline>Switch</Overline>
                <Switch label="Email notifications" defaultChecked />
                <Switch label="Two-factor authentication" description="Ask for a code on new devices" />
                <Switch size="sm" label="Compact view" />
              </Col>
            </div>
          </Example>
          <Example title="Sliders" note="Range input, styled. Works with mouse, touch and keyboard." code={`<Slider label="Budget" defaultValue={60} format={(v) => \`\${v}%\`} />\n<RangeSlider label="Salary" min={30} max={200} defaultValue={[60, 140]} />`}>
            <div className="form-grid">
              <Slider label="Budget allocation" defaultValue={60} format={(v) => `${v}%`} marks={["0%", "50%", "100%"]} />
              <Slider label="Team size" min={1} max={20} defaultValue={8} />
              <RangeSlider label="Salary range" min={30} max={200} defaultValue={[60, 140]} format={(v) => `₺${v}k`} />
            </div>
          </Example>
          <Example title="Segmented control & filter chips" code={`<SegmentedControl options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />\n<Tag onClick={toggle} selected>Open</Tag>\n<Tag onRemove={remove}>Finance</Tag>`}>
            <Col>
              <Row gap={16}>
                <SegmentedControl options={[{ value: "list", label: "List", icon: "list" }, { value: "board", label: "Board", icon: "grid" }, { value: "calendar", label: "Calendar", icon: "calendar" }]} />
                <SegmentedControl size="sm" options={[{ value: "d", label: "Day" }, { value: "w", label: "Week" }, { value: "m", label: "Month" }]} defaultValue="w" />
              </Row>
              <Row gap={8}>
                {["Open", "In review", "Approved", "Closed"].map((f) => (
                  <Tag key={f} selected={filter.includes(f)} onClick={() => setFilter(filter.includes(f) ? filter.filter((x) => x !== f) : [...filter, f])}>{f}</Tag>
                ))}
              </Row>
              <Row gap={8}>
                {tags.map((t) => (
                  <Tag key={t} icon="tag" onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
                ))}
                {tags.length === 0 && <Button size="sm" variant="link" onClick={() => setTags(["Finance", "Q4", "Urgent"])}>Reset tags</Button>}
              </Row>
            </Col>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="cards" title="Cards & stats">
          <Example title="Card variants" code={`<Card>\n  <CardHeader title="Title" subtitle="Subtitle" icon="briefcase" actions={<IconButton icon="more" label="More" />} />\n  <CardBody>…</CardBody>\n  <CardFooter><Button>Save</Button></CardFooter>\n</Card>`}>
            <div className="cards-grid">
              <Card>
                <CardHeader title="Outlined card" subtitle="Default, for most content" icon="briefcase" actions={<IconButton icon="more" label="More" size="sm" />} />
                <div className="md-card__body"><Text tone="secondary">Cards group related information and actions.</Text></div>
                <CardFooter>
                  <Button size="sm" variant="ghost">Cancel</Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
              <Card variant="elevated">
                <CardHeader title="Elevated card" subtitle="Floats above the page" icon="layers" />
                <div className="md-card__body"><Text tone="secondary">Use for popovers or highlighted content.</Text></div>
              </Card>
              <Card variant="muted">
                <CardHeader title="Muted card" subtitle="Secondary information" icon="info" />
                <div className="md-card__body"><Text tone="secondary">Sits quietly on white surfaces.</Text></div>
              </Card>
              <Card interactive selected>
                <CardHeader title="Selected card" subtitle="Clickable, e.g. choose a plan" icon="checkCircle" />
              </Card>
            </div>
          </Example>
          <Example title="Media cards" code={`<MediaCard meta="Policy" title="Remote work" description="…" footer={…} />`}>
            <div className="cards-grid">
              {[
                ["Policy", "Remote work guidelines", "Updated rules for hybrid teams, effective December."],
                ["Training", "Security awareness 2026", "Mandatory 30-minute course for all employees."],
                ["News", "New Ankara office", "We are opening a second office in Çankaya."],
              ].map(([m, t, d]) => (
                <MediaCard key={t} meta={m} title={t} description={d} footer={<><AvatarGroup names={["A B", "C D", "E F"]} size="xs" /><Button size="sm" variant="ghost" iconRight="arrowRight">Read</Button></>} />
              ))}
            </div>
          </Example>
          <Example title="Stats / KPI" code={`<Stat label="Revenue" value="₺1.2M" delta="8.1%" hint="vs last month" icon="wallet" />`}>
            <div className="cards-grid cards-grid--4">
              <Stat label="Revenue" value="₺1.2M" delta="8.1%" hint="vs last month" icon="wallet" />
              <Stat label="Open tickets" value="36" delta="12%" trend="down" hint="vs last week" icon="inbox" />
              <Stat label="Headcount" value="248" delta="0%" trend="flat" icon="users" />
              <Card className="md-stat">
                <div className="md-stat__top"><span className="md-stat__label">Active users</span></div>
                <div className="spark-row"><span className="md-stat__value">1,284</span><Sparkline values={[4, 6, 5, 8, 7, 10, 12]} /></div>
              </Card>
            </div>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="data" title="Data display">
          <Example title="Badges" code={`<Badge tone="success" dot>Approved</Badge>\n<Badge tone="primary" variant="solid">New</Badge>\n<StatusBadge status="pending" />`}>
            <Col gap={12}>
              {(["soft", "solid", "outline"] as const).map((v) => (
                <Row key={v} gap={8}>
                  {(["neutral", "primary", "success", "warning", "danger", "info"] as const).map((t) => (
                    <Badge key={t} tone={t} variant={v}>{t}</Badge>
                  ))}
                </Row>
              ))}
              <Row gap={8}>
                {(["active", "approved", "pending", "rejected", "overdue", "draft", "inactive"] as const).map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
                <Badge tone="primary" icon="star">Featured</Badge>
              </Row>
            </Col>
          </Example>
          <Example title="Avatars" code={`<Avatar name="Ayşe Demir" size="lg" status="online" />\n<AvatarGroup names={names} max={4} />\n<UserCell name="Ayşe Demir" detail="Finance" />`}>
            <Col>
              <Row gap={16}>
                {(["xs", "sm", "md", "lg", "xl"] as const).map((s, i) => (
                  <Avatar key={s} name={people[i]!.name} size={s} status={(["online", "away", "busy", "offline", "online"] as const)[i]} />
                ))}
                <Avatar name="Square Logo" square size="lg" />
                <AvatarGroup names={people.map((p) => p.name).concat(["Ali Vural", "Selin Öztürk"])} max={4} size="md" />
              </Row>
              <Row gap={32}>
                <UserCell name="Ayşe Demir" detail="Senior Accountant" status="online" />
                <UserCell name="Mehmet Kaya" detail="mehmet@company.com" size="md" />
              </Row>
            </Col>
          </Example>
          <Example title="List" code={`<List>\n  <ListItem leading={<Avatar … />} title="…" description="…" trailing={…} onClick={…} />\n</List>`}>
            <div className="cards-grid">
              <Card padding="sm">
                <List>
                  {people.slice(0, 4).map((p, i) => (
                    <ListItem key={p.id} active={i === 0} onClick={() => {}} leading={<Avatar name={p.name} size="sm" status={i < 2 ? "online" : undefined} />} title={p.name} description={p.role} trailing={<Icon name="chevronRight" size={16} />} />
                  ))}
                </List>
              </Card>
              <Card padding="sm">
                <List>
                  <ListItem leading={<span className="icon-tile"><Icon name="file" /></span>} title="Q3 financial report.pdf" description="2.4 MB · Finance" trailing={<IconButton icon="download" label="Download" size="sm" />} />
                  <ListItem leading={<span className="icon-tile"><Icon name="image" /></span>} title="Office floor plan.png" description="840 KB · Facilities" trailing={<IconButton icon="download" label="Download" size="sm" />} />
                  <ListItem leading={<span className="icon-tile"><Icon name="folder" /></span>} title="Contracts" description="24 files" trailing={<Badge>Shared</Badge>} />
                </List>
              </Card>
            </div>
          </Example>
          <Example title="Description list & timeline" code={`<DescriptionList items={[{ label: "Owner", value: "Ayşe" }]} />\n<Timeline items={[{ title: "Approved", time: "09:40", tone: "success", icon: "check" }]} />`}>
            <div className="cards-grid">
              <Card>
                <DescriptionList
                  items={[
                    { label: "Request ID", value: "REQ-2026-0418" },
                    { label: "Requested by", value: <UserCell name="Mehmet Kaya" size="xs" /> },
                    { label: "Type", value: "Annual leave" },
                    { label: "Dates", value: "2 – 6 December 2026" },
                    { label: "Status", value: <StatusBadge status="pending" /> },
                  ]}
                />
              </Card>
              <Card>
                <Timeline
                  items={[
                    { title: "Request submitted", time: "Mon 09:12", description: "by Mehmet Kaya", tone: "primary", icon: "send" },
                    { title: "Manager approved", time: "Mon 11:40", description: "Ayşe Demir", tone: "success", icon: "check" },
                    { title: "Waiting for HR", time: "Now", tone: "warning", icon: "clock" },
                    { title: "Calendar updated", tone: "neutral" },
                  ]}
                />
              </Card>
            </div>
          </Example>
          <Example title="Empty state" code={`<EmptyState icon="folder" title="No documents" description="…" action={<Button>Upload</Button>} />`}>
            <Card>
              <EmptyState icon="folder" title="No documents yet" description="Upload a file or create a new document to share it with your team." action={<><Button variant="outline" icon="plus">New document</Button><Button icon="upload">Upload</Button></>} />
            </Card>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="table" title="Tables">
          <Example title="Data table" note="Sortable columns, row selection, custom cells, pagination." code={`<Table\n  selectable\n  rows={people}\n  rowKey={(p) => p.id}\n  columns={[\n    { key: "name", header: "Employee", render: (p) => <UserCell name={p.name} />, sortValue: (p) => p.name },\n    { key: "salary", header: "Salary", align: "right", sortValue: (p) => p.salary },\n  ]}\n/>`}>
            <Col>
              <Table selectable rows={people} rowKey={(p) => p.id} columns={personColumns} />
              <Pagination page={page} total={10} onChange={setPage} summary="Showing 1–5 of 48" />
            </Col>
          </Example>
          <Example title="Compact & striped, empty">
            <div className="cards-grid">
              <Table density="compact" striped rows={people.slice(0, 4)} rowKey={(p) => p.id} columns={personColumns.filter((c) => ["role", "team", "salary"].includes(c.key))} />
              <Table rows={[] as Person[]} rowKey={(p) => p.id} columns={personColumns.slice(0, 3)} empty={<EmptyState icon="search" title="No results" description="Try another search." />} />
            </div>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="profile" title="Profile & people">
          <Example title="Profile cards" code={`<ProfileCard\n  name="Ayşe Demir" title="Senior Accountant" department="Finance" status="online"\n  details={[{ icon: "mail", value: "ayse@company.com" }]}\n  stats={[{ label: "Projects", value: 12 }]}\n  actions={<Button>Message</Button>}\n/>`}>
            <div className="cards-grid">
              <ProfileCard
                name="Ayşe Demir"
                title="Senior Accountant"
                department="Finance"
                status="online"
                details={[{ icon: "mail", value: "ayse.demir@company.com" }, { icon: "phone", value: "+90 212 555 01 23" }, { icon: "mapPin", value: "Istanbul HQ · Floor 4" }]}
                actions={<><Button variant="outline" icon="message">Message</Button><Button icon="phone">Call</Button></>}
              />
              <ProfileCard name="Mehmet Kaya" title="Product Manager" department="Product" status="away" stats={[{ label: "Projects", value: 8 }, { label: "Reports", value: 6 }, { label: "Years", value: 5 }]} actions={<Button variant="secondary">View profile</Button>} />
              <ProfileCard cover={false} name="Elif Şahin" title="HR Specialist" status="busy" details={[{ icon: "building", value: "People & Culture" }, { icon: "clock", value: "09:00 – 18:00 (GMT+3)" }]} />
            </div>
          </Example>
          <Example title="Profile header" code={`<ProfileHeader name="Ayşe Demir" title="…" meta={[{ icon: "mapPin", value: "Istanbul" }]} actions={…} />`}>
            <ProfileHeader
              name="Ayşe Demir"
              title="Senior Accountant · Finance"
              meta={[{ icon: "mapPin", value: "Istanbul HQ" }, { icon: "mail", value: "ayse.demir@company.com" }, { icon: "calendar", value: "Joined March 2019" }]}
              actions={<><Button variant="outline" icon="message">Message</Button><Button icon="edit">Edit profile</Button></>}
            />
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="feedback" title="Feedback">
          <Example title="Alerts" code={`<Alert tone="success" title="Saved">Changes saved.</Alert>\n<Alert tone="warning" variant="outline" title="…" />\n<Alert tone="info" variant="banner">…</Alert>`}>
            <Col gap={12}>
              <Alert tone="info" title="New policy">Remote work policy v3 goes live on 1 December.</Alert>
              <Alert tone="success" title="Changes saved" onClose={() => {}}>Your profile was updated.</Alert>
              <Alert tone="warning" title="Password expires in 3 days" action={<Button size="sm" variant="outline">Change password</Button>}>Choose a new password to keep access.</Alert>
              <Alert tone="danger" title="Payment failed">The card ending 4242 was declined.</Alert>
              <Alert tone="info" variant="outline" title="Outline style">A quieter alert with a colored edge.</Alert>
              <Alert tone="warning" variant="banner" title="Scheduled maintenance" action={<Link href="#">Details</Link>}>Sunday 02:00 – 04:00, some services may be slow.</Alert>
            </Col>
          </Example>
          <Example title="Toasts" code={`// wrap the app once: <ToastProvider>\nconst toast = useToast();\ntoast({ tone: "success", title: "Saved", description: "…" });`}>
            <Col>
              <Row>
                <Button variant="outline" icon="checkCircle" onClick={() => toast({ tone: "success", title: "Report exported", description: "Q4-report.xlsx is in your downloads." })}>Success toast</Button>
                <Button variant="outline" icon="info" onClick={() => toast({ tone: "info", title: "Sync started" })}>Info toast</Button>
                <Button variant="outline" icon="alert" onClick={() => toast({ tone: "warning", title: "Storage almost full", description: "92% of 50 GB used." })}>Warning toast</Button>
                <Button variant="outline" icon="xCircle" onClick={() => toast({ tone: "danger", title: "Upload failed", description: "File is larger than 10 MB." })}>Error toast</Button>
              </Row>
              <div className="toast-preview">
                <Toast tone="success" title="Invitation sent" description="Elif will receive an email shortly." onClose={() => {}} />
              </div>
            </Col>
          </Example>
          <Example title="Progress, spinner, skeleton" code={`<Progress label="Upload" value={64} />\n<CircularProgress value={72} />\n<Spinner />\n<Skeleton width="60%" />`}>
            <div className="form-grid">
              <Col>
                <Progress label="Uploading files" value={64} />
                <Progress label="Storage" value={92} tone="danger" size="sm" />
                <Progress label="Onboarding" value={100} tone="success" size="lg" />
                <Progress indeterminate size="sm" />
              </Col>
              <Row gap={20}>
                <CircularProgress value={72} />
                <CircularProgress value={35} size={72} stroke={6} />
                <Spinner />
                <Spinner size={28} />
                <Button loading variant="outline">Loading</Button>
              </Row>
              <Card>
                <Row gap={12}>
                  <Skeleton circle width={40} />
                  <div style={{ flex: 1, display: "grid", gap: 8 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="35%" height={10} />
                  </div>
                </Row>
                <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
                  <Skeleton height={80} radius={8} />
                  <Skeleton width="90%" />
                  <Skeleton width="75%" />
                </div>
              </Card>
            </div>
          </Example>
          <Example title="Tooltips" code={`<Tooltip content="Copy to clipboard"><IconButton icon="copy" label="Copy" /></Tooltip>`}>
            <Row gap={24}>
              {(["top", "bottom", "left", "right"] as const).map((s) => (
                <Tooltip key={s} content={`Tooltip on ${s}`} side={s}>
                  <Button variant="outline" size="sm">Hover ({s})</Button>
                </Tooltip>
              ))}
              <Tooltip content="Copy link"><IconButton icon="link" label="Copy link" variant="outline" /></Tooltip>
            </Row>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="overlays" title="Overlays">
          <Example title="Modal, confirm dialog, drawer" code={`<Modal open={open} onClose={close} title="Edit" footer={<Button>Save</Button>}>…</Modal>\n<Modal tone="danger" title="Delete file?" …/>\n<Drawer open={open} onClose={close} title="Details">…</Drawer>`}>
            <Row>
              <Button onClick={() => setModal("form")}>Open modal</Button>
              <Button variant="danger" onClick={() => setModal("confirm")}>Confirm dialog</Button>
              <Button variant="outline" icon="layers" onClick={() => setDrawer(true)}>Open drawer</Button>
            </Row>
          </Example>
          <Example title="Dropdown menu & popover" code={`<Menu trigger={(p) => <Button {...p}>Actions</Button>} items={[{ label: "Edit", icon: "edit" }, { type: "divider" }, { label: "Delete", danger: true }]} />`}>
            <Row gap={16}>
              <Menu
                trigger={(p) => <Button {...p} variant="outline" iconRight="chevronDown">Actions</Button>}
                items={[
                  { type: "label", label: "Document" },
                  { label: "Edit", icon: "edit", shortcut: "E" },
                  { label: "Duplicate", icon: "copy", shortcut: "⌘D" },
                  { label: "Download", icon: "download" },
                  { label: "Archive", icon: "folder", disabled: true },
                  { type: "divider" },
                  { label: "Delete", icon: "trash", danger: true, onSelect: () => setModal("confirm") },
                ]}
              />
              <Menu
                trigger={(p) => (
                  <button {...p} className="plain-btn" aria-label="Account">
                    <UserCell name="Ayşe Demir" detail="Admin" />
                    <Icon name="chevronDown" size={16} />
                  </button>
                )}
                items={[{ label: "Profile", icon: "user" }, { label: "Settings", icon: "settings" }, { type: "divider" }, { label: "Sign out", icon: "logout" }]}
              />
              <Popover trigger={(p) => <Button {...p} variant="outline" icon="bell">Notifications</Button>} width={320}>
                <Col gap={4}>
                  <Row gap={8}><strong style={{ flex: 1 }}>Notifications</strong><Button size="sm" variant="link">Mark all read</Button></Row>
                  <List>
                    <ListItem leading={<Avatar name="Mehmet Kaya" size="sm" />} title="Mehmet requested leave" description="2 minutes ago" />
                    <ListItem leading={<Avatar name="Elif Şahin" size="sm" />} title="Elif mentioned you" description="1 hour ago" />
                  </List>
                </Col>
              </Popover>
            </Row>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="navigation" title="Navigation">
          <Example title="Tabs" code={`<Tabs variant="line" items={[{ value: "overview", label: "Overview" }, { value: "files", label: "Files", count: 3 }]}>\n  {(tab) => <Panel tab={tab} />}\n</Tabs>`}>
            <Col gap={24}>
              <Tabs items={[{ value: "overview", label: "Overview", icon: "dashboard" }, { value: "members", label: "Members", count: 12, icon: "users" }, { value: "files", label: "Files", count: 3, icon: "folder" }, { value: "settings", label: "Settings", icon: "settings" }, { value: "archived", label: "Archived", disabled: true }]}>
                {(t) => <Text tone="secondary">Content of the “{t}” tab.</Text>}
              </Tabs>
              <Tabs variant="pills" items={[{ value: "all", label: "All" }, { value: "mine", label: "Assigned to me", count: 4 }, { value: "done", label: "Done" }]} />
              <Tabs variant="enclosed" items={[{ value: "a", label: "Details" }, { value: "b", label: "History" }, { value: "c", label: "Comments" }]} />
            </Col>
          </Example>
          <Example title="Breadcrumbs & pagination" code={`<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reports" }]} />\n<Pagination page={page} total={10} onChange={setPage} />`}>
            <Col>
              <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Finance", href: "#" }, { label: "Reports", href: "#" }, { label: "Q4 2026" }]} />
              <Pagination page={page} total={20} onChange={setPage} summary={`Page ${page} of 20`} />
            </Col>
          </Example>
          <Example title="Steps (wizard)" code={`<Steps current={1} steps={[{ title: "Details" }, { title: "Approval" }, { title: "Done" }]} />`}>
            <Col gap={24}>
              <Steps current={step} steps={[{ title: "Details", description: "Basic info" }, { title: "Documents", description: "Upload files" }, { title: "Approval", description: "Manager review" }, { title: "Done" }]} />
              <Row>
                <Button size="sm" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
                <Button size="sm" disabled={step === 4} onClick={() => setStep(step + 1)}>Next</Button>
              </Row>
              <div style={{ maxWidth: 320 }}>
                <Steps orientation="vertical" current={step} steps={[{ title: "Account created", description: "Mon, 09:12" }, { title: "Profile completed" }, { title: "First project" }]} />
              </div>
            </Col>
          </Example>
          <Example title="Accordion" code={`<Accordion items={[{ title: "Question", content: "Answer" }]} />`}>
            <Accordion
              defaultOpen={[0]}
              items={[
                { title: "How do I request annual leave?", content: "Go to Requests → New request, choose Annual leave and pick the dates. Your manager is notified automatically." },
                { title: "Who approves expense reports?", content: "Your line manager approves first. Amounts over ₺10,000 also need Finance approval." },
                { title: "Where can I find my payslips?", content: "Open My profile → Documents. Payslips are published on the 1st of every month." },
              ]}
            />
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="shell" title="App shell" intro="The frame of an office app: navy sidebar, top bar and, on phones, a bottom tab bar.">
          <Example title="Sidebar + top bar" code={`<Sidebar header={<Logo name="Workplace" />} footer={<UserCell … />}>\n  <NavSection title="Workspace">\n    <NavItem icon="dashboard" label="Dashboard" active />\n  </NavSection>\n</Sidebar>\n<Topbar left={<SearchInput />} right={<IconButton icon="bell" label="Alerts" />} />`}>
            <div className="shell-demo">
              <Sidebar header={<Logo name="Workplace" short="WP" />} footer={<UserCell name="Ayşe Demir" detail="Finance · Admin" status="online" />}>
                <NavSection title="Workspace">
                  <NavItem icon="dashboard" label="Dashboard" active />
                  <NavItem icon="users" label="Employees" count={84} />
                  <NavItem icon="inbox" label="Requests" count={4} />
                  <NavItem icon="folder" label="Documents" />
                </NavSection>
                <NavSection title="Account">
                  <NavItem icon="settings" label="Settings" />
                </NavSection>
              </Sidebar>
              <div className="shell-demo__main">
                <Topbar left={<div style={{ width: 240 }}><SearchInput size="sm" shortcut="⌘K" /></div>} right={<><IconButton icon="help" label="Help" /><IconButton icon="bell" label="Notifications" badge={3} /><Avatar name="Ayşe Demir" size="sm" /></>} />
                <div className="shell-demo__content">
                  <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Dashboard" }]} />
                  <Heading level={4}>Dashboard</Heading>
                  <div className="cards-grid cards-grid--3">
                    <Skeleton height={72} radius={12} />
                    <Skeleton height={72} radius={12} />
                    <Skeleton height={72} radius={12} />
                  </div>
                </div>
              </div>
            </div>
          </Example>
          <Example title="Light sidebar variant & collapsed" code={`<Sidebar className="md-sidebar--light" …/>\n<Sidebar collapsed …/>`}>
            <div className="shell-row">
              <div className="shell-demo shell-demo--small">
                <Sidebar className="md-sidebar--light" header={<Logo name="Workplace" short="WP" />}>
                  <NavSection>
                    <NavItem icon="home" label="Home" active />
                    <NavItem icon="calendar" label="Calendar" />
                    <NavItem icon="chart" label="Reports" />
                  </NavSection>
                </Sidebar>
              </div>
              <div className="shell-demo shell-demo--small">
                <Sidebar collapsed header={<Logo short="WP" collapsed />}>
                  <NavSection>
                    <NavItem icon="home" label="Home" active />
                    <NavItem icon="calendar" label="Calendar" />
                    <NavItem icon="chart" label="Reports" />
                    <NavItem icon="settings" label="Settings" />
                  </NavSection>
                </Sidebar>
              </div>
              <div className="phone-nav">
                <div className="phone-nav__screen"><Text tone="muted" size="sm">Bottom navigation for phones</Text></div>
                <BottomNav value={nav} onChange={setNav} items={[{ value: "home", label: "Home", icon: "home" }, { value: "inbox", label: "Inbox", icon: "inbox", badge: 2 }, { value: "calendar", label: "Calendar", icon: "calendar" }, { value: "me", label: "Profile", icon: "user" }]} />
              </div>
            </div>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="date" title="Calendar & carousel">
          <Example title="Calendar / date picker" code={`<Calendar value={date} onChange={setDate} events={[meetingDate]} />`}>
            <Row gap={24}>
              <Calendar events={[new Date(), new Date(Date.now() + 3 * 864e5), new Date(Date.now() + 8 * 864e5)]} />
              <Col gap={12}>
                <Input label="Native date input" type="date" defaultValue="2026-11-18" />
                <Input label="Date & time" type="datetime-local" defaultValue="2026-11-18T09:30" />
              </Col>
            </Row>
          </Example>
          <Example title="Carousel (content slider)" code={`<Carousel perView={3}>\n  <Card>…</Card>\n  <Card>…</Card>\n</Carousel>`}>
            <Carousel perView={3}>
              {["Welcome to the team", "Benefits overview", "IT & security", "Office guide", "Expense rules"].map((t, i) => (
                <Card key={t} variant="muted" className="slide-card">
                  <Overline>Guide {i + 1} of 5</Overline>
                  <Heading level={5}>{t}</Heading>
                  <Text size="sm" tone="muted">5 min read</Text>
                </Card>
              ))}
            </Carousel>
          </Example>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="charts" title="Charts" intro="Lightweight SVG charts for dashboards. For heavy analytics use a chart library with the --md-data-* colors.">
          <div className="cards-grid">
            <Example title="Bar chart">
              <BarChart data={[{ label: "Jun", value: 32, value2: 28 }, { label: "Jul", value: 28, value2: 31 }, { label: "Aug", value: 41, value2: 36 }, { label: "Sep", value: 38, value2: 39 }, { label: "Oct", value: 45, value2: 42 }, { label: "Nov", value: 39, value2: 43 }]} />
            </Example>
            <Example title="Donut chart">
              <DonutChart center={<strong>248</strong>} data={[{ label: "Engineering", value: 92 }, { label: "Sales", value: 54 }, { label: "Operations", value: 41 }, { label: "Finance", value: 33 }, { label: "People", value: 28 }]} />
            </Example>
            <Example title="Sparklines">
              <Col>
                <Row gap={16}><Text size="sm" style={{ width: 80 }}>Visits</Text><Sparkline values={[3, 5, 4, 7, 6, 9, 11]} /></Row>
                <Row gap={16}><Text size="sm" style={{ width: 80 }}>Tickets</Text><Sparkline values={[9, 8, 8, 6, 7, 5, 4]} /></Row>
                <Row gap={16}><Text size="sm" style={{ width: 80 }}>Sales</Text><Sparkline values={[2, 4, 3, 5, 8, 7, 9]} area={false} /></Row>
              </Col>
            </Example>
          </div>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="advanced" title="Search, pickers & power tools" intro="Patterns large enterprise systems rely on: a command palette, searchable pickers, tag fields, trees and right-click menus.">
          <Example title="Command palette" note={<>Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> (or <Kbd>⌘</Kbd> <Kbd>K</Kbd>) anywhere on this page. Arrow keys move, Enter runs.</>} code={`const [open, setOpen] = useState(false);\nuseHotkey("k", () => setOpen(true));\n\n<CommandPalette\n  open={open}\n  onClose={() => setOpen(false)}\n  commands={[\n    { id: "new", label: "New request", group: "Actions", icon: "plus", shortcut: "N", onSelect: () => {} },\n    { id: "emp", label: "Employees", group: "Go to", icon: "users" },\n  ]}\n/>`}>
            <Row>
              <Button variant="outline" icon="search" onClick={() => setCmdOpen(true)}>
                Search or run a command… <Kbd>Ctrl K</Kbd>
              </Button>
            </Row>
          </Example>
          <div className="ex-pair">
            <Example title="Combobox" note="Searchable single select with descriptions and avatars." code={`<Combobox\n  label="Assignee"\n  options={[{ value: "ayse", label: "Ayşe Demir", description: "Finance", avatar: true }]}\n/>`}>
              <Col>
                <Combobox label="Assignee" defaultValue="1" options={people.map((p) => ({ value: p.id, label: p.name, description: `${p.role} · ${p.team}`, avatar: true }))} />
                <Combobox label="Cost center" placeholder="Choose a cost center" options={[{ value: "100", label: "100 · Head office", icon: "building" }, { value: "210", label: "210 · Sales EMEA", icon: "globe" }, { value: "330", label: "330 · IT operations", icon: "settings" }, { value: "410", label: "410 · Marketing", icon: "zap" }]} />
              </Col>
            </Example>
            <Example title="Multi select & tag input" code={`<MultiSelect label="Reviewers" options={people} defaultValue={["ayse"]} />\n<TagInput label="Labels" defaultValue={["Q4"]} />\n<TagInput label="Invite by email" validate={(t) => t.includes("@")} />`}>
              <Col>
                <MultiSelect label="Reviewers" defaultValue={["1", "2"]} options={people.map((p) => ({ value: p.id, label: p.name, avatar: true }))} />
                <TagInput label="Labels" defaultValue={["Q4", "Budget"]} hint="Press Enter or comma to add" />
                <TagInput label="Invite by email" placeholder="name@company.com" validate={(t) => /.+@.+\..+/.test(t)} hint="Only valid email addresses are added" />
              </Col>
            </Example>
          </div>
          <div className="ex-pair">
            <Example title="Date range" code={`<DateRangeInput label="Leave period" defaultValue={["2026-12-22", "2026-12-31"]} />`}>
              <DateRangeInput label="Leave period" defaultValue={["2026-12-22", "2026-12-31"]} />
            </Example>
            <Example title="Selectable cards" note="Radio or checkbox choices as cards, for plans and options." code={`<SelectableCards\n  defaultValue={["team"]}\n  options={[{ value: "team", title: "Team", description: "Up to 25 people", icon: "users" }]}\n/>`}>
              <SelectableCards columns={3} defaultValue={["team"]} options={[{ value: "basic", title: "Basic", description: "Up to 5 people", icon: "user", aside: "Free" }, { value: "team", title: "Team", description: "Up to 25 people", icon: "users", aside: "₺450" }, { value: "org", title: "Organization", description: "Unlimited, SSO", icon: "building", aside: "Custom" }]} />
            </Example>
          </div>
          <div className="ex-pair">
            <Example title="Tree list" note="Folders, org charts and nested categories." code={`<TreeList\n  defaultExpanded={["fin"]}\n  nodes={[{ id: "fin", label: "Finance", icon: "folder", children: [{ id: "q4", label: "Q4 budget.xlsx", icon: "file" }] }]}\n/>`}>
              <TreeList
                defaultExpanded={["docs", "fin"]}
                selected={treeSel}
                onSelect={(n) => setTreeSel(n.id)}
                nodes={[
                  { id: "docs", label: "Company documents", icon: "folder", meta: "24", children: [
                    { id: "fin", label: "Finance", icon: "folder", children: [
                      { id: "q4", label: "Q4 budget.xlsx", icon: "file", meta: "2 MB" },
                      { id: "inv", label: "Invoices 2026", icon: "folder", children: [{ id: "i1", label: "INV-1042.pdf", icon: "file" }] },
                    ] },
                    { id: "hr", label: "Human resources", icon: "folder", children: [{ id: "pol", label: "Leave policy.pdf", icon: "file" }] },
                  ] },
                  { id: "shared", label: "Shared with me", icon: "users", children: [{ id: "deck", label: "Board deck.pptx", icon: "file" }] },
                ]}
              />
            </Example>
            <Example title="Context menu" note="Right-click (or long-press) the area below." code={`<ContextMenu items={[{ label: "Open", icon: "eye" }, { type: "divider" }, { label: "Delete", icon: "trash", danger: true }]}>\n  <div>Right-click me</div>\n</ContextMenu>`}>
              <ContextMenu
                items={[
                  { label: "Open", icon: "eye", shortcut: "Enter", onSelect: () => toast({ title: "Opened" }) },
                  { label: "Copy link", icon: "link", shortcut: "Ctrl C" },
                  { label: "Download", icon: "download" },
                  { type: "divider" },
                  { label: "Delete", icon: "trash", danger: true, onSelect: () => toast({ tone: "danger", title: "Deleted" }) },
                ]}
              >
                <div className="ctx-area">
                  <Icon name="file" size={28} />
                  <Text tone="muted" size="sm">Right-click this file</Text>
                </div>
              </ContextMenu>
            </Example>
          </div>
          <Example title="Toolbar & toggle buttons" note="Group related actions. Toggle buttons keep an on/off state." code={`<Toolbar aria-label="Formatting">\n  <ToggleButton icon="edit" label="Edit mode" />\n  <ToolbarDivider />\n  <IconButton icon="link" label="Link" variant="ghost" />\n</Toolbar>`}>
            <Toolbar aria-label="Document">
              <ToggleButton icon="edit" label="Edit mode" defaultPressed />
              <ToggleButton icon="eye" label="Preview" />
              <ToolbarDivider />
              <IconButton icon="link" label="Insert link" variant="ghost" size="sm" />
              <IconButton icon="image" label="Insert image" variant="ghost" size="sm" />
              <IconButton icon="paperclip" label="Attach" variant="ghost" size="sm" />
              <ToolbarDivider />
              <ToggleButton icon="star" label="Starred" showLabel />
              <ToggleButton icon="bell" label="Follow" showLabel defaultPressed />
            </Toolbar>
          </Example>
          <div className="ex-pair">
            <Example title="Info tip & hover card" code={`<InfoTip>Net pay after tax and social security.</InfoTip>\n<HoverCard trigger={<Link>Ayşe Demir</Link>}>\n  <UserCell name="Ayşe Demir" detail="Senior Accountant" />\n</HoverCard>`}>
              <Col gap={14}>
                <Inline>
                  <Text weight="medium">Net salary</Text>
                  <InfoTip>Net pay after income tax and social security deductions.</InfoTip>
                </Inline>
                <Text>
                  Approved by{" "}
                  <HoverCard trigger={<Link href="#components/advanced">Ayşe Demir</Link>}>
                    <Col gap={12}>
                      <UserCell name="Ayşe Demir" detail="Senior Accountant · Finance" status="online" />
                      <DescriptionList items={[{ label: "Email", value: "ayse.demir@company.com" }, { label: "Local time", value: "14:20" }]} />
                      <Inline>
                        <Button size="sm" icon="message">Message</Button>
                        <Button size="sm" variant="outline" icon="phone">Call</Button>
                      </Inline>
                    </Col>
                  </HoverCard>{" "}
                  on 14 Nov.
                </Text>
              </Col>
            </Example>
            <Example title="Status dot & timestamp" code={`<StatusDot tone="success" label="Operational" pulse />\n<Timestamp date={new Date(Date.now() - 5 * 60e3)} />`}>
              <Col gap={12}>
                <Inline>
                  <StatusDot tone="success" label="Operational" pulse />
                  <StatusDot tone="warning" label="Degraded" />
                  <StatusDot tone="danger" label="Outage" />
                  <StatusDot tone="neutral" label="Paused" />
                </Inline>
                <Inline>
                  <Text size="sm" tone="muted">Updated <Timestamp date={new Date(Date.now() - 5 * 60e3)} /></Text>
                  <Text size="sm" tone="muted">· Created <Timestamp date={new Date(Date.now() - 3 * 86400e3)} format="date" /></Text>
                </Inline>
              </Col>
            </Example>
          </div>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="chat" title="Chat & media" intro="Messaging, comments, image and attachment previews.">
          <div className="ex-pair">
            <Example title="Chat thread" note="Type a message and press Enter." code={`<ChatThread>\n  <ChatMessage author="Mehmet Kaya" time="10:42">Can you review it?</ChatMessage>\n  <ChatMessage author="You" own time="10:44" status="read">Sure.</ChatMessage>\n</ChatThread>\n<ChatComposer onSend={(text) => {}} />`}>
              <Card padding="none">
                <ChatThread className="chat-demo">
                  {chat.map((m, i) => (
                    <ChatMessage key={i} author={m.author} time={m.time} own={m.own} status={m.own ? "read" : undefined}>
                      {m.text}
                    </ChatMessage>
                  ))}
                </ChatThread>
                <div style={{ padding: 12, borderTop: "1px solid var(--md-color-border)" }}>
                  <ChatComposer onSend={(text) => setChat((c) => [...c, { author: "You", text, time: "now", own: true }])} />
                </div>
              </Card>
            </Example>
            <Col>
              <Example title="Image & attachment preview" note="Click a thumbnail. Arrow keys switch, Esc closes." code={`<Lightbox items={[{ src: "/office.jpg", title: "Office" }, { title: "Floor plan", color: "#1F3B70" }]} />`}>
                <Lightbox
                  columns={3}
                  items={[
                    { title: "Reception", color: "linear-gradient(135deg, var(--md-brand-700), var(--md-brand-400))" },
                    { title: "Meeting room", color: "linear-gradient(135deg, #2F6F5E, #8CC7A1)" },
                    { title: "Floor plan", color: "linear-gradient(135deg, #5B6475, #C4CAD6)" },
                    { title: "Open office", color: "linear-gradient(135deg, #8A5A1B, #E2B262)" },
                    { title: "Cafeteria", color: "linear-gradient(135deg, #7A2E3A, #D9828F)" },
                    { title: "Parking", color: "linear-gradient(135deg, var(--md-brand-900), var(--md-brand-600))" },
                  ]}
                />
              </Example>
              <Example title="Quote" code={`<Blockquote cite="Mehmet Kaya, CFO">Quote text</Blockquote>`}>
                <Blockquote cite="Mehmet Kaya, CFO">Every request should be approved within two working days. Clear forms are what make that possible.</Blockquote>
              </Example>
            </Col>
          </div>
        </Group>

        {/* ------------------------------------------------------------ */}
        <Group id="patterns" title="Page patterns" intro="Ready compositions you can copy into a new screen.">
          <div className="cards-grid">
            <Example title="Sign in">
              <Card variant="elevated" padding="lg" className="pattern-login">
                <Logo name="Workplace" short="WP" />
                <div>
                  <Heading level={5}>Sign in to your account</Heading>
                  <Text size="sm" tone="muted">Welcome back! Please enter your details.</Text>
                </div>
                <Input label="Email" type="email" placeholder="name@company.com" />
                <Input label="Password" type="password" placeholder="••••••••" labelAside={<Link href="#">Forgot?</Link>} />
                <Checkbox label="Keep me signed in" />
                <Button fullWidth>Sign in</Button>
                <Divider label="or" />
                <Button fullWidth variant="outline" icon="building">Continue with SSO</Button>
              </Card>
            </Example>
            <Example title="Settings section">
              <Card padding="none">
                <div className="pad">
                  <CardHeader title="Notifications" subtitle="Choose what you hear about." />
                </div>
                <Divider />
                <div className="pad g-col" style={{ gap: 16 }}>
                  <Switch defaultChecked label="Approvals" description="When someone needs your approval" />
                  <Switch defaultChecked label="Mentions" description="When someone mentions you" />
                  <Switch label="Weekly digest" description="Summary every Monday" />
                  <Select label="Email frequency" options={["Instantly", "Hourly", "Daily"]} />
                </div>
                <CardFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>
            </Example>
            <Example title="Request detail">
              <Card>
                <CardHeader title="Annual leave" subtitle="REQ-2026-0418" icon="calendar" actions={<StatusBadge status="pending" />} />
                <div className="md-card__body g-col" style={{ gap: 16 }}>
                  <DescriptionList items={[{ label: "Employee", value: <UserCell name="Mehmet Kaya" size="xs" /> }, { label: "Dates", value: "2 – 6 Dec · 5 days" }, { label: "Balance after", value: "9 days" }]} />
                  <Textarea label="Comment" placeholder="Add a note for Mehmet (optional)" rows={2} />
                </div>
                <CardFooter>
                  <Button variant="outline" icon="close">Reject</Button>
                  <Button icon="check" onClick={() => toast({ tone: "success", title: "Request approved" })}>Approve</Button>
                </CardFooter>
              </Card>
            </Example>
          </div>
        </Group>
      </div>

      {/* Overlays rendered once for the demos above */}
      <Modal
        open={modal === "form"}
        onClose={() => setModal(null)}
        title="Create project"
        description="Projects group tasks, files and people."
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={() => (setModal(null), toast({ tone: "success", title: "Project created" }))}>Create project</Button>
          </>
        }
      >
        <div className="g-col" style={{ gap: 16 }}>
          <Input label="Project name" placeholder="e.g. Website redesign" required />
          <Select label="Team" options={["Finance", "Engineering", "Sales"]} placeholder="Choose a team" />
          <Textarea label="Description" rows={3} />
          <Switch label="Private project" description="Only invited members can see it" />
        </div>
      </Modal>
      <Modal
        open={modal === "confirm"}
        onClose={() => setModal(null)}
        size="sm"
        tone="danger"
        title="Delete this document?"
        description="“Q4 budget.xlsx” will be permanently deleted. This cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => (setModal(null), toast({ tone: "danger", title: "Document deleted" }))}>Delete</Button>
          </>
        }
      />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={commands} />
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Employee details"
        footer={
          <>
            <Button variant="outline" onClick={() => setDrawer(false)}>Close</Button>
            <Button icon="edit">Edit</Button>
          </>
        }
      >
        <div className="g-col" style={{ gap: 20 }}>
          <UserCell name="Ayşe Demir" detail="Senior Accountant" size="lg" status="online" />
          <DescriptionList items={[{ label: "Email", value: "ayse.demir@company.com" }, { label: "Phone", value: "+90 212 555 01 23" }, { label: "Department", value: "Finance" }, { label: "Manager", value: "Mehmet Kaya" }, { label: "Start date", value: "4 March 2019" }]} />
          <Timeline items={[{ title: "Promoted to Senior", time: "2024", tone: "success", icon: "star" }, { title: "Joined Finance", time: "2019", tone: "primary", icon: "briefcase" }]} />
        </div>
      </Drawer>
    </div>
  );
}
