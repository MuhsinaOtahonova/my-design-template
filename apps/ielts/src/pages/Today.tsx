import { useState } from "react";
import { Alert, Button, Card, CardHeader, CircularProgress, EmptyState, IconButton, Text } from "@my-design/ui-web";
import type { Page } from "../App";
import { activeDays, daysToFriday, formatDay, isFriday, streak, useStore } from "../store";
import { greeting, messageOfTheDay } from "../motivation";
import { PageHeader, WordForm, WordListModal } from "./common";
import { WordMedia } from "../media";

export function TodayPage({ go }: { go: (p: Page) => void }) {
  const store = useStore();
  const { words, today, settings, results } = store;
  const [listOpen, setListOpen] = useState(false);
  const todays = words.filter((w) => w.added === today);
  const goal = settings.goal;
  const left = Math.max(goal - todays.length, 0);
  const days = streak(activeDays(store), today);
  const reviewedToday = results.some((r) => r.date === today && r.kind === "daily");
  const toFri = daysToFriday();

  return (
    <>
      <PageHeader title={greeting(settings.name)} subtitle={formatDay(today, { weekday: "long", day: "numeric", month: "long" })} />

      <p className="quote">{messageOfTheDay(today)}</p>

      {isFriday() ? (
        <Alert tone="info" title="Today is check day" action={<Button size="sm" onClick={() => go("friday")}>Start the check</Button>}>
          Review all the words from this week and see your score.
        </Alert>
      ) : null}

      <div className="today-grid">
        <Card className="goal-card">
          <CircularProgress value={Math.min(100, (todays.length / goal) * 100)} size={84} stroke={7} label={`${todays.length}/${goal}`} />
          <div>
            <Text weight="semibold">{left ? `${left} word${left === 1 ? "" : "s"} to go today` : "Today's goal is done"}</Text>
            <Text size="sm" tone="secondary">
              {left ? "Type your own words or pick from the IELTS list." : reviewedToday ? "You also finished today's review. Well done." : "Now play the end-of-day review to fix them in memory."}
            </Text>
          </div>
        </Card>
        <Card className="mini-stat">
          <span className="mini-stat__num">{days}</span>
          <Text size="sm" tone="secondary">day{days === 1 ? "" : "s"} in a row</Text>
        </Card>
        <Card className="mini-stat">
          <span className="mini-stat__num">{words.length}</span>
          <Text size="sm" tone="secondary">words in total</Text>
        </Card>
        <Card className="mini-stat">
          <span className="mini-stat__num">{toFri === 0 ? "Today" : toFri}</span>
          <Text size="sm" tone="secondary">{toFri === 0 ? "is check day" : `day${toFri === 1 ? "" : "s"} to Friday check`}</Text>
        </Card>
      </div>

      {todays.length > 0 && (
        <Card className={`review-cta${left ? "" : " review-cta--ready"}`}>
          <div>
            <Text weight="semibold">End-of-day review</Text>
            <Text size="sm" tone="secondary">
              Round 1 uses today's {todays.length} word{todays.length === 1 ? "" : "s"}. Round 2 mixes in all your words so far.
            </Text>
          </div>
          <Button variant={left ? "outline" : "primary"} iconRight="arrowRight" onClick={() => go("practice")}>
            {reviewedToday ? "Review again" : "Start review"}
          </Button>
        </Card>
      )}

      <div className="two-col">
        <Card>
          <CardHeader
            title="Add a word"
            subtitle="Word, meaning and an example"
            actions={
              <Button size="sm" variant="secondary" icon="list" onClick={() => setListOpen(true)}>
                IELTS list
              </Button>
            }
          />
          <div className="md-card__body">
            <WordForm />
          </div>
        </Card>

        <Card>
          <CardHeader title="Today's words" subtitle={todays.length ? `${todays.length} added` : undefined} />
          {todays.length ? (
            <ul className="word-list">
              {todays.map((w, n) => (
                <li key={w.id} className="word-list__item">
                  <span className="word-list__n">{n + 1}</span>
                  <div className="word-list__text">
                    <strong>{w.word}</strong>
                    <Text size="sm" tone="secondary">{w.meaning}</Text>
                    {w.example && <Text size="sm" tone="muted" className="word-list__ex">{w.example}</Text>}
                    {w.video && <WordMedia video={w.video} word={w.word} />}
                  </div>
                  {w.image && <WordMedia image={w.image} word={w.word} size="sm" />}
                  <IconButton size="sm" icon="trash" label={`Remove ${w.word}`} onClick={() => store.removeWord(w.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="edit"
              title="No words yet today"
              description="Add your first word, or choose some from the IELTS list."
              action={<Button size="sm" variant="outline" onClick={() => setListOpen(true)}>Open the IELTS list</Button>}
            />
          )}
        </Card>
      </div>

      <WordListModal open={listOpen} onClose={() => setListOpen(false)} limit={left || 5} />
    </>
  );
}
