import type { IconName } from "@my-design/tokens";
import { activeDays, bestStreak, isLearned, type Result, type Word } from "./store";

// Short, calm lines. One is picked per day so it does not change on every click.
const daily = [
  "Ten words a day is 3,650 words a year. Small steps add up.",
  "You don't have to be fast. You just have to come back tomorrow.",
  "Words you use in a sentence stay longer. Try saying one out loud today.",
  "A band score is built from habits, not from one long night.",
  "Mistakes in practice are cheaper than mistakes in the exam.",
  "Read your example sentences once before bed. Sleep helps memory.",
  "Five calm minutes count. Showing up is the hard part.",
  "Pick one new word and use it in a message to a friend today.",
  "Review beats cramming. That is why Friday is check day.",
  "Every word you learn makes the next reading passage a little easier.",
  "Progress is quiet. Look at your total and see how far you came.",
  "Learning is not a race. Steady is enough.",
];

export function messageOfTheDay(today: string): string {
  const n = today.split("-").reduce((a, b) => a + Number(b), 0);
  return daily[n % daily.length];
}

export function scoreMessage(pct: number): string {
  if (pct >= 90) return "Excellent. These words are becoming yours.";
  if (pct >= 75) return "Very good. A short review tomorrow will make them stick.";
  if (pct >= 50) return "Good work. The words you missed will come back in your next round.";
  return "That's fine. Hard words need a few more meetings. Try again later today.";
}

export function greeting(name: string, d = new Date()): string {
  const h = d.getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  earned: boolean;
  /** 0..1 progress toward the badge */
  progress: number;
}

export function badges(words: Word[], results: Result[], goal: number): BadgeDef[] {
  const days = activeDays({ words, results, settings: { name: "", goal } });
  const best = bestStreak(days);
  const perDay = new Map<string, number>();
  words.forEach((w) => perDay.set(w.added, (perDay.get(w.added) ?? 0) + 1));
  const bestDay = Math.max(0, ...perDay.values());
  const learned = words.filter(isLearned).length;
  const fridays = results.filter((r) => r.kind === "friday");
  const bestFriday = Math.max(0, ...fridays.map((r) => r.score / Math.max(r.total, 1)));
  const games = results.length;

  const b = (id: string, title: string, description: string, icon: IconName, have: number, need: number): BadgeDef => ({
    id,
    title,
    description,
    icon,
    earned: have >= need,
    progress: Math.min(1, have / need),
  });

  return [
    b("first", "First word", "Add your first word", "plus", words.length, 1),
    b("goal", "Full day", `Add ${goal} words in one day`, "checkCircle", bestDay, goal),
    b("game", "Player", "Finish 5 games", "zap", games, 5),
    b("streak3", "Three days", "Practise 3 days in a row", "calendar", best, 3),
    b("streak7", "One week", "Practise 7 days in a row", "star", best, 7),
    b("w50", "50 words", "Collect 50 words", "layers", words.length, 50),
    b("learned25", "Remembered 25", "Learn 25 words well", "shield", learned, 25),
    b("friday", "Friday check", "Score 80% or more on a Friday check", "task", Math.round(bestFriday * 100), 80),
    b("w100", "100 words", "Collect 100 words", "briefcase", words.length, 100),
    b("streak30", "One month", "Practise 30 days in a row", "heart", best, 30),
    b("w500", "500 words", "Collect 500 words", "globe", words.length, 500),
  ];
}
