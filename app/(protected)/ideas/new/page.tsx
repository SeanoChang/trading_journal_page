"use client";
import { useState } from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function NewIdeaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Breakout");
  const [tags, setTags] = useState<string>("");
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-3xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          New Journal / Idea
        </h1>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" value={title} onValueChange={setTitle} />
            <Select
              label="Topic / Setup"
              selectedKeys={new Set([topic])}
              onSelectionChange={(k) =>
                setTopic(Array.from(k as Set<string>)[0] || "Breakout")
              }
            >
              {["Breakout", "Mean Reversion", "Range", "Event", "Other"].map(
                (t) => (
                  <SelectItem key={t}>{t}</SelectItem>
                ),
              )}
            </Select>
            <Input
              label="Tags (comma separated)"
              placeholder="rsi, retest, risk"
              value={tags}
              onValueChange={setTags}
            />
            <div />
            <Textarea
              className="md:col-span-2"
              minRows={8}
              label="Content"
              placeholder="Write your idea/journal entry here…"
              value={content}
              onValueChange={setContent}
            />
          </div>
          <div className="mt-6 flex gap-2">
            <Button
              color="primary"
              onPress={() => router.push("/protected/ideas_home")}
            >
              Save
            </Button>
            <Button variant="light" onPress={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
