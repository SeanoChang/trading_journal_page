"use client";
import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes: string;
  mood: number; // 1-5
  energy?: number; // 1-5
  adherence?: boolean; // stuck to plan
  r?: number; // trade outcome in R (optional)
  tags: string[];
  topic?: string;
};

export default function JournalCompose({
  onAdd,
}: {
  onAdd: (entry: Omit<JournalEntry, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [adherence, setAdherence] = useState<boolean>(true);
  const [r, setR] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("");

  const allTags = useMemo(
    () => [
      "discipline",
      "patience",
      "overtrading",
      "tilt",
      "fomo",
      "focus",
      "plan",
      "confidence",
      "risk",
      "setup",
    ],
    [],
  );

  const toggleTag = (t: string) => {
    setTags((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
    );
  };

  const clear = () => {
    setTitle("");
    setNotes("");
    setMood(3);
    setEnergy(3);
    setAdherence(true);
    setR("");
    setTags([]);
    setTopic("");
  };

  const save = () => {
    const rNum = r.trim() === "" ? undefined : Number(r);
    onAdd({
      date,
      title: title || "Daily note",
      notes,
      mood,
      energy,
      adherence,
      r: rNum,
      tags,
      topic: topic || undefined,
    });
    clear();
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Journal today</div>
        <Input
          size="sm"
          type="date"
          value={date}
          onValueChange={setDate}
          className="w-40"
        />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Input
          label="Title"
          placeholder="Key theme or takeaway"
          value={title}
          onValueChange={setTitle}
        />
        <Textarea
          label="What happened? What did you learn?"
          minRows={4}
          value={notes}
          onValueChange={setNotes}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Mood (1-5)"
            selectedKeys={new Set([String(mood)])}
            onSelectionChange={(k) =>
              setMood(Number(Array.from(k as Set<string>)[0] || 3))
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={String(n)}>{n}</SelectItem>
            ))}
          </Select>
          <Select
            label="Energy (1-5)"
            selectedKeys={new Set([String(energy)])}
            onSelectionChange={(k) =>
              setEnergy(Number(Array.from(k as Set<string>)[0] || 3))
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={String(n)}>{n}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Outcome (R) – optional"
            type="number"
            value={r}
            onValueChange={setR}
            placeholder="e.g. 0.8 or -1.2"
          />
          <Input
            label="Topic – optional"
            value={topic}
            onValueChange={setTopic}
            placeholder="Breakout, Range, MR…"
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-default-500">Focus areas</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <Chip
                key={t}
                onClick={() => toggleTag(t)}
                variant={tags.includes(t) ? "solid" : "flat"}
                size="sm"
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant={adherence ? "solid" : "flat"}
            onPress={() => setAdherence((v) => !v)}
          >
            {adherence ? "Stuck to plan" : "Not per plan"}
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="flat" onPress={clear}>
              Reset
            </Button>
            <Button size="sm" color="primary" onPress={save}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
