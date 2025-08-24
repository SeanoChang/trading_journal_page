"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import InlineMarkdownEditor from "./InlineMarkdownEditor";

type Draft = {
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
};

function escapeHtml(s: string) {
  return s
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;");
}

function mdToHtml(md: string) {
  // basic, safe markdown -> html (no raw html)
  // 1) code blocks
  let html = escapeHtml(md);
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="rounded bg-slate-950/90 text-slate-100 p-3 overflow-auto"><code>${code}</code></pre>`);

  // 2) inline code
  html = html.replace(/`([^`]+)`/g, (_, code) => `<code class="bg-slate-200 dark:bg-slate-800 px-1 rounded">${code}</code>`);

  // 3) headings
  html = html.replace(/^######\s?(.*)$/gm, '<h6 class="text-sm font-semibold mt-3 mb-1">$1<\/h6>');
  html = html.replace(/^#####\s?(.*)$/gm, '<h5 class="text-base font-semibold mt-4 mb-1">$1<\/h5>');
  html = html.replace(/^####\s?(.*)$/gm, '<h4 class="text-lg font-semibold mt-4 mb-1">$1<\/h4>');
  html = html.replace(/^###\s?(.*)$/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1<\/h3>');
  html = html.replace(/^##\s?(.*)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-2">$1<\/h2>');
  html = html.replace(/^#\s?(.*)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1<\/h1>');

  // 4) links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a class="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer" href="$2">$1<\/a>');

  // 5) bold/italic (simple)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1<\/strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1<\/em>');

  // 6) lists: handle block by block
  const lines = html.split(/\n/);
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };
  for (const line of lines) {
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ul) {
      if (!inUl) { closeLists(); out.push('<ul class="list-disc ml-5 my-2 space-y-1">'); inUl = true; }
      out.push(`<li>${ul[1]}</li>`);
      continue;
    }
    if (ol) {
      if (!inOl) { closeLists(); out.push('<ol class="list-decimal ml-5 my-2 space-y-1">'); inOl = true; }
      out.push(`<li>${ol[1]}</li>`);
      continue;
    }
    // not a list item
    if (line.trim() === "") { closeLists(); out.push(""); continue; }
    closeLists();
    // paragraph if not heading/pre already produced
    if (!/^<h[1-6]|<pre|<ul|<ol|<\/ul|<\/ol/.test(line)) {
      out.push(`<p class="leading-7">${line}</p>`);
    } else {
      out.push(line);
    }
  }
  closeLists();
  return out.join("\n");
}

export default function MarkdownEditor({ initial, onSave }: { initial?: Partial<Draft>; onSave?: (d: Draft) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [date, setDate] = useState(initial?.date ?? today);
  const [split, setSplit] = useState<"stack" | "split">("stack");
  const [immersive, setImmersive] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // draft persistence
  useEffect(() => {
    try {
      const snapshot: Draft = { title, content, date };
      localStorage.setItem("journalDraft", JSON.stringify(snapshot));
    } catch {}
  }, [title, content, date]);

  useEffect(() => {
    if (initial) return; // respect provided initial
    try {
      const raw = localStorage.getItem("journalDraft");
      if (raw) {
        const snap = JSON.parse(raw) as Draft;
        setTitle(snap.title ?? "");
        setContent(snap.content ?? "");
        setDate(snap.date ?? today);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const html = useMemo(() => mdToHtml(content), [content]);

  const insert = (before: string, after = "") => {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = content.slice(start, end) || "text";
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    const pos = start + before.length + selected.length + after.length;
    setTimeout(() => { el.focus(); el.setSelectionRange(pos, pos); }, 0);
  };

  const save = () => {
    const payload: Draft = { title: title || "Untitled", content, date };
    onSave?.(payload);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Input size="sm" className="w-40" type="date" value={date} onValueChange={setDate} />
        <Input size="sm" className="flex-1 min-w-[200px]" placeholder="Title" value={title} onValueChange={setTitle} />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="flat" onPress={() => setImmersive(true)}>Immersive</Button>
          <Button size="sm" variant="flat" onPress={() => setSplit((s) => (s === "split" ? "stack" : "split"))}>{split === "split" ? "Stack" : "Split"}</Button>
          <Button size="sm" color="primary" onPress={save}>Save</Button>
        </div>
      </div>
      <div className={split === "split" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" variant="flat" onPress={() => insert("**", "**")}>Bold</Button>
            <Button size="sm" variant="flat" onPress={() => insert("*", "*")}>Italic</Button>
            <Button size="sm" variant="flat" onPress={() => insert("`", "`")}>Code</Button>
            <Button size="sm" variant="flat" onPress={() => insert("\n- ")}>List</Button>
            <Button size="sm" variant="flat" onPress={() => insert("\n```\n", "\n```\n")}>Block</Button>
            <Button size="sm" variant="flat" onPress={() => insert("# ")}>H1</Button>
            <Button size="sm" variant="flat" onPress={() => insert("## ")}>H2</Button>
          </div>
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown…"
            className="w-full h-80 md:h-[28rem] rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <div className="text-xs text-default-500 mb-2">Preview</div>
          <div
            className="prose prose-slate max-w-none dark:prose-invert text-[15px] leading-7"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {immersive && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950">
          <InlineMarkdownEditor
            initial={{ title, content, date }}
            onSave={(d) => { onSave?.(d); setImmersive(false); }}
            onExit={() => setImmersive(false)}
          />
        </div>
      )}
    </div>
  );
}
