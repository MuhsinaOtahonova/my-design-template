import { useRef, type PointerEvent } from "react";
import {
  AnimatedNumber,
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  Button,
  ButtonLink,
  CircularProgress,
  CopyButton,
  Icon,
  Overline,
  Reveal,
  RevealGroup,
  Sparkline,
  SpotlightCard,
  StatusBadge,
  Switch,
  Text,
  UserCell,
} from "@my-design/ui-web";

/**
 * The opening of the "All components" page: a 3D, layered scene built from the
 * real components, followed by a bento grid that jumps to each section.
 */
export function Hero({ go }: { go: (id: string) => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = scene.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  };
  const reset = () => {
    scene.current?.style.setProperty("--px", "0");
    scene.current?.style.setProperty("--py", "0");
  };

  return (
    <section id="overview" className="hero-wrap">
      <div className="hero">
        <div className="hero__copy">
          <Reveal effect="up">
            <Badge tone="primary" dot>
              v2 · Motion & depth
            </Badge>
          </Reveal>
          <Reveal effect="up" delay={80}>
            <h1 className="hero__title">
              Office UI with <span className="hero__accent">depth</span> and calm motion.
            </h1>
          </Reveal>
          <Reveal effect="up" delay={160}>
            <Text size="lg" tone="secondary">
              120+ navy and white components for web and mobile, in day and night themes. Layered shadows, 3D cards and spring animations that respect “reduce motion”.
            </Text>
          </Reveal>
          <Reveal effect="up" delay={240}>
            <div className="hero__actions">
              <Button size="lg" iconRight="arrowRight" onClick={() => go("buttons")}>
                Browse components
              </Button>
              <ButtonLink href="#web" size="lg" variant="elevated" icon="dashboard">
                Open the web app
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal effect="up" delay={320}>
            <div className="hero__install">
              <code>pnpm add @my-design/ui-web</code>
              <CopyButton value="pnpm add @my-design/ui-web" variant="ghost" size="sm" />
            </div>
          </Reveal>
        </div>

        {/* 3D scene: real components on layers at different depths */}
        <div className="hero__scene" ref={scene} onPointerMove={move} onPointerLeave={reset} aria-hidden>
          <div className="hero__stage">
            <div className="hero__layer hero__layer--base">
              <div className="mini-app">
                <div className="mini-app__side">
                  <span className="mini-app__logo">MD</span>
                  {(["dashboard", "users", "folder", "calendar", "chart"] as const).map((i, k) => (
                    <span key={i} className={k === 0 ? "is-active" : undefined}>
                      <Icon name={i} size={16} />
                    </span>
                  ))}
                </div>
                <div className="mini-app__main">
                  <div className="mini-app__top">
                    <strong>Dashboard</strong>
                    <AvatarGroup names={["Ayşe Demir", "Mehmet Kaya", "Elif Şahin"]} size="xs" />
                  </div>
                  <div className="mini-app__stats">
                    <div>
                      <span>Revenue</span>
                      <strong>₺1.24M</strong>
                      <Sparkline values={[4, 6, 5, 8, 7, 9, 11]} width={90} height={24} />
                    </div>
                    <div>
                      <span>Requests</span>
                      <strong>342</strong>
                      <Sparkline values={[9, 7, 8, 6, 7, 5, 6]} width={90} height={24} />
                    </div>
                  </div>
                  <BarChart height={110} data={[{ label: "Jan", value: 42 }, { label: "Feb", value: 58 }, { label: "Mar", value: 51 }, { label: "Apr", value: 74 }, { label: "May", value: 66 }, { label: "Jun", value: 88 }]} />
                </div>
              </div>
            </div>
            <div className="hero__layer hero__layer--card">
              <UserCell name="Ayşe Demir" detail="Senior Accountant" status="online" />
              <div className="hero__row">
                <StatusBadge status="approved" />
                <Text size="xs" tone="muted">
                  Leave request · 3 days
                </Text>
              </div>
            </div>
            <div className="hero__layer hero__layer--toast">
              <span className="hero__toast-icon">
                <Icon name="checkCircle" size={18} />
              </span>
              <div>
                <strong>Invoice paid</strong>
                <span>INV-1042 · ₺18,400</span>
              </div>
            </div>
            <div className="hero__layer hero__layer--ring">
              <CircularProgress value={86} size={64} />
              <div>
                <strong>86%</strong>
                <span>Q4 goal</span>
              </div>
            </div>
            <div className="hero__layer hero__layer--chip">
              <Switch defaultChecked size="sm" label="Night shift" />
            </div>
          </div>
        </div>
      </div>

      {/* Numbers that count up */}
      <RevealGroup className="hero__numbers" stagger={90}>
        <div>
          <strong><AnimatedNumber value={120} suffix="+" /></strong>
          <span className="hero__num-label">components</span>
        </div>
        <div>
          <strong><AnimatedNumber value={73} /></strong>
          <span className="hero__num-label">shared icons</span>
        </div>
        <div>
          <strong><AnimatedNumber value={2} /></strong>
          <span className="hero__num-label">themes, day and night</span>
        </div>
        <div>
          <strong><AnimatedNumber value={1} /></strong>
          <span className="hero__num-label">line to change the brand color</span>
        </div>
      </RevealGroup>

      {/* Bento grid: a preview of each area, click to jump */}
      <div className="bento">
        <Reveal effect="up" className="bento__a">
          <SpotlightCard as="button" className="bento__tile" onClick={() => go("buttons")}>
            <Overline>Buttons</Overline>
            <div className="bento__demo bento__demo--buttons">
              <span className="md-btn md-btn--primary md-btn--md"><span className="md-btn__fx" />Approve</span>
              <span className="md-btn md-btn--elevated md-btn--md"><span className="md-btn__fx" />Review</span>
              <span className="md-btn md-btn--danger md-btn--md"><span className="md-btn__fx" />Reject</span>
            </div>
            <Text size="sm" tone="muted">3D press, ripple, split and hold-to-confirm</Text>
          </SpotlightCard>
        </Reveal>
        <Reveal effect="up" delay={80} className="bento__b">
          <SpotlightCard as="button" className="bento__tile" onClick={() => go("forms")}>
            <Overline>Forms</Overline>
            <div className="bento__demo bento__fields" aria-hidden>
              <span className="bento__fake"><Icon name="mail" size={15} />name@company.com</span>
              <span className="bento__fake bento__fake--focus"><Icon name="search" size={15} />Search employees<i /></span>
            </div>
            <Text size="sm" tone="muted">Inputs, pickers, sliders, uploads</Text>
          </SpotlightCard>
        </Reveal>
        <Reveal effect="up" delay={160} className="bento__c">
          <SpotlightCard as="button" className="bento__tile bento__tile--brand" onClick={() => go("motion")}>
            <Overline>Motion & 3D</Overline>
            <div className="bento__cube" aria-hidden>
              <span /><span /><span /><span /><span /><span />
            </div>
            <Text size="sm">Tilt cards, card stacks, reveal on scroll</Text>
          </SpotlightCard>
        </Reveal>
        <Reveal effect="up" delay={80} className="bento__d">
          <SpotlightCard as="button" className="bento__tile" onClick={() => go("charts")}>
            <Overline>Charts</Overline>
            <div className="bento__demo">
              <Sparkline values={[3, 5, 4, 7, 6, 9, 8, 12, 10, 14]} width={220} height={48} />
            </div>
            <Text size="sm" tone="muted">Bar, donut, sparkline</Text>
          </SpotlightCard>
        </Reveal>
        <Reveal effect="up" delay={160} className="bento__e">
          <SpotlightCard as="button" className="bento__tile" onClick={() => go("profile")}>
            <Overline>People</Overline>
            <div className="bento__demo bento__people">
              <Avatar name="Ayşe Demir" status="online" />
              <Avatar name="Mehmet Kaya" status="away" />
              <Avatar name="Elif Şahin" status="busy" />
            </div>
            <Text size="sm" tone="muted">Profiles, avatars, chat</Text>
          </SpotlightCard>
        </Reveal>
        <Reveal effect="up" delay={240} className="bento__f">
          <SpotlightCard as="button" className="bento__tile" onClick={() => go("shell")}>
            <Overline>App shell</Overline>
            <div className="bento__shell" aria-hidden>
              <span className="bento__shell-nav" />
              <span className="bento__shell-main">
                <i /><i /><i />
              </span>
            </div>
            <Text size="sm" tone="muted">Navy sidebar, top bar, mobile tabs</Text>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
