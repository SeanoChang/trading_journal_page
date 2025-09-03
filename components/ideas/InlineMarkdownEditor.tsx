"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";

function htmlToMarkdown(html: string) {
  let out = html;
  out = out.replace(/<div><br\s*\/?><\/div>/g, "\n");
  out = out.replace(/<br\s*\/?>(?=<\/p>)/g, "");
  out = out.replace(/<br\s*\/?>(?!\n)/g, "\n");
  out = out.replace(
    /<p>([\s\S]*?)<\/p>/g,
    (_: string, c: string) => c + "\n\n",
  );
  out = out.replace(
    /<h1[^>]*>([\s\S]*?)<\/h1>/g,
    (_: string, c: string) => `# ${c}\n\n`,
  );
  out = out.replace(
    /<h2[^>]*>([\s\S]*?)<\/h2>/g,
    (_: string, c: string) => `## ${c}\n\n`,
  );
  out = out.replace(
    /<h3[^>]*>([\s\S]*?)<\/h3>/g,
    (_: string, c: string) => `### ${c}\n\n`,
  );
  out = out.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g,
    (_: string, c: string) =>
      c
        .split(/<br\s*\/?/)
        .map((l: string) => `> ${l}`)
        .join("\n") + "\n\n",
  );
  // lists
  out = out.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/g,
    (_: string, li: string) =>
      li.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/g,
        (_: string, t: string) => `- ${t}\n`,
      ) + "\n",
  );
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_: string, li: string) => {
    let i = 1;
    return (
      li.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/g,
        (_: string, t: string) => `${i++}. ${t}\n`,
      ) + "\n"
    );
  });
  // inline
  out = out.replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**");
  out = out.replace(/<em>([\s\S]*?)<\/em>/g, "*$1*");
  out = out.replace(/<code>([\s\S]*?)<\/code>/g, "`$1`");
  // strip other tags
  out = out.replace(/<[^>]+>/g, "");
  return out.trim();
}

