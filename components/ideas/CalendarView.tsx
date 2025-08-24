"use client";
import { useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { JournalEntryWithTags } from "../../types/ideas";
import type { Mood } from "@prisma/client";
import JournalEntryForm from "./JournalEntryForm";

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

export default function CalendarView({ entries, onAdd }: { 
  entries: JournalEntryWithTags[]; 
  onAdd?: (entry: {
    title?: string;
    content?: string;
    date: Date;
    mood?: Mood;
    confidence?: number;
    tagNames?: string[];
    tradeIds?: string[];
  }) => void;
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<string>(startOfDayISO(now));
  const listRef = useRef<HTMLDivElement>(null);

  const mapByDate = useMemo(() => {
    const m = new Map<string, JournalEntryWithTags[]>();
    entries.forEach((entry) => {
      const key = entry.date.toISOString().slice(0, 10);
      const arr = m.get(key) ?? [];
      arr.push(entry);
      m.set(key, arr);
    });
    return m;
  }, [entries]);

  const weeks = useMemo(() => getMonthMatrix(cursor.y, cursor.m), [cursor]);
  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const selectedEntries = mapByDate.get(selected) ?? [];

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



  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };


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
                  {(mapByDate.get(key) ?? []).slice(0, 2).map((entry, idx) => (
                    <div 
                      key={entry.id} 
                      className="truncate text-[11px] text-default-600 animate-in fade-in-0 slide-in-from-left-1"
                      style={{ animationDelay: `${(index * 15) + (idx * 50)}ms` }}
                    >
                      • {entry.title || "Untitled"}
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
              {selectedEntries.length === 0 ? "No entries" : `${selectedEntries.length} ${selectedEntries.length === 1 ? 'entry' : 'entries'}`}
            </div>
          </div>

          {/* Existing entries */}
          {selectedEntries.length > 0 && (
            <div className="px-0 py-0 flex-shrink-0">
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
                {selectedEntries.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 animate-in fade-in-0 slide-in-from-right-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1 group-hover:text-blue-600 cursor-pointer transition-colors">
                      {entry.title || "Untitled"}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {entry.content || "No content"}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {entry.mood && (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          entry.mood === "VERY_POSITIVE" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                          entry.mood === "POSITIVE" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" :
                          entry.mood === "NEUTRAL" ? "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300" :
                          entry.mood === "NEGATIVE" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}>
                          {entry.mood === "VERY_POSITIVE" ? "😊" :
                           entry.mood === "POSITIVE" ? "🙂" :
                           entry.mood === "NEUTRAL" ? "😐" :
                           entry.mood === "NEGATIVE" ? "😕" : "😞"} {entry.mood.replace("_", " ").toLowerCase()}
                        </span>
                      )}
                      {entry.confidence && (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                          🎯 {entry.confidence}/10
                        </span>
                      )}
                      {entry.tags.map((tag) => (
                        <span key={tag.id} className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full text-xs" style={{backgroundColor: tag.color + '20'}}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <JournalEntryForm 
            selectedDate={selected}
            onSubmit={onAdd}
          />
        </div>
      </aside>
    </div>
  );
}
