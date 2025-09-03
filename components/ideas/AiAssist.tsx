"use client";
import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { motion } from "framer-motion";

type Parsed = {
  title: string;
  topic: string;
  tags: string[];
  summary: string;
}[];

function fakeParse(input: string): Parsed {
  const lower = input.toLowerCase();
  const topic = lower.includes("breakout")
    ? "Breakout"
    : lower.includes("range")
      ? "Range"
      : lower.includes("rsi")
        ? "Mean Reversion"
        : "General";
  const tags = ["journal"];
  if (lower.includes("rsi")) tags.push("rsi");
  if (lower.includes("retest")) tags.push("retest");
  if (lower.includes("news")) tags.push("event");
  return [
    {
      title: input.slice(0, 60) || "New note",
      topic,
      tags,
      summary: input.slice(0, 140),
    },
  ];
}

export default function AiAssist() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Parsed>([]);

  return (
    <div>
      <p className="text-sm text-default-600 mb-2">
        Chat your thoughts and I’ll organize them into journals/ideas.
      </p>
      <div className="flex items-start gap-3">
        <Textarea
          minRows={2}
          className="flex-1"
          placeholder="e.g. Feeling good. BTC RSI below 30 on 1H near range low; looking for sweep + reclaim. Risk 0.5R."
          value={text}
          onValueChange={setText}
        />
        <Button color="primary" onPress={() => setSuggestions(fakeParse(text))}>
          Parse
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-slate-200 dark:border-slate-800 p-3"
            >
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-default-500 mt-1">Topic: {s.topic}</p>
              <p className="text-xs text-default-500">
                Tags: {s.tags.join(", ") || "—"}
              </p>
              <p className="text-xs mt-2">{s.summary}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  as={"a"}
                  href="/protected/ideas_home/new"
                  size="sm"
                  color="primary"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setSuggestions([])}
                >
                  Dismiss
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
