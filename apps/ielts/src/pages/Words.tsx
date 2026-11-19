import { useState } from "react";
import { Badge, Button, Card, IconButton, Input, Modal, SearchInput, Table, Text, Textarea, type Column } from "@my-design/ui-web";
import { formatDay, isLearned, useStore, type Word, type WordInput } from "../store";
import { MediaFields, PageHeader, WordListModal } from "./common";
import { WordMedia } from "../media";

function status(w: Word) {
  if (isLearned(w)) return <Badge tone="success">Learned</Badge>;
  if (w.right + w.wrong === 0) return <Badge tone="neutral">New</Badge>;
  return <Badge tone="info">Learning</Badge>;
}

export function WordsPage() {
  const { words, removeWord, updateWord } = useStore();
  const [q, setQ] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [editing, setEditing] = useState<Word | null>(null);
  const query = q.trim().toLowerCase();
  const rows = words
    .filter((w) => !query || (w.word + " " + w.meaning).toLowerCase().includes(query))
    .slice()
    .reverse();

  const columns: Column<Word>[] = [
    { key: "word", header: "Word", sortValue: (w) => w.word.toLowerCase(), render: (w) => <span className="cell-word"><WordMedia image={w.image} word={w.word} size="sm" /><strong>{w.word}</strong></span> },
    {
      key: "meaning",
      header: "Meaning",
      render: (w) => (
        <div className="cell-meaning">
          {w.meaning}
          {w.example && <Text size="sm" tone="muted">{w.example}</Text>}
        </div>
      ),
    },
    { key: "added", header: "Added", sortValue: (w) => w.added, render: (w) => formatDay(w.added, { day: "numeric", month: "short" }) },
    { key: "status", header: "Status", sortValue: (w) => w.right - w.wrong, render: status },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (w) => (
        <span className="cell-actions">
          <IconButton size="sm" icon="edit" label={`Edit ${w.word}`} onClick={() => setEditing(w)} />
          <IconButton size="sm" icon="trash" label={`Delete ${w.word}`} onClick={() => removeWord(w.id)} />
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="My words"
        subtitle={`${words.length} words saved, ${words.filter(isLearned).length} learned. A word counts as learned after you answer it right 3 more times than wrong.`}
        actions={<Button variant="secondary" icon="list" onClick={() => setListOpen(true)}>Add from IELTS list</Button>}
      />
      <Card padding="none">
        <div className="table-toolbar">
          <SearchInput size="sm" placeholder="Search your words" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Table columns={columns} rows={rows} rowKey={(w) => w.id} empty={query ? `No word matches “${q}”.` : "No words yet. Add some on the Today page."} />
      </Card>
      <WordListModal open={listOpen} onClose={() => setListOpen(false)} limit={10} />
      {editing && <EditModal word={editing} onClose={() => setEditing(null)} onSave={(p) => (updateWord(editing.id, p), setEditing(null))} />}
    </>
  );
}

function EditModal({ word, onClose, onSave }: { word: Word; onClose: () => void; onSave: (p: WordInput) => void }) {
  const [w, setW] = useState(word.word);
  const [m, setM] = useState(word.meaning);
  const [e, setE] = useState(word.example);
  const [img, setImg] = useState(word.image);
  const [vid, setVid] = useState(word.video ?? "");
  return (
    <Modal
      open
      onClose={onClose}
      title="Edit word"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!w.trim()} onClick={() => onSave({ word: w.trim(), meaning: m.trim(), example: e.trim(), image: img, video: vid.trim() || undefined })}>Save</Button>
        </>
      }
    >
      <div className="word-form">
        <Input label="Word" value={w} onChange={(ev) => setW(ev.target.value)} />
        <Input label="Meaning" value={m} onChange={(ev) => setM(ev.target.value)} />
        <Textarea label="Example sentence" rows={2} value={e} onChange={(ev) => setE(ev.target.value)} />
        <MediaFields word={w} image={img} onImage={setImg} video={vid} onVideo={setVid} />
      </div>
    </Modal>
  );
}
