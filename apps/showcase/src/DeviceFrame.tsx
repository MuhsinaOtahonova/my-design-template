import { useEffect, useRef, useState } from "react";

interface DeviceFrameProps {
  kind: "browser" | "phone";
  src: string;
  title: string;
  /** Real viewport size the page is rendered at, before scaling. */
  width: number;
  height: number;
  /** Largest width the frame may take on screen. */
  maxWidth?: number;
}

/**
 * Renders a live page inside a browser window or a phone shell.
 * The page keeps its real viewport size and is scaled down to fit,
 * so you see exactly what a visitor on that device would see.
 */
export function DeviceFrame({ kind, src, title, width, height, maxWidth }: DeviceFrameProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const chrome = kind === "phone" ? 28 : 0; // phone bezel on both sides

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const available = Math.min(entry.contentRect.width, maxWidth ?? Infinity) - chrome;
      setScale(Math.min(1, available / width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxWidth, chrome]);

  const viewW = width * scale;
  const viewH = height * scale;

  return (
    <div ref={holder} className="frame-holder">
      <div className={`device device--${kind}`} style={{ width: viewW + chrome }}>
        {kind === "browser" ? (
          <div className="device__bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <a className="device__url" href={src} target="_blank" rel="noreferrer">{title} ↗</a>
          </div>
        ) : (
          <div className="device__notch" />
        )}
        <div className="device__screen" style={{ width: viewW, height: viewH }}>
          <iframe
            title={title}
            src={src}
            loading="lazy"
            style={{ width, height, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}
