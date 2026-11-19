import { useMemo, useState } from "react";
import { Button, Card, EmptyState, Icon, SegmentedControl, Steps, Text } from "@my-design/ui-web";
import type { Page } from "../App";
import { useStore, weekRange, type Word } from "../store";
import { Game, gameInfo, pickForReview, type GameMode } from "../games";
import { PageHeader } from "./common";

type Scope = "today" | "week" | "all";
type Active = { kind: "daily"; round: 1 | 2 } | { kind: "free"; mode: GameMode; scope: Scope };

const scopeLabel: Record<Scope, string> = { today: "Today's words", week: "This week", all: "All words" };

export function PracticePage({ go }: { go: (p: Page) => void }) {
  const { words, today, addResult } = useStore();
  const [scope, setScope] = useState<Scope>("today");
  const [active, setActive] = useState<Active | null>(null);

  const todays = useMemo(() => words.filter((w) => w.added === today), [words, today]);
  const { from } = weekRange(today);
  const pools: Record<Scope, Word[]> = {
    today: todays,
    week: words.filter((w) => w.added >= from && w.added <= today),
    all: words,
  };

  // Freeze the word set when a game starts, so marking answers does not reshuffle it.
  const [roundWords, setRoundWords] = useState<Word[]>([]);
  const start = (a: Active) => {
    if (a.kind === "daily") setRoundWords(a.round === 1 ? todays : pickForReview(words, 20));
    else {
      const base = a.mode === "picture" ? pools[a.scope].filter((w) => w.image) : pools[a.scope];
      setRoundWords(a.scope === "all" ? pickForReview(base, 20) : base);
    }
    setActive(a);
    document.querySelector(".app__content")?.scrollTo({ top: 0 });
  };

  if (!words.length) {
    return (
      <>
        <PageHeader title="Practice" />
        <Card>
          <EmptyState icon="zap" title="Nothing to practise yet" description="Add a few words first. The games use your own words." action={<Button onClick={() => go("today")}>Add words</Button>} />
        </Card>
      </>
    );
  }

  if (active) {
    const daily = active.kind === "daily";
    const title = daily ? (active.round === 1 ? "Round 1: today's words" : "Round 2: all your words") : `${gameInfo[active.mode].title} · ${scopeLabel[active.scope]}`;
    return (
      <>
        <div className="game-head">
          <Button variant="ghost" size="sm" icon="arrowLeft" onClick={() => setActive(null)}>
            Back
          </Button>
          <Text weight="semibold" as="span">{title}</Text>
        </div>
        {daily && <Steps current={active.round - 1} steps={[{ title: "Today's words" }, { title: "All words" }]} />}
        <div className="game-wrap">
          <Game
            key={JSON.stringify(active)}
            words={roundWords}
            mode={daily ? "mixed" : active.mode}
            onFinish={(score, total) =>
              addResult(daily ? { kind: "daily", label: active.round === 1 ? "Daily review: today" : "Daily review: all words", score, total } : { kind: "practice", label: `${gameInfo[active.mode].title} (${scopeLabel[active.scope].toLowerCase()})`, score, total })
            }
            nextLabel={daily && active.round === 1 && words.length > todays.length ? "Round 2: all words" : "Done"}
            onNext={() => (daily && active.round === 1 && words.length > todays.length ? start({ kind: "daily", round: 2 }) : setActive(null))}
          />
        </div>
      </>
    );
  }

  const pool = pools[scope];
  return (
    <>
      <PageHeader title="Practice" subtitle="Short games with your own words. Every answer updates how well you know each word." />

      <Card className="daily-card">
        <div className="daily-card__text">
          <Text weight="semibold">End-of-day review</Text>
          <Text size="sm" tone="secondary">
            {todays.length
              ? `First today's ${todays.length} word${todays.length === 1 ? "" : "s"}, then up to 20 words from everything you saved, weakest first.`
              : "You have not added words today, so this review uses up to 20 of your saved words."}
          </Text>
          <Steps current={-1} steps={[{ title: "Today's words", description: `${todays.length} words` }, { title: "All words", description: `${Math.min(words.length, 20)} words` }]} />
        </div>
        <Button size="lg" iconRight="arrowRight" onClick={() => start(todays.length ? { kind: "daily", round: 1 } : { kind: "daily", round: 2 })}>
          Start review
        </Button>
      </Card>

      <div className="practice-head">
        <Text weight="semibold">Free practice</Text>
        <SegmentedControl<Scope>
          aria-label="Words to use"
          size="sm"
          value={scope}
          onChange={setScope}
          options={(["today", "week", "all"] as Scope[]).map((s) => ({ value: s, label: `${scopeLabel[s]} (${pools[s].length})` }))}
        />
      </div>

      {pool.length ? (
        <div className="game-grid">
          {(Object.keys(gameInfo) as GameMode[]).map((m) => {
            const off = m === "picture" && !pool.some((w) => w.image);
            return (
              <button key={m} type="button" className="game-tile" disabled={off} onClick={() => start({ kind: "free", mode: m, scope })}>
                <span className="game-tile__icon"><Icon name={gameInfo[m].icon} size={20} /></span>
                <span className="game-tile__title">{gameInfo[m].title}</span>
                <span className="game-tile__desc">{off ? "Add pictures to your words to play this." : gameInfo[m].description}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState icon="calendar" title={`No words in “${scopeLabel[scope]}”`} description="Choose another set above, or add today's words first." />
        </Card>
      )}
    </>
  );
}
