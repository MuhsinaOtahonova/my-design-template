import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Button, Checkbox, Heading, Input, Modal, SearchInput, Select, Tag, Text, Textarea, useToast } from "@my-design/ui-web";
import { useStore } from "../store";
import { ieltsWords, topics } from "../wordlist";
import { PicturePicker, youtubeSearch } from "../media";

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <Heading level={1} size={3} className="page-header__title">{title}</Heading>
        {subtitle && <Text tone="secondary">{subtitle}</Text>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

/** Form to type a new word. */
export function WordForm({ onAdded, disabledReason }: { onAdded?: () => void; disabledReason?: string }) {
  const { addWord } = useStore();
  const toast = useToast();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [video, setVideo] = useState("");
  const [error, setError] = useState("");

  // If the word is in the built-in list, offer its meaning and example.
  const known = ieltsWords.find((w) => w.word.toLowerCase() === word.trim().toLowerCase());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return setError("Write the word first.");
    if (!meaning.trim()) return setError("Add a short meaning, so the games can ask about it.");
    if (!addWord({ word, meaning, example, image, video })) return setError("This word is already in your list.");
    toast({ tone: "success", title: `“${word.trim()}” added` });
    setWord("");
    setMeaning("");
    setExample("");
    setImage(undefined);
    setVideo("");
    setError("");
    onAdded?.();
    document.getElementById("new-word")?.focus();
  };

  return (
    <form className="word-form" onSubmit={submit}>
      <Input id="new-word" label="Word" placeholder="e.g. sustainable" value={word} autoComplete="off" onChange={(e) => (setWord(e.target.value), setError(""))} />
      {known && !meaning && (
        <button type="button" className="word-form__hint" onClick={() => (setMeaning(known.meaning), setExample(known.example))}>
          Use the built-in meaning: <em>{known.meaning}</em>
        </button>
      )}
      <Input label="Meaning" placeholder="Short meaning in your own words" value={meaning} onChange={(e) => (setMeaning(e.target.value), setError(""))} />
      <Textarea label="Example sentence" optional rows={2} placeholder="A sentence that uses the word" value={example} onChange={(e) => setExample(e.target.value)} />
      <MediaFields word={word} image={image} onImage={setImage} video={video} onVideo={setVideo} />
      {error && <Text size="sm" tone="danger">{error}</Text>}
      <div className="word-form__actions">
        <Button type="submit" icon="plus" disabled={!!disabledReason}>Add word</Button>
        {disabledReason && <Text size="sm" tone="muted" as="span">{disabledReason}</Text>}
      </div>
    </form>
  );
}

/** Pick words from the built-in IELTS list. */
export function WordListModal({ open, onClose, limit }: { open: boolean; onClose: () => void; limit: number }) {
  const { words, addWord } = useStore();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [picked, setPicked] = useState<string[]>([]);
  const have = useMemo(() => new Set(words.map((w) => w.word.toLowerCase())), [words]);
  const list = ieltsWords.filter(
    (w) => !have.has(w.word.toLowerCase()) && (topic === "all" || w.topic === topic) && (w.word + " " + w.meaning).toLowerCase().includes(q.trim().toLowerCase()),
  );
  const full = picked.length >= limit;

  const toggle = (word: string) => setPicked((p) => (p.includes(word) ? p.filter((x) => x !== word) : full ? p : [...p, word]));
  const close = () => {
    setPicked([]);
    setQ("");
    onClose();
  };
  const add = () => {
    picked.forEach((word) => {
      const w = ieltsWords.find((x) => x.word === word);
      if (w) addWord(w);
    });
    toast({ tone: "success", title: `${picked.length} word${picked.length === 1 ? "" : "s"} added` });
    close();
  };
  const surprise = () => setPicked(list.slice().sort(() => Math.random() - 0.5).slice(0, limit).map((w) => w.word));

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title="IELTS word list"
      description={`Choose up to ${limit} word${limit === 1 ? "" : "s"} for today. ${ieltsWords.length - have.size > 0 ? `${list.length} shown.` : ""}`}
      footer={
        <>
          <Text size="sm" tone="muted" as="span" className="modal-count">{picked.length} / {limit} chosen</Text>
          <Button variant="ghost" onClick={surprise} disabled={!list.length || limit < 1}>Choose for me</Button>
          <Button onClick={add} disabled={!picked.length}>Add {picked.length || ""} word{picked.length === 1 ? "" : "s"}</Button>
        </>
      }
    >
      <div className="picker">
        <div className="picker__filters">
          <SearchInput size="sm" placeholder="Search words" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select size="sm" aria-label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} options={[{ value: "all", label: "All topics" }, ...topics.map((t) => ({ value: t, label: t }))]} />
        </div>
        {picked.length > 0 && (
          <div className="picker__picked">
            {picked.map((p) => (
              <Tag key={p} onRemove={() => toggle(p)}>{p}</Tag>
            ))}
          </div>
        )}
        <ul className="picker__list">
          {list.map((w) => {
            const on = picked.includes(w.word);
            return (
              <li key={w.word}>
                <Checkbox
                  className={`picker__row${on ? " picker__row--on" : ""}`}
                  checked={on}
                  disabled={!on && full}
                  onChange={() => toggle(w.word)}
                  label={
                    <span className="picker__text">
                      <strong>{w.word}</strong> <span className="picker__topic">{w.topic}</span>
                      <span className="picker__meaning">{w.meaning}</span>
                    </span>
                  }
                />
              </li>
            );
          })}
          {!list.length && <Text tone="muted">No more words here. You can also type your own.</Text>}
        </ul>
      </div>
    </Modal>
  );
}

/** Optional picture and video for a word. */
export function MediaFields({ word, image, onImage, video, onVideo }: { word: string; image?: string; onImage: (v: string | undefined) => void; video: string; onVideo: (v: string) => void }) {
  return (
    <div className="media-fields">
      <Text size="sm" weight="medium">
        Picture and video <Text as="span" size="sm" tone="muted">(optional, but pictures help you remember)</Text>
      </Text>
      <PicturePicker word={word} value={image} onChange={onImage} />
      <Input
        size="sm"
        icon="link"
        placeholder="Video link, e.g. a YouTube video"
        value={video}
        onChange={(e) => onVideo(e.target.value)}
        suffix={
          word.trim() ? (
            <a className="media-fields__yt" href={youtubeSearch(word.trim())} target="_blank" rel="noreferrer">
              Search YouTube
            </a>
          ) : undefined
        }
      />
    </div>
  );
}
