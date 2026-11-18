import { palette, radii, spacing } from "@my-design/tokens";
import { Button, Drip, GlassPanel, Heading, Input, Orb, Progress, Text } from "@my-design/ui-web";

const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <GlassPanel tone="dark" padding="lg" className="g-section">
      <div>
        <Heading level={3}>{title}</Heading>
        {note && <Text muted className="g-note">{note}</Text>}
      </div>
      {children}
    </GlassPanel>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="g-label">{children}</span>;
}

/** Every component in every variant, rendered live with the web package. */
export function Gallery() {
  return (
    <div className="gallery" lang="en">
      <Section title="Colors" note="packages/tokens → palette">
        <div className="g-swatches">
          {Object.entries(palette).filter(([, v]) => typeof v === "object").map(([name, shades]) => (
            <div key={name} className="g-swatch-row">
              <Label>{name}</Label>
              <div className="g-row">
                {Object.entries(shades as Record<string, string>).map(([k, hex]) => (
                  <div key={k} className="g-swatch">
                    <div style={{ background: hex }} />
                    <small>{k}<br />{hex}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" note="Heading 1–4, display, Text, muted">
        <div className="g-stack">
          <Heading level={1} display>Display</Heading>
          <Heading level={1}>Heading One</Heading>
          <Heading level={2}>Heading Two</Heading>
          <Heading level={3}>Heading Three</Heading>
          <Heading level={4}>Label Four</Heading>
          <Text>Body text in Jost Light. Calm, airy and easy to read.</Text>
          <Text muted>Muted body text for secondary information.</Text>
        </div>
      </Section>

      <Section title="Buttons" note="variant × size, drip, icon, fullWidth, disabled">
        {(["glass", "solid", "ghost"] as const).map((v) => (
          <div key={v} className="g-row g-row--buttons">
            <Label>{v}</Label>
            <Button variant={v} size="sm">Small</Button>
            <Button variant={v}>Medium</Button>
            <Button variant={v} size="lg">Large</Button>
            <Button variant={v} drip>Melting</Button>
            <Button variant={v} icon={<Pin />}>Icon</Button>
            <Button variant={v} disabled>Disabled</Button>
          </div>
        ))}
        <Button variant="solid" fullWidth drip>Full width</Button>
      </Section>

      <Section title="Glass panels" note="tone × elevation, tilt, drip, padding">
        <div className="g-grid">
          {(["light", "dark"] as const).flatMap((tone) =>
            (["sm", "md", "lg"] as const).map((el) => (
              <GlassPanel key={tone + el} tone={tone} elevation={el} padding="md" className="g-card">
                <Heading level={4}>{tone} · {el}</Heading>
                <Text muted>Frosted glass</Text>
              </GlassPanel>
            )),
          )}
          <GlassPanel tone="dark" tilt padding="md" className="g-card">
            <Heading level={4}>tilt</Heading><Text muted>Hover over me</Text>
          </GlassPanel>
          <GlassPanel tone="dark" drip padding="md" className="g-card">
            <Heading level={4}>drip</Heading><Text muted>Melting edge</Text>
          </GlassPanel>
          <GlassPanel tone="light" drip={{ intensity: 1, drops: [30, 60, 85] }} padding="md" className="g-card">
            <Heading level={4}>drip: custom</Heading><Text muted>intensity 1, 3 drops</Text>
          </GlassPanel>
          {(["none", "sm", "lg"] as const).map((p) => (
            <GlassPanel key={p} padding={p} className="g-card">
              <Heading level={4}>padding {p}</Heading>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section title="Drip" note="tone: light · dark · rose">
        <div className="g-grid">
          {(["light", "dark", "rose"] as const).map((tone) => (
            <div key={tone} className="g-drip">
              <div className={`g-drip__bar g-drip__bar--${tone}`} />
              <Drip tone={tone} intensity={1} drops={[25, 55, 80]} />
              <Label>{tone}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Orbs" note="variant: bubble · pearl · rose, float">
        <div className="g-row g-row--center">
          <Orb size={110} />
          <Orb size={80} variant="pearl" />
          <Orb size={64} variant="rose" />
          <Orb size={40} variant="bubble" float={false} />
          <Orb size={24} variant="pearl" float={false} />
        </div>
      </Section>

      <Section title="Progress & form" note="Progress, Input">
        <div className="g-grid g-grid--2">
          <div className="g-stack">
            <Progress label="Hydration" value={72} />
            <Progress label="Progress" value={48} />
            <Progress label="Balance" value={86} />
            <Progress value={3} max={5} label="3 / 5" />
          </div>
          <div className="g-stack">
            <Input label="Email" placeholder="you@example.com" type="email" />
            <Input label="Password" placeholder="••••••••" type="password" />
            <Input placeholder="Field without label" />
          </div>
        </div>
      </Section>

      <Section title="Radii & spacing" note="radii, spacing">
        <div className="g-row">
          {Object.entries(radii).map(([k, r]) => (
            <div key={k} className="g-radius">
              <div style={{ borderRadius: Math.min(r, 36) }} />
              <small>{k} · {r}</small>
            </div>
          ))}
        </div>
        <div className="g-stack g-stack--tight">
          {Object.entries(spacing).map(([k, v]) => (
            <div key={k} className="g-space">
              <small>{k}</small>
              <span style={{ width: v, background: palette.rose[300] }} />
              <small>{v}px</small>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
