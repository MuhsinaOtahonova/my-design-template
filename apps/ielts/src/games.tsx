import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Badge, Button, Card, CircularProgress, Heading, Icon, Input, Progress, Text } from "@my-design/ui-web";
import { useStore, type Word } from "./store";
import { ieltsWords } from "./wordlist";
import { scoreMessage } from "./motivation";
import { WordMedia } from "./media";

export type GameMode = "flashcards" | "choice" | "picture" | "match" | "spelling" | "mixed";

export const gameInfo: Record<GameMode, { title: string; description: string; icon: "layers" | "list" | "image" | "link" | "edit" | "zap" }> = {
  flashcards: { title: "Flashcards", description: "See the word, remember the meaning, then flip.", icon: "layers" },
  choice: { title: "Multiple choice", description: "Pick the right meaning or the right word.", icon: "list" },
  picture: { title: "Picture quiz", description: "Look at the picture and choose the word.", icon: "image" },
  match: { title: "Matching", description: "Connect each word with its meaning.", icon: "link" },
  spelling: { title: "Spelling", description: "Read the meaning and type the word.", icon: "edit" },
  mixed: { title: "Mixed quiz", description: "Choice and spelling questions together.", icon: "zap" },
};

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Weak words first (more wrong than right, or never practised), then the rest. */
export function pickForReview(words: Word[], max: number): Word[] {
  const score = (w: Word) => w.right - w.wrong + Math.random() * 1.5;
  return [...words].sort((a, b) => score(a) - score(b)).slice(0, max);
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function blankOut(example: string, word: string): string | null {
  const re = new RegExp(`\\b${escape(word)}[a-z]*`, "gi");
  return re.test(example) ? example.replace(re, "_____") : null;
}

interface Props {
  words: Word[];
  mode: GameMode;
  /** Called once when the round ends */
  onFinish: (score: number, total: number) => void;
  /** Main button on the result screen; defaults to "Done" */
  nextLabel?: string;
  onNext: () => void;
}

export function Game({ words, mode, onFinish, nextLabel = "Done", onNext }: Props) {
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const items = useMemo(() => shuffle(words), [words, round]);

  const finish = (score: number, total: number) => {
    setResult({ score, total });
    onFinish(score, total);
  };

  if (!words.length) return null;
  if (result) {
    const pct = Math.round((result.score / Math.max(result.total, 1)) * 100);
    return (
      <Card className="game game--result md-page">
        <CircularProgress value={pct} size={96} stroke={7} label={`${pct}%`} />
        <Heading level={3}>
          {result.score} of {result.total} correct
        </Heading>
        <Text tone="secondary" className="game__msg">{scoreMessage(pct)}</Text>
        <div className="game__actions">
          <Button variant="outline" icon="refresh" onClick={() => (setResult(null), setRound((r) => r + 1))}>
            Play again
          </Button>
          <Button iconRight="arrowRight" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      </Card>
    );
  }

  const key = `${mode}-${round}`;
  if (mode === "flashcards") return <Flashcards key={key} items={items} onFinish={finish} />;
  if (mode === "match") return <Matching key={key} items={items} onFinish={finish} />;
  return <Quiz key={key} items={items} mode={mode} onFinish={finish} />;
}

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------
function Flashcards({ items, onFinish }: { items: Word[]; onFinish: (s: number, t: number) => void }) {
  const { mark } = useStore();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const w = items[i];

  const answer = (knew: boolean) => {
    mark(w.id, knew);
    const k = known + (knew ? 1 : 0);
    setKnown(k);
    if (i + 1 >= items.length) onFinish(k, items.length);
    else {
      setFlipped(false);
      setI(i + 1);
    }
  };

  return (
    <div className="game">
      <GameProgress i={i} total={items.length} />
      <button type="button" className={`flash${flipped ? " flash--flipped" : ""}`} onClick={() => setFlipped((f) => !f)} aria-label={flipped ? "Show word" : "Show meaning"}>
        <span className="flash__inner">
          <span className="flash__face flash__front">
            <span className="flash__word">{w.word}</span>
            <Text size="sm" tone="muted" as="span">Tap to see the meaning</Text>
          </span>
          <span className="flash__face flash__back">
            <WordMedia image={w.image} video={w.video} word={w.word} />
            <span className="flash__meaning">{w.meaning || "No meaning saved"}</span>
            {w.example && <span className="flash__example">“{w.example}”</span>}
          </span>
        </span>
      </button>
      <div className="game__actions">
        {flipped ? (
          <>
            <Button variant="outline" onClick={() => answer(false)}>Not yet</Button>
            <Button icon="check" onClick={() => answer(true)}>I knew it</Button>
          </>
        ) : (
          <Button variant="secondary" icon="refresh" onClick={() => setFlipped(true)}>Flip card</Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multiple choice + spelling (and "mixed")
// ---------------------------------------------------------------------------
type Q =
  | { kind: "meaning"; w: Word; options: string[]; answer: string }
  | { kind: "word"; w: Word; options: string[]; answer: string }
  | { kind: "picture"; w: Word; options: string[]; answer: string }
  | { kind: "spell"; w: Word; clue: string | null };

function buildQuestions(items: Word[], all: Word[], mode: GameMode): Q[] {
  const meanings = Array.from(new Set([...all.map((w) => w.meaning), ...ieltsWords.map((w) => w.meaning)].filter(Boolean)));
  const wordsPool = Array.from(new Set([...all.map((w) => w.word), ...ieltsWords.map((w) => w.word)]));
  const opts = (right: string, pool: string[]) => shuffle([right, ...shuffle(pool.filter((p) => norm(p) !== norm(right))).slice(0, 3)]);
  return items.map((w, idx) => {
    if (mode === "picture") return { kind: "picture", w, options: opts(w.word, wordsPool), answer: w.word };
    const kind = mode === "spelling" ? "spell" : mode === "mixed" ? (["meaning", "word", "spell"] as const)[idx % 3] : idx % 2 ? "word" : "meaning";
    if (kind === "spell" || (kind === "meaning" && !w.meaning)) {
      return { kind: "spell", w, clue: w.example ? blankOut(w.example, w.word) : null };
    }
    if (kind === "word" && w.meaning) return { kind: "word", w, options: opts(w.word, wordsPool), answer: w.word };
    return { kind: "meaning", w, options: opts(w.meaning, meanings), answer: w.meaning };
  });
}

function Quiz({ items, mode, onFinish }: { items: Word[]; mode: GameMode; onFinish: (s: number, t: number) => void }) {
  const { mark, words } = useStore();
  // Questions are fixed for the round, even while word stats change.
  const [qs] = useState(() => buildQuestions(items, words, mode));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const nextRef = useRef<HTMLDivElement>(null);
  const q = qs[i];
  const done = picked !== null;
  const correct = done && (q.kind === "spell" ? norm(picked) === norm(q.w.word) : picked === q.answer);

  useEffect(() => {
    if (done) nextRef.current?.querySelector("button")?.focus();
  }, [done]);

  const submit = (value: string) => {
    if (done) return;
    const ok = q.kind === "spell" ? norm(value) === norm(q.w.word) : value === q.answer;
    setPicked(value);
    mark(q.w.id, ok);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 >= qs.length) return onFinish(score, qs.length);
    setI(i + 1);
    setPicked(null);
    setTyped("");
  };

  return (
    <div className="game">
      <GameProgress i={i} total={qs.length} />
      <Card className="quiz" key={i}>
        {q.kind === "meaning" && (
          <>
            <Text size="sm" tone="muted">What does this word mean?</Text>
            <div className="quiz__prompt quiz__prompt--word">{q.w.word}</div>
          </>
        )}
        {q.kind === "word" && (
          <>
            <Text size="sm" tone="muted">Which word has this meaning?</Text>
            <div className="quiz__prompt">{q.w.meaning}</div>
            {q.w.image && <WordMedia image={q.w.image} word="" size="md" />}
          </>
        )}
        {q.kind === "picture" && (
          <>
            <Text size="sm" tone="muted">Which word does this picture show?</Text>
            <WordMedia image={q.w.image} word="" size="lg" />
          </>
        )}
        {q.kind === "spell" && (
          <>
            {q.w.image && <WordMedia image={q.w.image} word="" size="md" />}
            <Text size="sm" tone="muted">Type the word</Text>
            <div className="quiz__prompt">{q.w.meaning || "(no meaning saved)"}</div>
            {q.clue && <Text tone="secondary" className="quiz__clue">“{q.clue}”</Text>}
            <Text size="sm" tone="muted">
              Starts with <strong>{q.w.word[0]}</strong>, {q.w.word.length} letters
            </Text>
          </>
        )}

        {q.kind !== "spell" ? (
          <div className="quiz__options">
            {q.options.map((o, n) => {
              const state = !done ? "" : o === q.answer ? " quiz__opt--right" : o === picked ? " quiz__opt--wrong" : " quiz__opt--dim";
              return (
                <button key={o} type="button" className={`quiz__opt${state}`} disabled={done} onClick={() => submit(o)}>
                  <span className="quiz__key">{"ABCD"[n]}</span>
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form
            className="quiz__spell"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (typed.trim()) submit(typed);
            }}
          >
            <Input autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Your answer" value={typed} disabled={done} onChange={(e) => setTyped(e.target.value)} />
            {!done && <Button type="submit" disabled={!typed.trim()}>Check</Button>}
          </form>
        )}

        {done && (
          <div className={`quiz__feedback quiz__feedback--${correct ? "ok" : "no"}`}>
            <Icon name={correct ? "checkCircle" : "info"} size={18} />
            <div>
              <strong>{correct ? "Correct." : `The answer is “${q.w.word}”.`}</strong>
              {q.kind === "picture" && q.w.meaning && <div>{q.w.meaning}</div>}
              {q.w.example && <div className="quiz__example">{q.w.example}</div>}
            </div>
          </div>
        )}
      </Card>
      {done && (
        <div className="game__actions" ref={nextRef}>
          <Button iconRight="arrowRight" onClick={next}>
            {i + 1 >= qs.length ? "See result" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Matching: groups of 5 words and meanings
// ---------------------------------------------------------------------------
function Matching({ items, onFinish }: { items: Word[]; onFinish: (s: number, t: number) => void }) {
  const { mark } = useStore();
  const usable = items.filter((w) => w.meaning);
  const groups = useMemo(() => {
    const g: Word[][] = [];
    for (let k = 0; k < usable.length; k += 5) g.push(usable.slice(k, k + 5));
    return g;
  }, [usable.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const [gi, setGi] = useState(0);
  const group = groups[gi] ?? [];
  const right = useMemo(() => shuffle(group), [group]);
  const [sel, setSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  if (!usable.length) {
    return (
      <Card className="game">
        <Text>Matching needs words with a meaning. Add meanings in My words.</Text>
      </Card>
    );
  }

  const pickMeaning = (id: string) => {
    if (!sel || matched.includes(id)) return;
    if (id === sel) {
      const first = !missed.includes(id);
      mark(id, first);
      const s = score + (first ? 1 : 0);
      setScore(s);
      const m = [...matched, id];
      setMatched(m);
      setSel(null);
      if (m.length === group.length) {
        setTimeout(() => {
          if (gi + 1 >= groups.length) onFinish(s, usable.length);
          else {
            setGi(gi + 1);
            setMatched([]);
          }
        }, 450);
      }
    } else {
      if (!missed.includes(sel)) setMissed([...missed, sel]);
      setWrongFlash(id);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  return (
    <div className="game">
      <div className="game__top">
        <Text size="sm" tone="muted">
          Set {gi + 1} of {groups.length}. Pick a word, then its meaning.
        </Text>
        <Badge tone="primary">{score} first try</Badge>
      </div>
      <div className="match">
        <div className="match__col">
          {group.map((w) => (
            <button
              key={w.id}
              type="button"
              disabled={matched.includes(w.id)}
              className={`match__item match__item--word${sel === w.id ? " match__item--sel" : ""}${matched.includes(w.id) ? " match__item--done" : ""}`}
              onClick={() => setSel(w.id)}
            >
              {w.word}
            </button>
          ))}
        </div>
        <div className="match__col">
          {right.map((w) => (
            <button
              key={w.id}
              type="button"
              disabled={matched.includes(w.id)}
              className={`match__item${matched.includes(w.id) ? " match__item--done" : ""}${wrongFlash === w.id ? " match__item--wrong" : ""}`}
              onClick={() => pickMeaning(w.id)}
            >
              {w.meaning}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameProgress({ i, total }: { i: number; total: number }) {
  return (
    <div className="game__top">
      <Text size="sm" tone="muted">
        {i + 1} of {total}
      </Text>
      <div className="game__bar"><Progress value={i} max={total} size="sm" showValue={false} /></div>
    </div>
  );
}
