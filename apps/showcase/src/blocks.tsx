import { useState, type ReactNode } from "react";
import { Button, CodeBlock, Text } from "@my-design/ui-web";

// ---------------------------------------------------------------------------
// Gallery building blocks
// ---------------------------------------------------------------------------
export function Example({ title, note, code, children, center }: { title: string; note?: ReactNode; code?: string; children: ReactNode; center?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ex">
      <div className="ex__head">
        <div>
          <h4 className="ex__title">{title}</h4>
          {note && <p className="ex__note">{note}</p>}
        </div>
        {code && (
          <Button size="sm" variant="ghost" icon="code" onClick={() => setShow((s) => !s)}>
            {show ? "Hide code" : "Code"}
          </Button>
        )}
      </div>
      <div className={`ex__demo${center ? " ex__demo--center" : ""}`}>{children}</div>
      {show && code && <CodeBlock className="ex__code">{code.trim()}</CodeBlock>}
    </div>
  );
}

export function Group({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="g-group">
      <div className="g-group__head">
        <h2 className="md-heading md-heading--4">{title}</h2>
        {intro && <Text tone="muted">{intro}</Text>}
      </div>
      {children}
    </section>
  );
}

export const Row = ({ children, gap = 12 }: { children: ReactNode; gap?: number }) => <div className="g-row" style={{ gap }}>{children}</div>;
export const Col = ({ children, gap = 16 }: { children: ReactNode; gap?: number }) => <div className="g-col" style={{ gap }}>{children}</div>;

