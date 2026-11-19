import { useRef } from "react";
import { Button, Card, CardHeader, Icon, Input, Select, Text, useToast } from "@my-design/ui-web";
import { activeDays, addDays, bestStreak, formatDay, isLearned, streak, useStore } from "../store";
import { badges } from "../motivation";
import { PageHeader } from "./common";

export function ProgressPage() {
  const store = useStore();
  const { words, results, settings, today, setSettings } = store;
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const days = activeDays(store);
  const learned = words.filter(isLearned).length;
  const list = badges(words, results, settings.goal);
  const earned = list.filter((b) => b.earned).length;

  // Last 12 weeks, Monday first, ending this week.
  const end = addDays(today, (7 - ((new Date().getDay() + 6) % 7) - 1));
  const cells = Array.from({ length: 84 }, (_, n) => addDays(end, n - 83));
  const perDay = new Map<string, number>();
  words.forEach((w) => perDay.set(w.added, (perDay.get(w.added) ?? 0) + 1));
  results.forEach((r) => perDay.set(r.date, (perDay.get(r.date) ?? 0) + 1));

  const exportFile = () => {
    const blob = new Blob([store.exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ielts-words-${today}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importFile = async (file: File) => {
    try {
      const ok = store.replaceAll(JSON.parse(await file.text()));
      toast(ok ? { tone: "success", title: "Backup restored" } : { tone: "danger", title: "This file is not a Word a Day backup" });
    } catch {
      toast({ tone: "danger", title: "Could not read this file" });
    }
  };

  return (
    <>
      <PageHeader title="Progress" subtitle="Your words, your streak and the badges you collected." />

      <div className="stat-grid">
        <Card className="mini-stat"><span className="mini-stat__num">{words.length}</span><Text size="sm" tone="secondary">words saved</Text></Card>
        <Card className="mini-stat"><span className="mini-stat__num">{learned}</span><Text size="sm" tone="secondary">words learned</Text></Card>
        <Card className="mini-stat"><span className="mini-stat__num">{streak(days, today)}</span><Text size="sm" tone="secondary">days in a row</Text></Card>
        <Card className="mini-stat"><span className="mini-stat__num">{bestStreak(days)}</span><Text size="sm" tone="secondary">best streak</Text></Card>
      </div>

      <Card>
        <CardHeader title="Last 12 weeks" subtitle="Each square is a day. Darker means more words and games." />
        <div className="md-card__body">
          <div className="heat" role="img" aria-label={`${days.size} active days`}>
            {cells.map((d) => {
              const n = perDay.get(d) ?? 0;
              const lvl = d > today ? "future" : n === 0 ? 0 : n < 5 ? 1 : n < 10 ? 2 : 3;
              return <span key={d} className={`heat__cell heat__cell--${lvl}`} title={`${formatDay(d)}: ${n}`} />;
            })}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badges" subtitle={`${earned} of ${list.length} collected`} />
        <div className="md-card__body badge-grid">
          {list.map((b) => (
            <div key={b.id} className={`badge-tile${b.earned ? " badge-tile--on" : ""}`}>
              <span className="badge-tile__icon"><Icon name={b.icon} size={20} /></span>
              <span className="badge-tile__title">{b.title}</span>
              <span className="badge-tile__desc">{b.description}</span>
              {!b.earned && (
                <span className="badge-tile__bar"><span style={{ width: `${b.progress * 100}%` }} /></span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="two-col">
        <Card>
          <CardHeader title="Recent games" />
          {results.length ? (
            <ul className="result-list">
              {results.slice(-8).reverse().map((r, n) => (
                <li key={n}>
                  <span>
                    {r.label}
                    <Text size="sm" tone="muted" as="span" className="result-list__date">{formatDay(r.date)}</Text>
                  </span>
                  <span className="result-list__score">{r.score} / {r.total}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="md-card__body"><Text tone="muted">Play a game on the Practice page to see results here.</Text></div>
          )}
        </Card>

        <Card>
          <CardHeader title="Settings" />
          <div className="md-card__body word-form">
            <Input label="Your name" optional placeholder="Used in the greeting" value={settings.name} onChange={(e) => setSettings({ name: e.target.value })} />
            <Select
              label="Words per day"
              value={String(settings.goal)}
              onChange={(e) => setSettings({ goal: Number(e.target.value) })}
              options={["5", "10", "15", "20"].map((v) => ({ value: v, label: `${v} words${v === "10" ? " (recommended)" : ""}` }))}
            />
            <div>
              <Text size="sm" weight="medium">Backup</Text>
              <Text size="sm" tone="muted">Your words are saved only in this browser. Download a backup to move them to another device.</Text>
              <div className="word-form__actions">
                <Button size="sm" variant="outline" icon="download" onClick={exportFile}>Download backup</Button>
                <Button size="sm" variant="ghost" icon="upload" onClick={() => fileRef.current?.click()}>Restore</Button>
                <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
