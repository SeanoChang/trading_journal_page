"use client";
import { useMemo, useRef, useState } from "react";
import { Button, Chip, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Mood = "VERY_NEGATIVE" | "NEGATIVE" | "NEUTRAL" | "POSITIVE" | "VERY_POSITIVE";

type Idea = {
  id: string;
  title: string;
  content: string;
  mood?: Mood;
  confidence?: number; // 1-10 scale
  tags: string[];
  trades: string[];
  createdAt: string; // ISO date string
  winrate?: number;
  strategy?: string;
};

function startOfDayISO(d: Date) {
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  return dd.toISOString().slice(0, 10);
}

function getMonthMatrix(year: number, month: number) {
  // month is 0-11
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  // leading days
  for (let i = 0; i < startDay; i++) {
    const d = new Date(year, month, -i);
    cells.unshift({ date: d, inMonth: false });
  }
  // month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  // trailing to complete 6 weeks (42 cells)
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1]?.date ?? new Date(year, month, daysInMonth);
    const nxt = new Date(last);
    nxt.setDate(last.getDate() + 1);
    cells.push({ date: nxt, inMonth: false });
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function CalendarView({ ideas, onAdd }: { ideas: Idea[]; onAdd?: (idea: Omit<Idea, "id">) => void }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<string>(startOfDayISO(now));
  const [draft, setDraft] = useState({ title: "", content: "", mood: "" as Mood | "", confidence: "", tags: "", trades: "" });
  const [tagInput, setTagInput] = useState("");
  const [tradeInput, setTradeInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const mapByDate = useMemo(() => {
    const m = new Map<string, Idea[]>();
    ideas.forEach((i) => {
      const key = i.createdAt.slice(0, 10);
      const arr = m.get(key) ?? [];
      arr.push(i);
      m.set(key, arr);
    });
    return m;
  }, [ideas]);

  const weeks = useMemo(() => getMonthMatrix(cursor.y, cursor.m), [cursor]);
  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const selectedIdeas = mapByDate.get(selected) ?? [];

  const prevMonth = () => {
    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  };
  const nextMonth = () => {
    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  };

  const goToday = () => {
    const t = startOfDayISO(now);
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setSelected(t);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const addQuick = () => {
    if (!onAdd) return;
    const cleanTags = draft.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const cleanTrades = draft.trades
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onAdd({
      title: draft.title || "Untitled",
      content: draft.content,
      mood: draft.mood || undefined,
      confidence: draft.confidence ? parseInt(draft.confidence) : undefined,
      tags: cleanTags,
      trades: cleanTrades,
      createdAt: `${selected}T00:00:00.000Z`,
    });
    setDraft({ title: "", content: "", mood: "" as Mood | "", confidence: "", tags: "", trades: "" });
    setTagInput("");
    setTradeInput("");
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    const existingTags = draft.tags ? draft.tags.split(",").map(t => t.trim()) : [];
    if (!existingTags.includes(tag.trim())) {
      const newTags = [...existingTags, tag.trim()].join(", ");
      setDraft(d => ({ ...d, tags: newTags }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const existingTags = draft.tags ? draft.tags.split(",").map(t => t.trim()) : [];
    const filteredTags = existingTags.filter(tag => tag !== tagToRemove);
    setDraft(d => ({ ...d, tags: filteredTags.join(", ") }));
  };

  const addTrade = (trade: string) => {
    if (!trade.trim()) return;
    const existingTrades = draft.trades ? draft.trades.split(",").map(t => t.trim()) : [];
    if (!existingTrades.includes(trade.trim())) {
      const newTrades = [...existingTrades, trade.trim()].join(", ");
      setDraft(d => ({ ...d, trades: newTrades }));
    }
    setTradeInput("");
  };

  const removeTrade = (tradeToRemove: string) => {
    const existingTrades = draft.trades ? draft.trades.split(",").map(t => t.trim()) : [];
    const filteredTrades = existingTrades.filter(trade => trade !== tradeToRemove);
    setDraft(d => ({ ...d, trades: filteredTrades.join(", ") }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const existingTagsArray = draft.tags ? draft.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const existingTradesArray = draft.trades ? draft.trades.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button aria-label="Previous month" onClick={prevMonth} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-base md:text-lg font-semibold tracking-wide">{monthName}</div>
            <button aria-label="Next month" onClick={nextMonth} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button onClick={goToday} className="text-xs md:text-sm text-emerald-600 hover:underline">Today</button>
        </div>

        <div className="grid grid-cols-7 text-[11px] md:text-xs text-default-500 mb-1 px-1">
          {weekdays.map((w) => (
            <div key={w} className="py-1 text-center">{w}</div>
          ))}
        </div>

        <div className="grid grid-rows-6 grid-cols-7 gap-1 min-h-[576px]">
          {weeks.flat().map(({ date, inMonth }, index) => {
            const key = startOfDayISO(date);
            const cnt = mapByDate.get(key)?.length ?? 0;
            const isSelected = key === selected;
            const isToday = key === startOfDayISO(now);
            const animationDelay = `${index * 15}ms`;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                style={{ animationDelay }}
                className={`flex flex-col items-start rounded-lg p-2 h-24 text-left transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-2 ${
                  isSelected
                    ? "ring-1 ring-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 scale-105 shadow-md"
                    : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:scale-102 hover:shadow-sm"
                } ${!inMonth ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs transition-colors ${
                    isToday ? "text-emerald-700 dark:text-emerald-300" : "text-default-600"
                  }`}>
                    {isToday ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 animate-pulse">{date.getDate()}</span>
                    ) : (
                      date.getDate()
                    )}
                  </span>
                  {cnt > 0 && (
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <div className="mt-1 space-y-1 w-full">
                  {(mapByDate.get(key) ?? []).slice(0, 2).map((i, idx) => (
                    <div 
                      key={i.id} 
                      className="truncate text-[11px] text-default-600 animate-in fade-in-0 slide-in-from-left-1"
                      style={{ animationDelay: `${(index * 15) + (idx * 50)}ms` }}
                    >
                      • {i.title}
                    </div>
                  ))}
                  {cnt > 2 && (
                    <div 
                      className="text-[11px] text-default-400 animate-in fade-in-0 slide-in-from-left-1"
                      style={{ animationDelay: `${(index * 15) + 100}ms` }}
                    >
                      +{cnt - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="lg:col-span-1 flex flex-col" style={{ minHeight: '576px' }}>
        {/* Minimal news-like panel */}
        <div className="px-1 flex-1 flex flex-col">
          {/* Header */}
          <div className="px-1 py-2 flex items-center justify-between">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {formatDate(selected)}
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
              {selectedIdeas.length === 0 ? "No entries" : `${selectedIdeas.length} ${selectedIdeas.length === 1 ? 'entry' : 'entries'}`}
            </div>
          </div>

          {/* Existing entries */}
          {selectedIdeas.length > 0 && (
            <div className="px-0 py-0 flex-shrink-0">
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
                {selectedIdeas.map((i, index) => (
                  <div 
                    key={i.id} 
                    className="px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 animate-in fade-in-0 slide-in-from-right-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1 group-hover:text-blue-600 cursor-pointer transition-colors">
                      {i.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {i.content}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {i.mood && (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          i.mood === "VERY_POSITIVE" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                          i.mood === "POSITIVE" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" :
                          i.mood === "NEUTRAL" ? "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300" :
                          i.mood === "NEGATIVE" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}>
                          {i.mood === "VERY_POSITIVE" ? "😊" :
                           i.mood === "POSITIVE" ? "🙂" :
                           i.mood === "NEUTRAL" ? "😐" :
                           i.mood === "NEGATIVE" ? "😕" : "😞"} {i.mood.replace("_", " ").toLowerCase()}
                        </span>
                      )}
                      {i.confidence && (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                          🎯 {i.confidence}/10
                        </span>
                      )}
                      {i.tags.map((t) => (
                        <span key={t} className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full text-xs">
                          {t}
                        </span>
                      ))}
                      {i.trades && i.trades.map((t) => (
                        <span key={t} className="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full text-xs">
                          📈 {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notion-style form */}
          <div className="px-8 py-8 flex-1 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Title input - Notion style */}
              <div>
                <input
                  type="text"
                  placeholder="Untitled"
                  value={draft.title}
                  onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                  className="w-full text-2xl font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none resize-none"
                />
              </div>

              {/* Content textarea - Notion style */}
              <div>
                <textarea
                  placeholder="What's on your mind today?"
                  value={draft.content}
                  onChange={(e) => setDraft(d => ({ ...d, content: e.target.value }))}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      addQuick();
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
                    placeholder={existingTagsArray.length === 0 ? "Add tags..." : ""}
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

              {/* Trades section - Similar to tags */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
                  {existingTradesArray.map((trade, index) => (
                    <span
                      key={trade}
                      className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm animate-in fade-in-0 slide-in-from-bottom-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      📈 {trade}
                      <button
                        onClick={() => removeTrade(trade)}
                        className="ml-1 text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={existingTradesArray.length === 0 ? "Add trades..." : ""}
                    value={tradeInput}
                    onChange={(e) => setTradeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTrade(tradeInput);
                      }
                    }}
                    className="flex-1 min-w-24 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              {/* Mood and Confidence selectors */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <Select
                  placeholder="How are you feeling?"
                  selectedKeys={draft.mood ? new Set([draft.mood]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedMood = Array.from(keys as Set<string>)[0] as Mood || "";
                    setDraft(d => ({ ...d, mood: selectedMood }));
                  }}
                  size="sm"
                  variant="flat"
                  classNames={{
                    trigger: "bg-transparent border-none shadow-none",
                    value: "text-slate-600 dark:text-slate-400"
                  }}
                >
                  <SelectItem key="VERY_POSITIVE" startContent="😊">Very Positive</SelectItem>
                  <SelectItem key="POSITIVE" startContent="🙂">Positive</SelectItem>
                  <SelectItem key="NEUTRAL" startContent="😐">Neutral</SelectItem>
                  <SelectItem key="NEGATIVE" startContent="😕">Negative</SelectItem>
                  <SelectItem key="VERY_NEGATIVE" startContent="😞">Very Negative</SelectItem>
                </Select>
                
                <Select
                  placeholder="Confidence level (1-10)"
                  selectedKeys={draft.confidence ? new Set([draft.confidence]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedConfidence = Array.from(keys as Set<string>)[0] || "";
                    setDraft(d => ({ ...d, confidence: selectedConfidence }));
                  }}
                  size="sm"
                  variant="flat"
                  classNames={{
                    trigger: "bg-transparent border-none shadow-none",
                    value: "text-slate-600 dark:text-slate-400"
                  }}
                >
                  <SelectItem key="1" startContent="🎯">1 - Very Low</SelectItem>
                  <SelectItem key="2" startContent="🎯">2 - Low</SelectItem>
                  <SelectItem key="3" startContent="🎯">3 - Below Average</SelectItem>
                  <SelectItem key="4" startContent="🎯">4 - Somewhat Low</SelectItem>
                  <SelectItem key="5" startContent="🎯">5 - Average</SelectItem>
                  <SelectItem key="6" startContent="🎯">6 - Somewhat High</SelectItem>
                  <SelectItem key="7" startContent="🎯">7 - Above Average</SelectItem>
                  <SelectItem key="8" startContent="🎯">8 - High</SelectItem>
                  <SelectItem key="9" startContent="🎯">9 - Very High</SelectItem>
                  <SelectItem key="10" startContent="🎯">10 - Extremely High</SelectItem>
                </Select>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="px-1 py-2 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDraft({ title: "", content: "", mood: "" as Mood | "", confidence: "", tags: "", trades: "" });
                  setTagInput("");
                  setTradeInput("");
                }}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={addQuick}
                disabled={!draft.content.trim()}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>

        {/* Floating save indicator */}
        {(draft.title || draft.content) && (
          <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 p-3 rounded-full shadow-lg animate-in slide-in-from-bottom-2 duration-300 animate-pulse">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
