import { useRef, type PointerEvent } from "react";
import {
  AvatarGroup,
  BarChart,
  Button,
  ButtonLink,
  CircularProgress,
  CopyButton,
  Icon,
  Reveal,
  Sparkline,
  StatusBadge,
  Text,
  UserCell,
} from "@my-design/ui-web";

/**
 * The opening of the "All components" page: a 3D, layered scene built from the
 * real components. The sidebar is the index, so nothing else sits here.
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
            <h1 className="hero__title">Components for office web and mobile apps.</h1>
          </Reveal>
          <Reveal effect="up" delay={80}>
            <Text size="lg" tone="secondary">
              Navy and white, day and night. The same tokens and 72 icons drive the React web package and the React Native package. Change one brand color in <code>packages/tokens</code> and both follow.
            </Text>
          </Reveal>
          <Reveal effect="up" delay={160}>
            <div className="hero__actions">
              <Button size="lg" iconRight="arrowRight" onClick={() => go("buttons")}>
                Browse components
              </Button>
              <ButtonLink href="#web" size="lg" variant="elevated" icon="dashboard">
                Open the web app
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal effect="up" delay={240}>
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
          </div>
        </div>
      </div>

    </section>
  );
}
