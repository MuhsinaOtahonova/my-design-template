import { useState } from "react";
import { Button, IconButton, Input, Spinner, Text } from "@my-design/ui-web";

// Pictures come from Openverse (free, openly licensed images, no API key).
// Wikimedia Commons is the fallback when Openverse does not answer.
export interface Picture {
  thumb: string;
  url: string;
  credit: string;
}

async function openverse(q: string): Promise<Picture[]> {
  const res = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=12&mature=false`);
  if (!res.ok) throw new Error(String(res.status));
  const data = (await res.json()) as { results?: Array<{ thumbnail?: string; url: string; creator?: string; license?: string }> };
  return (data.results ?? []).map((r) => ({ thumb: r.thumbnail || r.url, url: r.url, credit: [r.creator, r.license?.toUpperCase()].filter(Boolean).join(" · ") }));
}

async function wikimedia(q: string): Promise<Picture[]> {
  const u =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=320&gsrsearch=" +
    encodeURIComponent(`${q} filetype:bitmap`);
  const res = await fetch(u);
  if (!res.ok) throw new Error(String(res.status));
  const data = (await res.json()) as { query?: { pages?: Record<string, { title: string; imageinfo?: Array<{ thumburl?: string; url: string }> }> } };
  return Object.values(data.query?.pages ?? {})
    .map((p) => p.imageinfo?.[0] && { thumb: p.imageinfo[0].thumburl || p.imageinfo[0].url, url: p.imageinfo[0].thumburl || p.imageinfo[0].url, credit: "Wikimedia Commons" })
    .filter((p): p is Picture => !!p);
}

export async function searchPictures(q: string): Promise<Picture[]> {
  try {
    const r = await openverse(q);
    if (r.length) return r;
  } catch {
    /* try the fallback */
  }
  return wikimedia(q);
}

export function youtubeId(url = ""): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export const youtubeSearch = (word: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${word} meaning in English`)}`;

/** Pick a picture for a word: search free photos, or paste a link. */
export function PicturePicker({ word, value, onChange }: { word: string; value?: string; onChange: (url: string | undefined) => void }) {
  const [results, setResults] = useState<Picture[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paste, setPaste] = useState(false);

  const find = async () => {
    if (!word.trim()) return setError("Write the word first.");
    setLoading(true);
    setError("");
    try {
      const r = await searchPictures(word.trim());
      setResults(r);
      if (!r.length) setError("No pictures found. Try pasting your own link.");
    } catch {
      setError("Could not load pictures right now. You can paste an image link instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pic">
      <div className="pic__row">
        {value ? (
          <span className="pic__chosen">
            <img src={value} alt="" />
            <IconButton size="sm" icon="close" label="Remove picture" onClick={() => onChange(undefined)} />
          </span>
        ) : null}
        <Button size="sm" variant="outline" icon="image" onClick={find} disabled={loading}>
          {value ? "Change picture" : "Find pictures"}
        </Button>
        <Button size="sm" variant="ghost" icon="link" onClick={() => setPaste((p) => !p)}>
          Paste link
        </Button>
        {loading && <Spinner size={16} />}
      </div>
      {paste && <Input size="sm" placeholder="https://… (image address)" value={value ?? ""} onChange={(e) => onChange(e.target.value.trim() || undefined)} />}
      {error && <Text size="sm" tone="muted">{error}</Text>}
      {results && results.length > 0 && (
        <div className="pic__grid">
          {results.map((p) => (
            <button key={p.url} type="button" className={`pic__opt${value === p.thumb ? " pic__opt--on" : ""}`} onClick={() => (onChange(p.thumb), setResults(null))} title={p.credit}>
              <img src={p.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = "none")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Picture + video link shown next to a word. */
export function WordMedia({ image, video, word, size = "md" }: { image?: string; video?: string; word: string; size?: "sm" | "md" | "lg" }) {
  const id = youtubeId(video);
  return (
    <>
      {image && <img className={`word-img word-img--${size}`} src={image} alt={word} loading="lazy" referrerPolicy="no-referrer" />}
      {video && size !== "sm" && (
        <a className="word-video" href={video} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
          {id ? <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" /> : null}
          <span>Watch video</span>
        </a>
      )}
    </>
  );
}
