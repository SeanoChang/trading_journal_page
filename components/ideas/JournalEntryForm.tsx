"use client";
import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import type { Mood, Trade } from "@prisma/client";

interface DraftEntry {
  title: string;
  content: string;
  mood: Mood | "";
  confidence: string;
  tags: string;
  tradeIds: string[];
}

interface JournalEntryFormProps {
  selectedDate: string;
  onSubmit?: (entry: {
    title?: string;
    content?: string;
    date: Date;
    mood?: Mood;
    confidence?: number;
    tagNames?: string[];
    tradeIds?: string[];
  }) => void;
  onClear?: () => void;
}

export default function JournalEntryForm({
  selectedDate,
  onSubmit,
  onClear,
}: JournalEntryFormProps) {
  const [draft, setDraft] = useState<DraftEntry>({
    title: "",
    content: "",
    mood: "",
    confidence: "",
    tags: "",
    tradeIds: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(true);

  // Fetch existing trades for selection
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch("/api/trades");
        if (response.ok) {
          const tradesData = await response.json();
          setTrades(Array.isArray(tradesData) ? tradesData : []);
        } else {
          console.error("Failed to fetch trades");
          setTrades([]);
        }
      } catch (error) {
        console.error("Error fetching trades:", error);
        setTrades([]);
      } finally {
        setIsLoadingTrades(false);
      }
    };

    fetchTrades();
  }, []);

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    const existingTags = draft.tags
      ? draft.tags.split(",").map((t) => t.trim())
      : [];
    if (!existingTags.includes(tag.trim())) {
      const newTags = [...existingTags, tag.trim()].join(", ");
      setDraft((d) => ({ ...d, tags: newTags }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const existingTags = draft.tags
      ? draft.tags.split(",").map((t) => t.trim())
      : [];
    const filteredTags = existingTags.filter((tag) => tag !== tagToRemove);
    setDraft((d) => ({ ...d, tags: filteredTags.join(", ") }));
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    const cleanTags = draft.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: draft.title || "Untitled",
      content: draft.content,
      date: new Date(`${selectedDate}T00:00:00.000Z`),
      mood: draft.mood || undefined,
      confidence: draft.confidence ? parseInt(draft.confidence) : undefined,
      tagNames: cleanTags,
      tradeIds: draft.tradeIds,
    });
    handleClear();
  };

  const handleClear = () => {
    setDraft({
      title: "",
      content: "",
      mood: "",
      confidence: "",
      tags: "",
      tradeIds: [],
    });
    setTagInput("");
    onClear?.();
  };

  const existingTagsArray = draft.tags
    ? draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      {/* Notion-style form */}
      <div className="px-8 py-8 flex-1 flex flex-col justify-center">
        <div className="space-y-6">
          {/* Title input - Notion style */}
          <div>
            <input
              type="text"
              placeholder="Untitled"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              className="w-full text-2xl font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none resize-none"
            />
          </div>

          {/* Content textarea - Notion style */}
          <div>
            <textarea
              placeholder="What's on your mind today?"
              value={draft.content}
              onChange={(e) =>
                setDraft((d) => ({ ...d, content: e.target.value }))
              }
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={6}
              className="w-full text-base text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Tags section - Notion style */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
              {existingTagsArray.map((tag, index) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm animate-in fade-in-0 slide-in-from-bottom-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={
                  existingTagsArray.length === 0 ? "Add tags..." : ""
                }
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                className="flex-1 min-w-24 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none"
              />
            </div>
          </div>

          {/* Trade selection */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Select
              label="Select related trades"
              placeholder={
                isLoadingTrades
                  ? "Loading trades..."
                  : "Choose trades (optional)"
              }
              selectionMode="multiple"
              selectedKeys={new Set(draft.tradeIds)}
              onSelectionChange={(keys) => {
                setDraft((d) => ({
                  ...d,
                  tradeIds: Array.from(keys as Set<string>),
                }));
              }}
              size="sm"
              variant="flat"
              isDisabled={isLoadingTrades}
              classNames={{
                trigger: "bg-transparent border-none shadow-none",
                value: "text-slate-600 dark:text-slate-400",
              }}
            >
              {trades.map((trade) => (
                <SelectItem
                  key={trade.id}
                  startContent={trade.side === "BUY" ? "📈" : "📉"}
                  description={`${trade.orderStatus} - ${trade.side}`}
                >
                  {trade.pair}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Mood and Confidence selectors */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <Select
              placeholder="How are you feeling?"
              selectedKeys={draft.mood ? new Set([draft.mood]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedMood =
                  (Array.from(keys as Set<string>)[0] as Mood) || "";
                setDraft((d) => ({ ...d, mood: selectedMood }));
              }}
              size="sm"
              variant="flat"
              classNames={{
                trigger: "bg-transparent border-none shadow-none",
                value: "text-slate-600 dark:text-slate-400",
              }}
            >
              <SelectItem key="VERY_POSITIVE" startContent="😊">
                Very Positive
              </SelectItem>
              <SelectItem key="POSITIVE" startContent="🙂">
                Positive
              </SelectItem>
              <SelectItem key="NEUTRAL" startContent="😐">
                Neutral
              </SelectItem>
              <SelectItem key="NEGATIVE" startContent="😕">
                Negative
              </SelectItem>
              <SelectItem key="VERY_NEGATIVE" startContent="😞">
                Very Negative
              </SelectItem>
            </Select>

            <Select
              placeholder="Confidence level (1-10)"
              selectedKeys={
                draft.confidence ? new Set([draft.confidence]) : new Set()
              }
              onSelectionChange={(keys) => {
                const selectedConfidence =
                  Array.from(keys as Set<string>)[0] || "";
                setDraft((d) => ({ ...d, confidence: selectedConfidence }));
              }}
              size="sm"
              variant="flat"
              classNames={{
                trigger: "bg-transparent border-none shadow-none",
                value: "text-slate-600 dark:text-slate-400",
              }}
            >
              <SelectItem key="1" startContent="🎯">
                1 - Very Low
              </SelectItem>
              <SelectItem key="2" startContent="🎯">
                2 - Low
              </SelectItem>
              <SelectItem key="3" startContent="🎯">
                3 - Below Average
              </SelectItem>
              <SelectItem key="4" startContent="🎯">
                4 - Somewhat Low
              </SelectItem>
              <SelectItem key="5" startContent="🎯">
                5 - Average
              </SelectItem>
              <SelectItem key="6" startContent="🎯">
                6 - Somewhat High
              </SelectItem>
              <SelectItem key="7" startContent="🎯">
                7 - Above Average
              </SelectItem>
              <SelectItem key="8" startContent="🎯">
                8 - High
              </SelectItem>
              <SelectItem key="9" startContent="🎯">
                9 - Very High
              </SelectItem>
              <SelectItem key="10" startContent="🎯">
                10 - Extremely High
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-1 py-2 flex items-center justify-end gap-3">
        <button
          onClick={handleClear}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={!draft.content.trim()}
          className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>

      {/* Floating save indicator */}
      {(draft.title || draft.content) && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 p-3 rounded-full shadow-lg animate-in slide-in-from-bottom-2 duration-300 animate-pulse">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
        </div>
      )}
    </>
  );
}
