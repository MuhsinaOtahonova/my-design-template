import { Children, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import {
  Accordion,
  Alert,
  AppBar,
  Avatar,
  AvatarGroup,
  Badge,
  BottomSheet,
  Button,
  Card,
  CardHeader,
  Carousel,
  ChatComposer,
  ChatMessage,
  Checkbox,
  Chip,
  Dialog,
  EmptyState,
  StatusDot,
  TagInput,
  Heading,
  IconButton,
  ListItem,
  ListSection,
  NumberStepper,
  Overline,
  ProfileHeader,
  Progress,
  RadioGroup,
  SearchBar,
  SegmentedControl,
  SelectField,
  Skeleton,
  Slider,
  Spinner,
  Stat,
  Steps,
  Switch,
  TabBar,
  Tabs,
  Text,
  TextField,
  ThemeProvider,
  Timeline,
  Toast,
  useColors,
  type ThemeMode,
  FadeIn,
  IconGrid,
  nativeIconNames,
  PressableScale,
  AnimatedNumber,
} from "@my-design/ui-native";

type Screen = "home" | "requests" | "components" | "profile";

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  // On the demo site the page passes ?theme=dark so the app matches the site
  const [mode, setMode] = useState<ThemeMode>(() =>
    Platform.OS === "web" && typeof window !== "undefined" && window.location.search.includes("theme=dark") ? "dark" : "light",
  );
  if (!fontsLoaded) return null;
  return (
    <ThemeProvider mode={mode}>
      <Shell mode={mode} toggle={() => setMode(mode === "light" ? "dark" : "light")} />
    </ThemeProvider>
  );
}

