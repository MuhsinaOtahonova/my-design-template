import { useState } from "react";
import { Badge, Button, Card, CardHeader, EmptyState, Progress, Text } from "@my-design/ui-web";
import type { Page } from "../App";
import { addDays, daysToFriday, formatDay, isFriday, useStore, weekRange, type Word } from "../store";
import { Game, shuffle } from "../games";
import { PageHeader } from "./common";

export function FridayPage({ go }: { go: (p: Page) => void }) {
  const { words, today, results, settings, addResult } = useStore();
  const [running, setRunning] = useState<Word[] | null>(null);
  const friday = isFriday();
  const { from } = weekRange(today);
  const week = words.filter((w) => w.added >= from && w.added <= today);
  const target = settings.goal * 7;
  const toFri = daysToFriday();
  const nextFriday = addDays(today, toFri);
  const checks = results.filter((r) => r.kind === "friday").slice().reverse();
  const doneToday = checks.some((r) => r.date === today);

  const days = Array.from({ length: 7 }, (_, n) => addDays(from, n));

  if (running) {
    return (
      <>
        <div className="game-head">
          <Button variant="ghost" size="sm" icon="arrowLeft" onClick={() => setRunning(null)}>
            Back
          </Button>
          <Text weight="semibold" as="span">{friday ? "Friday check" : "Practice check"} · {running.length} words</Text>
        </div>
        <div className="game-wrap">
          <Game
            words={running}
            mode="mixed"
            onFinish={(score, total) => addResult(friday ? { kind: "friday", label: "Friday check", score, total } : { kind: "practice", label: "Week check (practice run)", score, total })}
            onNext={() => setRunning(null)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={friday ? "Today is check day" : "Friday check"}
        subtitle={
          friday
            ? "Go through every word from this week once. Take your time; there is no timer."
            : `Every Friday you review the week's words (${target} if you add ${settings.goal} a day). Next check: ${formatDay(nextFriday, { weekday: "long", day: "numeric", month: "long" })}.`
        }
      />

      <Card className="week-card">
        <CardHeader title="This week" subtitle={`${formatDay(from, { day: "numeric", month: "short" })} to ${formatDay(today, { day: "numeric", month: "short" })}`} actions={<Badge tone={week.length >= target ? "success" : "neutral"}>{week.length} / {target} words</Badge>} />
        <div className="md-card__body stack-16">
          <div className="week-strip">
            {days.map((d) => {
              const n = words.filter((w) => w.added === d).length;
              return (
                <div key={d} className={`week-strip__day${d === today ? " week-strip__day--today" : ""}`}>
                  <span className="week-strip__name">{formatDay(d, { weekday: "short" })}</span>
                  <span className="week-strip__bar">
                    <span style={{ height: `${Math.min(100, (n / settings.goal) * 100)}%` }} />
                  </span>
                  <span className="week-strip__n">{n}</span>
                </div>
              );
            })}
          </div>
          <Progress value={week.length} max={target} label="Words this week" />
          {week.length ? (
            <div className="week-actions">
              <Button size="lg" icon={friday ? "task" : "refresh"} variant={friday ? "primary" : "outline"} onClick={() => setRunning(shuffle(week))}>
                {friday ? (doneToday ? "Take the check again" : `Start the check (${week.length} words)`) : "Try a practice check now"}
              </Button>
              {!friday && <Text size="sm" tone="muted" as="span">Practice runs don't count as the Friday score.</Text>}
            </div>
          ) : (
            <EmptyState icon="calendar" title="No words this week yet" description="Add words on the Today page. They will appear here." action={<Button variant="outline" onClick={() => go("today")}>Go to Today</Button>} />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Past checks" />
        {checks.length ? (
          <ul className="result-list">
            {checks.map((r, n) => {
              const pct = Math.round((r.score / Math.max(r.total, 1)) * 100);
              return (
                <li key={n}>
                  <span>{formatDay(r.date, { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="result-list__score">
                    {r.score} / {r.total}
                    <Badge tone={pct >= 80 ? "success" : pct >= 50 ? "info" : "warning"}>{pct}%</Badge>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="md-card__body">
            <Text tone="muted">Your Friday scores will be listed here.</Text>
          </div>
        )}
      </Card>
    </>
  );
}
