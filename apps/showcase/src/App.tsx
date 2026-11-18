import { useEffect, useState } from "react";
import { Button, IconButton, Logo, SegmentedControl, Text, useTheme } from "@my-design/ui-web";
import { DeviceFrame } from "./DeviceFrame";
import { Gallery } from "./Gallery";

const tabs = [
  { id: "components", label: "All components" },
  { id: "web", label: "Web app" },
  { id: "mobile", label: "Mobile app" },
  { id: "side-by-side", label: "Side by side" },
] as const;
type Tab = (typeof tabs)[number]["id"];

const widths = [
  { id: "desktop", label: "Desktop", w: 1366, h: 860 },
  { id: "tablet", label: "Tablet", w: 820, h: 1080 },
  { id: "phone", label: "Phone", w: 390, h: 844 },
] as const;

// The other demo builds are published next to this page (see .github/workflows/pages.yml)
const WEB = "./web/";
const MOBILE = "./mobile/";
const STORYBOOK = "./storybook/";

// Older links keep working
const aliases: Record<string, Tab> = { mobil: "mobile", "yan-yana": "side-by-side", bilesenler: "components" };

function readTab(): Tab {
  const raw = window.location.hash.replace("#", "").split("/")[0]!;
  const h = aliases[raw] ?? raw;
  return (tabs.find((t) => t.id === h)?.id ?? "components") as Tab;
}

export function App() {
  const [tab, setTab] = useState<Tab>(readTab);
  const [size, setSize] = useState<(typeof widths)[number]["id"]>("desktop");
  const { theme, setTheme } = useTheme();
  const device = widths.find((w) => w.id === size)!;
  const q = theme === "dark" ? "?theme=dark" : "";

  useEffect(() => {
    const onHash = () => setTab(readTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (t: Tab) => {
    window.location.hash = t;
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="sc">
      <header className="sc-header">
        <div className="sc-header__inner">
          <Logo name="My Design" short="MD" />
          <nav className="sc-tabs" role="tablist">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className="sc-tab" onClick={() => go(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="sc-header__right">
            <a className="md-link sc-hide-sm" href={STORYBOOK} target="_blank" rel="noreferrer">Storybook ↗</a>
            <SegmentedControl
              size="sm"
              aria-label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: "Day", icon: "sun" },
                { value: "dark", label: "Night", icon: "moon" },
              ]}
            />
            <a href="https://github.com/MuhsinaOtahonova/my-design-template" target="_blank" rel="noreferrer" className="sc-hide-sm">
              <IconButton icon="external" label="Source on GitHub" tabIndex={-1} />
            </a>
          </div>
        </div>
      </header>

      <main className="sc-main">
        {tab === "components" && (
          <>
            <div className="sc-intro">
              <h1 className="md-heading md-heading--2">Component library</h1>
              <Text size="lg" tone="secondary">
                Every building block for professional web and mobile apps, in navy and white with a day and night theme.
                Each example shows its code. Use this page as a reference when building a new screen.
              </Text>
            </div>
            <Gallery />
          </>
        )}

        {tab === "web" && (
          <section className="sc-section">
            <div className="sc-toolbar">
              <Text tone="secondary">A sample office app (dashboard, employees, profile, settings) built only with these components.</Text>
              <SegmentedControl value={size} onChange={setSize} options={widths.map((w) => ({ value: w.id, label: w.label }))} aria-label="Screen size" />
            </div>
            {device.id === "phone" ? (
              <DeviceFrame key={q} kind="phone" src={WEB + q} title="Web app (phone)" width={device.w} height={device.h} maxWidth={420} />
            ) : (
              <DeviceFrame key={q + device.id} kind="browser" src={WEB + q} title="Open the web app full screen" width={device.w} height={device.h} />
            )}
          </section>
        )}

        {tab === "mobile" && (
          <section className="sc-section sc-section--center">
            <Text tone="secondary" className="sc-center">
              The Expo mobile app running in the browser. Use the tabs at the bottom (Home, Requests, Components, Profile)
              and the moon icon for night mode.
            </Text>
            <DeviceFrame key={q} kind="phone" src={MOBILE + q} title="Mobile app" width={390} height={844} maxWidth={420} />
            <Button variant="outline" icon="external" onClick={() => window.open(MOBILE + q, "_blank")}>Open full screen on your phone</Button>
          </section>
        )}

        {tab === "side-by-side" && (
          <section className="sc-section sc-side">
            <div>
              <h2 className="md-heading md-heading--6 sc-cap">Web app</h2>
              <DeviceFrame key={q} kind="browser" src={WEB + q} title="Web app" width={1366} height={900} />
            </div>
            <div>
              <h2 className="md-heading md-heading--6 sc-cap">Mobile app</h2>
              <DeviceFrame key={q} kind="phone" src={MOBILE + q} title="Mobile app" width={390} height={844} maxWidth={380} />
            </div>
          </section>
        )}
      </main>

      <footer className="sc-footer">
        <Text size="sm" tone="muted">
          Source: <a className="md-link" href="https://github.com/MuhsinaOtahonova/my-design-template">github.com/MuhsinaOtahonova/my-design-template</a>
        </Text>
      </footer>
    </div>
  );
}
