import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Everything is saved in this browser (localStorage). No account, no server.

export interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  /** Picture URL (found with "Find pictures" or pasted) */
  image?: string;
  /** Video link, e.g. YouTube */
  video?: string;
  /** Day the word was added, YYYY-MM-DD in local time */
  added: string;
  right: number;
  wrong: number;
}

export type ResultKind = "daily" | "practice" | "friday";

export interface Result {
  date: string;
  kind: ResultKind;
  label: string;
  score: number;
  total: number;
}

export interface Settings {
  name: string;
  goal: number;
}

interface State {
  words: Word[];
  results: Result[];
  settings: Settings;
}

const KEY = "ielts-words.v1";
const THEME_KEY = "ielts-words.theme";
const empty: State = { words: [], results: [], settings: { name: "", goal: 10 } };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const s = JSON.parse(raw) as Partial<State>;
    return { words: s.words ?? [], results: s.results ?? [], settings: { ...empty.settings, ...s.settings } };
  } catch {
    return empty;
  }
}

export function loadTheme(): "light" | "dark" {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") return t;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(t: "light" | "dark") {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Dates (local time, so "today" changes at the user's midnight)
// ---------------------------------------------------------------------------
export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

export function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const isFriday = (d = new Date()) => d.getDay() === 5;

/** Days until the next Friday (0 when today is Friday). */
export function daysToFriday(d = new Date()): number {
  return (5 - d.getDay() + 7) % 7;
}

/** The 7 days that end on `end` (Saturday to Friday when end is a Friday). */
export function weekRange(end = dayKey()): { from: string; to: string } {
  return { from: addDays(end, -6), to: end };
}

export function formatDay(key: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return parseDay(key).toLocaleDateString("en-GB", opts);
}

// ---------------------------------------------------------------------------
// Derived numbers
// ---------------------------------------------------------------------------
export function activeDays(s: State): Set<string> {
  const set = new Set<string>();
  s.words.forEach((w) => set.add(w.added));
  s.results.forEach((r) => set.add(r.date));
  return set;
}

/** Days in a row with some activity, ending today (or yesterday, if today is still empty). */
export function streak(days: Set<string>, today = dayKey()): number {
  let d = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function bestStreak(days: Set<string>): number {
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

/** A word counts as learned after 3 more right answers than wrong ones. */
export const isLearned = (w: Word) => w.right - w.wrong >= 3;

export type WordInput = Pick<Word, "word" | "meaning" | "example" | "image" | "video">;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface Store extends State {
  today: string;
  addWord: (w: WordInput, added?: string) => boolean;
  updateWord: (id: string, patch: Partial<WordInput>) => void;
  removeWord: (id: string) => void;
  mark: (id: string, correct: boolean) => void;
  addResult: (r: Omit<Result, "date">) => void;
  setSettings: (p: Partial<Settings>) => void;
  replaceAll: (s: unknown) => boolean;
  exportJson: () => string;
}

const Ctx = createContext<Store | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);
  const [today, setToday] = useState(dayKey);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [state]);

  // Notice when midnight passes while the tab stays open.
  useEffect(() => {
    const t = setInterval(() => setToday(dayKey()), 60_000);
    return () => clearInterval(t);
  }, []);

  const ref = useRef(state);
  ref.current = state;
  const addWord = useCallback<Store["addWord"]>((w, added) => {
    const word = w.word.trim();
    const same = (x: Word) => x.word.toLowerCase() === word.toLowerCase();
    if (!word || ref.current.words.some(same)) return false;
    const next: Word = { id: uid(), word, meaning: w.meaning.trim(), example: w.example.trim(), image: w.image?.trim() || undefined, video: w.video?.trim() || undefined, added: added ?? dayKey(), right: 0, wrong: 0 };
    setState((s) => (s.words.some(same) ? s : { ...s, words: [...s.words, next] }));
    return true;
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      today,
      addWord,
      updateWord: (id, patch) => setState((s) => ({ ...s, words: s.words.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
      removeWord: (id) => setState((s) => ({ ...s, words: s.words.filter((w) => w.id !== id) })),
      mark: (id, correct) =>
        setState((s) => ({ ...s, words: s.words.map((w) => (w.id === id ? { ...w, right: w.right + (correct ? 1 : 0), wrong: w.wrong + (correct ? 0 : 1) } : w)) })),
      addResult: (r) => setState((s) => ({ ...s, results: [...s.results, { ...r, date: dayKey() }] })),
      setSettings: (p) => setState((s) => ({ ...s, settings: { ...s.settings, ...p } })),
      exportJson: () => JSON.stringify(state, null, 2),
      replaceAll: (raw) => {
        const s = raw as Partial<State> | null;
        if (!s || !Array.isArray(s.words)) return false;
        setState({ words: s.words, results: Array.isArray(s.results) ? s.results : [], settings: { ...empty.settings, ...s.settings } });
        return true;
      },
    }),
    [state, today, addWord],
  );

  return createElement(Ctx.Provider, { value }, children);
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore needs <StoreProvider>");
  return s;
}