export default function InlineMarkdownEditor({
  initial,
  onSave,
  onExit,
  showExit = true,
}: {
  initial?: { title?: string; content?: string; date?: string };
  onSave?: (d: { title: string; content: string; date: string }) => void;
  onExit?: () => void;
  showExit?: boolean;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? today);
  const editorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (initial?.content) {
      // seed as plain text; simple conversion to paragraphs
      const lines = initial.content.split(/\n/);
      el.innerHTML = lines
        .map((l) => (l.trim() === "" ? "<div><br></div>" : `<div>${l}</div>`))
        .join("");
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [initial, onExit]);

  const applyBlockShortcuts = () => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    let container = range.startContainer as HTMLElement | Text;
    // climb to a block element (div)
    while (
      container && (container as HTMLElement).nodeType === 3
        ? container.parentElement && container.parentElement.tagName !== "DIV"
        : (container as HTMLElement).tagName !== "DIV"
    ) {
      const parent = (container as any).parentElement as HTMLElement | null;
      if (!parent) break;
      container = parent;
    }
    if (!(container instanceof HTMLElement)) return;
    const text = container.innerText;
    const trimmed = text.replace(/\u00a0/g, " ");
    const h1 = /^#\s/.test(trimmed);
    const h2 = /^##\s/.test(trimmed);
    const h3 = /^###\s/.test(trimmed);
    const ul = /^(-|\*)\s/.test(trimmed);
    const ol = /^\d+\.\s/.test(trimmed);
    const bq = /^>\s/.test(trimmed);
    const clean = trimmed.replace(/^((###|##|#|\d+\.|-|\*|>)\s)/, "");
    let html = clean;
    if (h1) html = `<h1>${clean}</h1>`;
    else if (h2) html = `<h2>${clean}</h2>`;
    else if (h3) html = `<h3>${clean}</h3>`;
    else if (bq) html = `<blockquote>${clean}</blockquote>`;
    else if (ul) html = `<ul><li>${clean}</li></ul>`;
    else if (ol) html = `<ol><li>${clean}</li></ol>`;
    container.innerHTML = html || "<br>";
  };

  const applyInlineShortcuts = () => {
    const el = editorRef.current;
    if (!el) return;
    // transform **bold** *em* `code`
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const candidates: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const t = node as Text;
      if (!t.nodeValue) continue;
      if (
        /\*\*[^*]+\*\*/.test(t.nodeValue) ||
        /\*[^*]+\*/.test(t.nodeValue) ||
        /`[^`]+`/.test(t.nodeValue)
      ) {
        candidates.push(t);
      }
    }
    for (const t of candidates) {
      const span = document.createElement("span");
      let html = t.nodeValue as string;
      html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      span.innerHTML = html;
      t.parentNode?.replaceChild(span, t);
    }
  };

  const onInput = (e: React.FormEvent<HTMLDivElement>) => {
    // run inline transforms opportunistically
    applyInlineShortcuts();
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      applyBlockShortcuts();
      applyInlineShortcuts();
    }
    if (e.key === "/") {
      // open slash menu near caret
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0).cloneRange();
      const rects = range.getBoundingClientRect();
      const x = rects.left || 20;
      const y = (rects.top || 20) + 20;
      setSlashPos({ x, y });
      setSlashOpen(true);
    }
  };

  const save = () => {
    const el = editorRef.current;
    const content = el ? htmlToMarkdown(el.innerHTML) : "";
    onSave?.({ title: title || "Untitled", content, date });
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setSlashOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const transformBlock = (
    kind: "text" | "h1" | "h2" | "h3" | "ul" | "ol" | "quote" | "divider",
  ) => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    let container = range.startContainer as HTMLElement | Text;
    while (
      container &&
      !(container instanceof HTMLElement && container.tagName === "DIV")
    ) {
      const parent = (container as any).parentElement as HTMLElement | null;
      if (!parent) break;
      container = parent;
    }
    if (!(container instanceof HTMLElement)) return;
    const text = container.innerText.replace(/^\/?/, "");
    let html = text;
    if (kind === "text") html = text || "<br>";
    if (kind === "h1") html = `<h1>${text}</h1>`;
    if (kind === "h2") html = `<h2>${text}</h2>`;
    if (kind === "h3") html = `<h3>${text}</h3>`;
    if (kind === "ul") html = `<ul><li>${text}</li></ul>`;
    if (kind === "ol") html = `<ol><li>${text}</li></ol>`;
    if (kind === "quote") html = `<blockquote>${text}</blockquote>`;
    if (kind === "divider") html = `<hr />`;
    container.innerHTML = html;
    setSlashOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <Input
          size="sm"
          className="w-40"
          type="date"
          value={date}
          onValueChange={setDate}
        />
        <Input
          size="sm"
          className="flex-1 min-w-[200px]"
          placeholder="Title"
          value={title}
          onValueChange={setTitle}
        />
        <div className="ml-auto flex items-center gap-2">
          {showExit && (
            <Button size="sm" variant="flat" onPress={onExit}>
              Exit
            </Button>
          )}
          <Button size="sm" color="primary" onPress={save}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck
          className="min-h-full outline-none px-6 py-4 prose prose-slate dark:prose-invert max-w-3xl mx-auto"
          onInput={onInput}
          onKeyUp={onKeyUp}
        >
          <div>
            <br />
          </div>
        </div>
        {slashOpen && (
          <div
            ref={menuRef}
            style={{ position: "fixed", left: slashPos.x, top: slashPos.y }}
            className="z-50 w-56 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-2"
          >
            <div className="text-xs text-default-500 px-2 pb-1">Add block</div>
            <MenuItem label="Text" onClick={() => transformBlock("text")} />
            <MenuItem label="Heading 1" onClick={() => transformBlock("h1")} />
            <MenuItem label="Heading 2" onClick={() => transformBlock("h2")} />
            <MenuItem label="Heading 3" onClick={() => transformBlock("h3")} />
            <MenuItem
              label="Bulleted list"
              onClick={() => transformBlock("ul")}
            />
            <MenuItem
              label="Numbered list"
              onClick={() => transformBlock("ol")}
            />
            <MenuItem label="Quote" onClick={() => transformBlock("quote")} />
            <MenuItem
              label="Divider"
              onClick={() => transformBlock("divider")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
    >
      {label}
    </button>
  );
}
