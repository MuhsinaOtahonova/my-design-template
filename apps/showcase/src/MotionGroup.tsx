import { useState } from "react";
import {
  AnimatedNumber,
  Avatar,
  Badge,
  Button,
  CardStack,
  CopyButton,
  HoldButton,
  Icon,
  IconButton,
  Overline,
  Reveal,
  SegmentedControl,
  SpeedDial,
  SplitButton,
  SpotlightCard,
  StatusDot,
  Text,
  TiltCard,
  TiltLayer,
  useToast,
  type RevealEffect,
} from "@my-design/ui-web";
import { Col, Example, Group, Row } from "./blocks";

const effects: RevealEffect[] = ["up", "left", "right", "scale", "blur", "flip"];

export function MotionGroup() {
  const toast = useToast();
  const [replay, setReplay] = useState(0);
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");
  const [goal, setGoal] = useState(68);

  const runSave = () => {
    setSave("saving");
    window.setTimeout(() => setSave("saved"), 1300);
    window.setTimeout(() => setSave("idle"), 3000);
  };

  return (
    <Group id="motion" title="Motion & 3D" intro="Depth comes from layered shadows and a light top edge; motion uses short spring curves. Everything turns off when the system asks for reduced motion.">
      <div className="ex-pair">
        <Example
          title="3D buttons"
          note="Hover lifts, press sinks, a ripple starts where you click. Primary buttons get a light sweep."
          code={`<Button>Approve</Button>\n<Button variant="elevated">Review</Button>\n<Button variant="danger">Reject</Button>`}
        >
          <Col gap={14}>
            <Row>
              <Button icon="check">Approve</Button>
              <Button variant="elevated" icon="eye">Review</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger" icon="close">Reject</Button>
            </Row>
            <Row>
              <Button size="lg" iconRight="arrowRight">Continue</Button>
              <Button size="lg" variant="elevated" icon="download">Export</Button>
              <IconButton icon="bell" label="Alerts" variant="outline" badge={3} />
              <IconButton icon="settings" label="Settings" variant="elevated" />
            </Row>
          </Col>
        </Example>
        <Example
          title="Button scenarios"
          note="Async save with feedback, split actions, copy, and hold to confirm a destructive step."
          code={`<SplitButton icon="send" items={[{ label: "Schedule send", icon: "clock" }]}>Send</SplitButton>\n<HoldButton onConfirm={remove}>Hold to delete</HoldButton>\n<CopyButton value="INV-1042">Copy ID</CopyButton>`}
        >
          <Col gap={14}>
            <Row>
              <Button
                icon={save === "saved" ? "checkCircle" : "upload"}
                loading={save === "saving"}
                variant={save === "saved" ? "secondary" : "primary"}
                onClick={runSave}
                className={save === "saved" ? "g-saved" : undefined}
              >
                {save === "saving" ? "Saving…" : save === "saved" ? "Saved" : "Save changes"}
              </Button>
              <SplitButton
                icon="send"
                variant="elevated"
                onClick={() => toast({ tone: "success", title: "Report sent" })}
                items={[
                  { label: "Schedule send", icon: "clock" },
                  { label: "Send as PDF", icon: "file" },
                  { type: "divider" },
                  { label: "Save as draft", icon: "edit" },
                ]}
              >
                Send report
              </SplitButton>
            </Row>
            <Row>
              <HoldButton onConfirm={() => toast({ tone: "danger", title: "Project deleted" })}>Hold to delete</HoldButton>
              <CopyButton value="INV-1042">Copy invoice ID</CopyButton>
              <CopyButton value="https://company.com/r/1042" />
            </Row>
          </Col>
        </Example>
      </div>

      <div className="ex-pair">
        <Example
          title="Tilt cards"
          note="Move the pointer over the cards. Inner layers float at different depths."
          code={`<TiltCard variant="brand">\n  <TiltLayer depth={40}>…</TiltLayer>\n</TiltCard>`}
        >
          <div className="tilt-row">
            <TiltCard variant="brand" padding="lg" className="tilt-badge">
              <TiltLayer depth={20}>
                <div className="tilt-badge__top">
                  <span className="tilt-badge__logo">MD</span>
                  <span className="tilt-badge__chip" />
                </div>
              </TiltLayer>
              <TiltLayer depth={45}>
                <div className="tilt-badge__num">5412 •••• •••• 1042</div>
              </TiltLayer>
              <TiltLayer depth={30}>
                <div className="tilt-badge__foot">
                  <div>
                    <span>Card holder</span>
                    <strong>AYŞE DEMIR</strong>
                  </div>
                  <div>
                    <span>Limit</span>
                    <strong>₺50,000</strong>
                  </div>
                </div>
              </TiltLayer>
            </TiltCard>
            <TiltCard padding="lg" className="tilt-id" max={12}>
              <TiltLayer depth={35}>
                <Avatar name="Mehmet Kaya" size="xl" status="online" />
              </TiltLayer>
              <TiltLayer depth={25}>
                <strong className="tilt-id__name">Mehmet Kaya</strong>
                <Text size="sm" tone="muted">Product Manager</Text>
              </TiltLayer>
              <TiltLayer depth={15}>
                <div className="tilt-id__meta">
                  <Badge tone="primary">Product</Badge>
                  <Badge>ID 20341</Badge>
                </div>
              </TiltLayer>
              <div className="tilt-id__code" aria-hidden />
            </TiltCard>
          </div>
        </Example>
        <Example title="Card stack" note="Click the top card, or use the arrows, to flip through." code={`<CardStack items={[<Announcement />, <Announcement />]} />`}>
          <CardStack
            label="Announcements"
            height={180}
            items={[
              { icon: "calendar" as const, tone: "primary" as const, tag: "Event", title: "Town hall on Friday", text: "Q4 results and plans for next year. Main hall, 15:00." },
              { icon: "shield" as const, tone: "warning" as const, tag: "IT", title: "Password change required", text: "Please update your password before 30 November." },
              { icon: "star" as const, tone: "success" as const, tag: "People", title: "Welcome, Can Yılmaz", text: "Our new frontend engineer joins the web team today." },
              { icon: "wallet" as const, tone: "info" as const, tag: "Finance", title: "Expense deadline", text: "Submit November expenses by the 5th to be paid this month." },
            ].map((a) => (
              <div key={a.title} className="stack-card">
                <div className="stack-card__head">
                  <span className={`stack-card__icon stack-card__icon--${a.tone}`}>
                    <Icon name={a.icon} size={18} />
                  </span>
                  <Badge tone={a.tone}>{a.tag}</Badge>
                </div>
                <strong>{a.title}</strong>
                <Text size="sm" tone="secondary">{a.text}</Text>
              </div>
            ))}
          />
        </Example>
      </div>

      <Example title="Spotlight cards" note="A soft light and a border glow follow the pointer." code={`<SpotlightCard>…</SpotlightCard>`}>
        <div className="spot-grid">
          {[
            { icon: "zap" as const, title: "Fast approvals", text: "Requests reach the right manager in one step." },
            { icon: "shield" as const, title: "Secure by default", text: "SSO, roles and audit logs for every action." },
            { icon: "chart" as const, title: "Live reports", text: "Budgets and headcount update as you work." },
          ].map((f) => (
            <SpotlightCard key={f.title} padding="lg">
              <span className="spot-icon">
                <Icon name={f.icon} size={20} />
              </span>
              <strong className="spot-title">{f.title}</strong>
              <Text size="sm" tone="secondary">{f.text}</Text>
            </SpotlightCard>
          ))}
        </div>
      </Example>

      <div className="ex-pair">
        <Example
          title="Counting numbers"
          note="Numbers count up when they scroll into view, and tween when the value changes."
          code={`<AnimatedNumber value={1240000} prefix="₺" />\n<AnimatedNumber value={goal} suffix="%" />`}
        >
          <Col gap={16}>
            <div className="count-row">
              <div>
                <Overline>Revenue</Overline>
                <strong className="count-big"><AnimatedNumber value={1240000} prefix="₺" /></strong>
              </div>
              <div>
                <Overline>Goal</Overline>
                <strong className="count-big"><AnimatedNumber value={goal} suffix="%" /></strong>
              </div>
              <div>
                <Overline>Uptime</Overline>
                <strong className="count-big"><AnimatedNumber value={99.98} decimals={2} suffix="%" /></strong>
              </div>
            </div>
            <Row>
              <SegmentedControl
                aria-label="Goal"
                defaultValue="68"
                onChange={(v) => setGoal(Number(v))}
                options={[{ value: "42", label: "Q1" }, { value: "57", label: "Q2" }, { value: "68", label: "Q3" }, { value: "91", label: "Q4" }]}
              />
              <StatusDot tone="success" label="Live" pulse />
            </Row>
          </Col>
        </Example>
        <Example
          title="Reveal on scroll"
          note="Six entrance effects. Wrap any block in <Reveal>."
          code={`<Reveal effect="up">…</Reveal>\n<Reveal effect="scale" delay={120}>…</Reveal>`}
        >
          <Col gap={14}>
            <div className="reveal-grid" key={replay}>
              {effects.map((e, i) => (
                <Reveal key={e} effect={e} delay={i * 90}>
                  <div className="reveal-box">
                    <Icon name="layers" size={18} />
                    <code>{e}</code>
                  </div>
                </Reveal>
              ))}
            </div>
            <Row>
              <Button size="sm" variant="outline" icon="refresh" onClick={() => setReplay((r) => r + 1)}>
                Replay
              </Button>
            </Row>
          </Col>
        </Example>
      </div>

      <Example
        title="Floating action button"
        note="A speed dial for the most common actions on mobile and dense screens."
        code={`<SpeedDial actions={[{ icon: "file", label: "New document" }, { icon: "users", label: "Invite" }]} />`}
      >
        <div className="dial-demo">
          <Text tone="muted" size="sm">Click the button in the corner</Text>
          <SpeedDial
            className="dial-demo__fab"
            actions={[
              { icon: "file", label: "New document", onClick: () => toast({ title: "New document" }) },
              { icon: "calendar", label: "Book a room", onClick: () => toast({ title: "Book a room" }) },
              { icon: "users", label: "Invite a colleague", onClick: () => toast({ title: "Invite sent" }) },
              { icon: "wallet", label: "New expense", onClick: () => toast({ title: "New expense" }) },
            ]}
          />
        </div>
      </Example>
    </Group>
  );
}