function Shell({ mode, toggle }: { mode: ThemeMode; toggle: () => void }) {
  const c = useColors();
  const [screen, setScreen] = useState<Screen>("home");
  const themeBtn = <IconButton icon={mode === "light" ? "moon" : "sun"} label={mode === "light" ? "Night mode" : "Day mode"} onPress={toggle} />;
  const titles: Record<Screen, string> = { home: "Good morning, Ayşe", requests: "Requests", components: "Components", profile: "Profile" };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
      <AppBar
        large
        title={titles[screen]}
        subtitle={screen === "home" ? "Wednesday, 18 November" : undefined}
        actions={
          <>
            {themeBtn}
            <IconButton icon="bell" label="Notifications" badge={3} />
          </>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn key={screen} distance={12}>
          {screen === "home" && <Home key="home" go={setScreen} />}
          {screen === "requests" && <Requests />}
          {screen === "components" && <Components />}
          {screen === "profile" && <Profile mode={mode} toggle={toggle} />}
        </FadeIn>
      </ScrollView>
      <TabBar
        value={screen}
        onChange={setScreen}
        items={[
          { value: "home", label: "Home", icon: "home" },
          { value: "requests", label: "Requests", icon: "inbox", badge: 4 },
          { value: "components", label: "Components", icon: "grid" },
          { value: "profile", label: "Profile", icon: "user" },
        ]}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Home: a typical office dashboard
// ---------------------------------------------------------------------------
/** Children fade and slide in one after another. */
function Stagger({ children, step = 90 }: { children: React.ReactNode; step?: number }) {
  return (
    <View style={styles.gap20}>
      {Children.toArray(children).map((child, i) => (
        <FadeIn key={i} delay={i * step}>
          {child}
        </FadeIn>
      ))}
    </View>
  );
}

function Home({ go }: { go: (s: Screen) => void }) {
  const c = useColors();
  return (
    <Stagger>
      <SearchBar placeholder="Search people, files, requests" />
      <View style={styles.row}>
        <Stat label="Open tasks" value="12" delta="3" trend="up" icon="task" />
        <Stat label="Leave days" value="14" icon="calendar" />
      </View>
      <Card padding={16} variant="elevated" onPress={() => {}} style={{ backgroundColor: c.primary, borderColor: c.primary, borderBottomWidth: 3, borderBottomColor: c.primaryActive }}>
        <Text weight="semibold" size="lg" style={{ color: c.onPrimary }}>Q4 budget review</Text>
        <Text style={{ color: c.onPrimary, opacity: 0.8, marginTop: 2 }}>Today · 14:00 – 15:00 · Room 4B</Text>
        <View style={[styles.row, { marginTop: 14, alignItems: "center", justifyContent: "space-between" }]}>
          <AvatarGroup names={["Ayşe Demir", "Mehmet Kaya", "Elif Şahin", "Can Yılmaz", "Zeynep Ak"]} max={3} />
          <Button variant="outline" size="sm" icon="phone">Join</Button>
        </View>
      </Card>
      <View>
        <Overline style={{ marginBottom: 8 }}>Quick actions</Overline>
        <View style={styles.wrap}>
          <Chip icon="calendar" label="Request leave" />
          <Chip icon="wallet" label="Expense" />
          <Chip icon="file" label="New document" />
          <Chip icon="users" label="Directory" />
        </View>
      </View>
      <ListSection title="Waiting for your approval">
        <ListItem leading={<Avatar name="Mehmet Kaya" size="sm" />} title="Annual leave · 5 days" subtitle="Mehmet Kaya · 2–6 Dec" trailing={<Badge tone="warning" dot>Pending</Badge>} onPress={() => go("requests")} />
        <ListItem leading={<Avatar name="Elif Şahin" size="sm" />} title="Travel expense · ₺4,250" subtitle="Elif Şahin · Ankara visit" trailing={<Badge tone="warning" dot>Pending</Badge>} onPress={() => go("requests")} />
        <ListItem leading={<Avatar name="Can Yılmaz" size="sm" />} title="New laptop" subtitle="Can Yılmaz · IT request" trailing={<Badge tone="info">New</Badge>} onPress={() => go("requests")} />
      </ListSection>
      <Card>
        <CardHeader title="Sprint progress" subtitle="Website redesign" icon="chart" />
        <View style={{ gap: 14, marginTop: 16 }}>
          <Progress label="Design" value={90} tone="success" />
          <Progress label="Development" value={62} />
          <Progress label="Testing" value={25} tone="warning" />
        </View>
      </Card>
      <Card>
        <CardHeader title="Recent activity" />
        <View style={{ marginTop: 16 }}>
          <Timeline
            items={[
              { title: "Contract signed", time: "09:40", description: "Acme Ltd. · Legal", tone: "success", icon: "check" },
              { title: "Invoice #1042 sent", time: "Yesterday", description: "Finance", tone: "primary", icon: "send" },
              { title: "Policy updated", time: "Mon", description: "Remote work policy v3", tone: "neutral", icon: "file" },
            ]}
          />
        </View>
      </Card>
    </Stagger>
  );
}

// ---------------------------------------------------------------------------
// Requests: tabs, list, form, dialog, toast
// ---------------------------------------------------------------------------
function Requests() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState(false);
  const [type, setType] = useState("annual");
  const [days, setDays] = useState(3);
  const rows = {
    pending: [
      ["Mehmet Kaya", "Annual leave · 5 days", "2–6 Dec"],
      ["Elif Şahin", "Travel expense · ₺4,250", "Ankara"],
      ["Can Yılmaz", "New laptop", "IT"],
      ["Zeynep Ak", "Training budget", "HR"],
    ],
    approved: [["Ali Vural", "Sick leave · 1 day", "12 Nov"]],
    rejected: [] as string[][],
  }[tab];
  return (
    <View style={styles.gap20}>
      <Tabs value={tab} onChange={setTab} items={[{ value: "pending", label: "Pending", count: 4 }, { value: "approved", label: "Approved", count: 1 }, { value: "rejected", label: "Rejected", count: 0 }]} />
      {rows.length === 0 ? (
        <EmptyState icon="inbox" title="No rejected requests" description="Requests you reject will show up here." />
      ) : (
        <ListSection>
          {rows.map(([name, title, meta]) => (
            <ListItem key={title} leading={<Avatar name={name!} size="md" />} title={title!} subtitle={`${name} · ${meta}`} chevron onPress={() => setConfirm(true)} />
          ))}
        </ListSection>
      )}
      <Button icon="plus" fullWidth onPress={() => setSheet(true)}>New request</Button>
      {toast && <Toast tone="success" title="Request approved" description="Mehmet will be notified." onClose={() => setToast(false)} />}

      <Dialog
        visible={confirm}
        onClose={() => setConfirm(false)}
        tone="success"
        title="Approve this request?"
        description="Mehmet Kaya · Annual leave, 2–6 December (5 days)."
        actions={
          <>
            <Button fullWidth onPress={() => (setConfirm(false), setToast(true))}>Approve</Button>
            <Button fullWidth variant="outline" onPress={() => setConfirm(false)}>Cancel</Button>
          </>
        }
      />
      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="New leave request">
        <View style={{ gap: 16 }}>
          <RadioGroup value={type} onChange={setType} options={[{ value: "annual", label: "Annual leave" }, { value: "sick", label: "Sick leave" }, { value: "unpaid", label: "Unpaid leave" }]} />
          <NumberStepper label="Days" value={days} onChange={setDays} min={1} max={30} />
          <TextField label="Note to manager" placeholder="Optional" multiline />
          <Button fullWidth onPress={() => setSheet(false)}>Submit request</Button>
        </View>
      </BottomSheet>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Components: every native component
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Overline>{title}</Overline>
      {children}
    </View>
  );
}

function Components() {
  const c = useColors();
  const [check, setCheck] = useState(true);
  const [sw, setSw] = useState(true);
  const [vol, setVol] = useState(40);
  const [seg, setSeg] = useState("week");
  const [chips, setChips] = useState(["Finance"]);
  const [step, setStep] = useState(1);
  const [n, setN] = useState(2);
  const [msgs, setMsgs] = useState([{ a: "Mehmet Kaya", t: "Can you review the Q4 budget today?", own: false }, { a: "You", t: "Sure, I'll send comments by 3 PM.", own: true }]);
  return (
    <View style={{ gap: 32 }}>
      <Section title="Typography">
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
        <Heading level={4}>Heading 4</Heading>
        <Text>Body text. Inter Regular for clear, readable office screens.</Text>
        <Text tone="secondary">Secondary text</Text>
        <Text size="sm" tone="muted">Muted caption</Text>
      </Section>

      <Section title="Buttons">
        <View style={styles.wrap}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" icon="trash">Delete</Button>
        </View>
        <View style={styles.wrap}>
          <Button size="sm">Small</Button>
          <Button size="lg" icon="send">Large</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </View>
        <View style={styles.wrap}>
          <IconButton icon="edit" label="Edit" variant="outline" />
          <IconButton icon="link" label="Copy link" variant="secondary" />
          <IconButton icon="bell" label="Alerts" badge={5} />
          <IconButton icon="plus" label="Add" variant="primary" />
        </View>
        <Button fullWidth iconRight="arrowRight">Full width</Button>
      </Section>

      <Section title="Inputs">
        <TextField label="Full name" placeholder="Ayşe Demir" icon="user" required />
        <TextField label="Email" placeholder="name@company.com" icon="mail" keyboardType="email-address" hint="We never share your email." />
        <TextField label="Password" placeholder="••••••••" secureTextEntry />
        <TextField label="IBAN" defaultValue="TR12 3456" error="IBAN must be 26 characters" />
        <SelectField label="Department" value="Finance" icon="building" />
        <SearchBar />
      </Section>

      <Section title="Selection">
        <Checkbox checked={check} onChange={setCheck} label="Send me a weekly summary" description="Every Monday at 09:00" />
        <Switch checked={sw} onChange={setSw} label="Push notifications" />
        <RadioGroup value={seg === "week" ? "a" : "b"} onChange={(v) => setSeg(v === "a" ? "week" : "month")} options={[{ value: "a", label: "Weekly" }, { value: "b", label: "Monthly" }]} />
        <SegmentedControl value={seg} onChange={setSeg} options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
        <Slider label="Budget" value={vol} onChange={setVol} format={(v) => `${v}%`} />
        <NumberStepper label="Guests" value={n} onChange={setN} />
        <View style={styles.wrap}>
          {["Finance", "HR", "Sales", "IT"].map((t) => (
            <Chip key={t} label={t} selected={chips.includes(t)} onPress={() => setChips(chips.includes(t) ? chips.filter((x) => x !== t) : [...chips, t])} />
          ))}
        </View>
      </Section>

      <Section title="Motion & depth">
        <View style={styles.row}>
          {[
            { v: 342, l: "Requests", s: "" },
            { v: 98, l: "On time", s: "%" },
          ].map((x) => (
            <PressableScale key={x.l} style={{ flex: 1 }} onPress={() => {}}>
              <Card variant="elevated" padding={14}>
                <Text size="sm" tone="muted">{x.l}</Text>
                <AnimatedNumber value={x.v} suffix={x.s} style={{ fontSize: 26, fontFamily: "Inter_700Bold", color: c.text }} />
              </Card>
            </PressableScale>
          ))}
        </View>
        <Text size="sm" tone="muted">Tap the cards: they press in and spring back. Buttons do the same and have a 3D bottom edge.</Text>
      </Section>

      <Section title={`Icons (${nativeIconNames.length})`}>
        <IconGrid columns={4} />
        <Text size="sm" tone="muted">Press a tile: it tips toward your finger, then settles back.</Text>
      </Section>

      <Section title="Status, tags & chat">
        <View style={styles.wrap}>
          <StatusDot tone="success" label="Online" />
          <StatusDot tone="warning" label="Away" />
          <StatusDot tone="danger" label="Busy" />
          <StatusDot tone="neutral" label="Offline" />
        </View>
        <TagInput label="Labels" defaultValue={["Finance", "Q4"]} />
        <Card>
          <View style={{ gap: 12 }}>
            {msgs.map((m, k) => (
              <ChatMessage key={k} author={m.a} time="10:42" own={m.own} status={m.own ? "read" : undefined}>
                {m.t}
              </ChatMessage>
            ))}
            <ChatComposer onSend={(t) => setMsgs([...msgs, { a: "You", t, own: true }])} />
          </View>
        </Card>
      </Section>

      <Section title="Badges & avatars">
        <View style={styles.wrap}>
          <Badge>Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success" dot>Approved</Badge>
          <Badge tone="warning" dot>Pending</Badge>
          <Badge tone="danger" dot>Overdue</Badge>
          <Badge tone="info">Info</Badge>
        </View>
        <View style={[styles.wrap, { alignItems: "center" }]}>
          <Avatar name="Ayşe Demir" size="xs" />
          <Avatar name="Mehmet Kaya" size="sm" status="online" />
          <Avatar name="Elif Şahin" size="md" status="away" />
          <Avatar name="Can Yılmaz" size="lg" status="busy" />
          <AvatarGroup names={["A B", "C D", "E F", "G H", "I J", "K L"]} />
        </View>
      </Section>

      <Section title="Cards & stats">
        <View style={styles.row}>
          <Stat label="Revenue" value="₺1.2M" delta="8%" />
          <Stat label="Churn" value="2.1%" delta="0.4%" trend="down" />
        </View>
        <Card>
          <CardHeader title="Card title" subtitle="Supporting text" icon="briefcase" action={<IconButton icon="moreVertical" label="More" />} />
          <Text tone="secondary" style={{ marginTop: 12 }}>Cards group related content and actions.</Text>
          <View style={[styles.row, { marginTop: 14 }]}>
            <Button size="sm">Open</Button>
            <Button size="sm" variant="ghost">Dismiss</Button>
          </View>
        </Card>
        <Carousel itemWidth={240}>
          {["Onboarding", "Benefits", "Security"].map((t, i) => (
            <Card key={t} variant="muted" style={{ height: 120, justifyContent: "flex-end" }}>
              <Overline>Guide {i + 1}</Overline>
              <Text weight="semibold" size="lg">{t}</Text>
            </Card>
          ))}
        </Carousel>
      </Section>

      <Section title="Lists">
        <ListSection title="Settings" footer="Grouped list with icons, values and chevrons.">
          <ListItem icon="user" title="Account" chevron onPress={() => {}} />
          <ListItem icon="bell" title="Notifications" value="On" chevron onPress={() => {}} />
          <ListItem icon="lock" title="Privacy" chevron onPress={() => {}} />
          <ListItem icon="logout" title="Sign out" danger onPress={() => {}} />
        </ListSection>
      </Section>

      <Section title="Feedback">
        <Alert tone="info" title="Heads up">New policy goes live on 1 December.</Alert>
        <Alert tone="success" title="Saved">Your changes were saved.</Alert>
        <Alert tone="warning" title="Expiring soon">Your password expires in 3 days.</Alert>
        <Alert tone="danger" title="Upload failed" onClose={() => {}}>File is larger than 10 MB.</Alert>
        <Toast title="Message sent" description="Delivered to 4 people" />
        <Progress label="Storage" value={68} />
        <View style={[styles.row, { alignItems: "center" }]}>
          <Spinner />
          <Spinner size="large" />
        </View>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Skeleton circle height={44} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="70%" />
            <Skeleton width="45%" />
          </View>
        </View>
      </Section>

      <Section title="Navigation">
        <Steps steps={["Details", "Approval", "Payment", "Done"]} current={step} />
        <View style={styles.row}>
          <Button size="sm" variant="outline" onPress={() => setStep(Math.max(0, step - 1))}>Back</Button>
          <Button size="sm" onPress={() => setStep(Math.min(4, step + 1))}>Next</Button>
        </View>
        <Accordion
          items={[
            { title: "How do I request leave?", content: "Open Requests, tap New request and choose the leave type." },
            { title: "Who approves expenses?", content: "Your line manager, then Finance for amounts over ₺10,000." },
            { title: "Can I work remotely?", content: "Up to 2 days a week, agreed with your manager." },
          ]}
        />
      </Section>

      <Section title="Empty state">
        <Card>
          <EmptyState icon="folder" title="No documents yet" description="Upload a file or create a new document." action={<Button size="sm" icon="upload">Upload</Button>} />
        </Card>
      </Section>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
function Profile({ mode, toggle }: { mode: ThemeMode; toggle: () => void }) {
  return (
    <View style={styles.gap20}>
      <ProfileHeader
        name="Ayşe Demir"
        title="Senior Accountant · Finance"
        status="online"
        actions={
          <>
            <Button size="sm" icon="edit">Edit profile</Button>
            <Button size="sm" variant="outline" icon="message">Message</Button>
          </>
        }
        stats={[{ label: "Projects", value: "12" }, { label: "Leave left", value: "14d" }, { label: "Reports", value: "5" }]}
      />
      <ListSection title="Contact">
        <ListItem icon="mail" title="ayse.demir@company.com" />
        <ListItem icon="phone" title="+90 212 555 01 23" />
        <ListItem icon="mapPin" title="Istanbul HQ · Floor 4" />
      </ListSection>
      <ListSection title="Preferences">
        <View style={{ padding: 16 }}>
          <Switch checked={mode === "dark"} onChange={toggle} label="Night mode" description="Dark colors for low light" />
        </View>
        <ListItem icon="globe" title="Language" value="English" chevron onPress={() => {}} />
        <ListItem icon="shield" title="Security" chevron onPress={() => {}} />
        <ListItem icon="logout" title="Sign out" danger onPress={() => {}} />
      </ListSection>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  gap20: { gap: 20 },
  row: { flexDirection: "row", gap: 12 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
});
