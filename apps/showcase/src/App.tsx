import { useEffect, useState } from "react";
import { Button, GlassPanel, Heading, Orb, Scene, Text } from "@my-design/ui-web";
import { DeviceFrame } from "./DeviceFrame";
import { Gallery } from "./Gallery";

const tabs = [
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "side-by-side", label: "Side by side" },
  { id: "components", label: "All components" },
] as const;
type Tab = (typeof tabs)[number]["id"];

const widths = [
  { id: "desktop", label: "Desktop", w: 1280, h: 860 },
  { id: "tablet", label: "Tablet", w: 820, h: 1000 },
  { id: "phone", label: "Phone", w: 390, h: 844 },
] as const;

// The other demo builds are published next to this page (see .github/workflows/pages.yml)
const WEB = "./web/";
const MOBILE = "./mobile/";
const STORYBOOK = "./storybook/";

// Older Turkish links keep working
const aliases: Record<string, Tab> = { mobil: "mobile", "yan-yana": "side-by-side", bilesenler: "components" };

function readTab(): Tab {
  const raw = window.location.hash.replace("#", "");
  const h = aliases[raw] ?? raw;
  return (tabs.find((t) => t.id === h)?.id ?? "web") as Tab;
}

export function App() {
  const [tab, setTab] = useState<Tab>(readTab);
  const [size, setSize] = useState<(typeof widths)[number]["id"]>("desktop");
  const device = widths.find((w) => w.id === size)!;

  useEffect(() => {
    const onHash = () => setTab(readTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (t: Tab) => {
    window.location.hash = t;
    setTab(t);
  };

  return (
    <Scene className="sc-page">
      <Orb size={120} className="sc-deco sc-deco--a" />
      <Orb size={56} variant="rose" className="sc-deco sc-deco--b" />

      <div className="sc-layout">
        <GlassPanel tone="dark" elevation="lg" padding="lg" drip={{ intensity: 0.8, drops: [22, 74] }} className="sc-hero">
          <span className="sc-brand" lang="en"><Orb size={18} variant="pearl" float={false} /> My Design</span>
          <Heading level={1}>Live Demo</Heading>
          <Text muted>
            Frosted glass, dusty rose and lavender tones, melting edges. One design system
            for both the website and the mobile app. Pick a view below.
          </Text>
          <div className="sc-tabs" role="tablist">
            {tabs.map((t) => (
              <Button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                variant={tab === t.id ? "solid" : "glass"}
                size="sm"
                onClick={() => go(t.id)}
              >
                {t.label}
              </Button>
            ))}
            <a className="sc-link" href={STORYBOOK} target="_blank" rel="noreferrer">Storybook ↗</a>
          </div>
        </GlassPanel>

        {tab === "web" && (
          <section className="sc-section">
            <div className="sc-toolbar sc-on-light">
              <Text muted>Sample website at different screen widths:</Text>
              <div className="sc-sizes">
                {widths.map((w) => (
                  <Button key={w.id} size="sm" variant={size === w.id ? "solid" : "ghost"} onClick={() => setSize(w.id)}>
                    {w.label}
                  </Button>
                ))}
              </div>
            </div>
            {device.id === "phone" ? (
              <DeviceFrame kind="phone" src={WEB} title="Website (phone)" width={device.w} height={device.h} maxWidth={420} />
            ) : (
              <DeviceFrame kind="browser" src={WEB} title="Open the website full screen" width={device.w} height={device.h} />
            )}
          </section>
        )}

        {tab === "mobile" && (
          <section className="sc-section sc-section--center">
            <Text className="sc-center sc-on-light">
              The Expo mobile app running in the browser. Use the tabs at the bottom
              to switch between the "Home" and "Components" screens.
            </Text>
            <DeviceFrame kind="phone" src={MOBILE} title="Mobile app" width={390} height={844} maxWidth={420} />
            <a className="sc-link sc-on-light" href={MOBILE} target="_blank" rel="noreferrer">Open full screen on your phone ↗</a>
          </section>
        )}

        {tab === "side-by-side" && (
          <section className="sc-section sc-side sc-on-light">
            <div>
              <Heading level={4} className="sc-cap">Website</Heading>
              <DeviceFrame kind="browser" src={WEB} title="Website" width={1280} height={900} />
            </div>
            <div>
              <Heading level={4} className="sc-cap">Mobile app</Heading>
              <DeviceFrame kind="phone" src={MOBILE} title="Mobile app" width={390} height={844} maxWidth={380} />
            </div>
          </section>
        )}

        {tab === "components" && <Gallery />}

        <footer className="sc-footer">
          <Text muted>
            Source: <a href="https://github.com/MuhsinaOtahonova/my-design-template">github.com/MuhsinaOtahonova/my-design-template</a>
          </Text>
        </footer>
      </div>
    </Scene>
  );
}
