"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import IdeasListView from "../../../components/ideas/ListView";
import IdeasMindMapView from "../../../components/ideas/MindMapView";
import CalendarView from "../../../components/ideas/CalendarView";

type Mood = "VERY_NEGATIVE" | "NEGATIVE" | "NEUTRAL" | "POSITIVE" | "VERY_POSITIVE";

type Idea = {
  id: string;
  title: string;
  content: string;
  mood?: Mood;
  confidence?: number; // 1-10 scale
  tags: string[];
  trades: string[];
  createdAt: string; // ISO
  winrate?: number;
  strategy?: string;
};

type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes: string;
  mood: number;
  energy?: number;
  adherence?: boolean;
  r?: number;
  tags: string[];
  topic?: string;
};

export default function IdeasHomeClient({ tradingPairs }: { tradingPairs: string[] }) {
  const [view, setView] = useState<"calendar" | "list" | "mindmap">("calendar");

  // demo data (replace with real data source later)
  const ideas = useMemo<Idea[]>(() => [
    { id: "1", title: "Breakout on retest", content: "ETH 4H retest with volume spike", mood: "POSITIVE", confidence: 7, tags: ["setup","momentum"], trades: ["ETH/USDT", "ETH/BTC"], createdAt: new Date().toISOString(), winrate: 58, strategy: "Momentum Trading" },
    { id: "2", title: "Mean reversion RSI<30", content: "BTC 1H oversold bounce", mood: "VERY_POSITIVE", confidence: 9, tags: ["setup","rsi"], trades: ["BTC/USDT"], createdAt: new Date().toISOString(), winrate: 62, strategy: "Contrarian" },
    { id: "3", title: "News catalyst fade", content: "SOL spike after listing -> fade", mood: "NEGATIVE", confidence: 4, tags: ["setup","risk"], trades: ["SOL/USDT"], createdAt: new Date().toISOString(), winrate: 47, strategy: "Event Trading" },
    { id: "4", title: "Range EQH sweep", content: "Sweep highs then short to mid", mood: "NEUTRAL", confidence: 6, tags: ["liquidity","setup"], trades: ["MATIC/USDT"], createdAt: new Date().toISOString(), winrate: 54, strategy: "Liquidity Hunt" },
    { id: "5", title: "Support bounce play", content: "Daily support level bounce with confluence", mood: "POSITIVE", confidence: 8, tags: ["setup","confluence"], trades: ["ADA/USDT", "DOT/USDT"], createdAt: new Date().toISOString(), winrate: 65, strategy: "Momentum Trading" },
    { id: "6", title: "Bear flag continuation", content: "Flag pattern after strong bearish move", mood: "VERY_NEGATIVE", confidence: 3, tags: ["pattern","short"], trades: ["AVAX/USDT"], createdAt: new Date().toISOString(), winrate: 59, strategy: "Pattern Trading" },
  ], []);

  // user ideas persisted locally to encourage jotting (legacy idea items)
  const [userIdeas, setUserIdeas] = useState<Idea[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("ideasUser");
      const parsed = raw ? (JSON.parse(raw) as Idea[]) : [];
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ideasUser", JSON.stringify(userIdeas));
    } catch {}
  }, [userIdeas]);

  const allIdeas = useMemo(() => [...userIdeas, ...ideas], [userIdeas, ideas]);


  // Journal entries (new model) persisted locally
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("journalEntries");
      const parsed = raw ? (JSON.parse(raw) as JournalEntry[]) : [];
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("journalEntries", JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const entriesAsIdeas = useMemo<Idea[]>(() =>
    entries.map((e) => ({
      id: e.id,
      title: e.title,
      content: e.notes,
      topic: e.topic || "Journal",
      tags: e.tags,
      trades: [], // Journal entries don't have trades by default
      createdAt: `${e.date}T00:00:00.000Z`,
      winrate: undefined,
      strategy: undefined,
    })),
  [entries]);

  const container = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0.04 } } } as const;
  const item = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } } as const;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <motion.header initial="hidden" animate="visible" variants={container} className="mb-6 md:mb-8">
          <motion.h1 variants={item} className="text-2xl md:text-3xl font-bold">Journal</motion.h1>
          <motion.p variants={item} className="mt-2 text-default-600">Journal with ease, track performance and mindset, and get guidance.</motion.p>
        </motion.header>

        <div className="mb-4 flex items-center gap-2">
          <Button size="sm" variant={view === "calendar" ? "solid" : "light"} onPress={() => setView("calendar")}>Calendar</Button>
          <Button size="sm" variant={view === "list" ? "solid" : "light"} onPress={() => setView("list")}>Timeline</Button>
          <Button size="sm" variant={view === "mindmap" ? "solid" : "light"} onPress={() => setView("mindmap")}>Mind map</Button>
        </div>

        {view === "calendar" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <CalendarView ideas={entriesAsIdeas} onAdd={(i) => {
              // Convert Idea back to JournalEntry format
              const entry: JournalEntry = {
                id: crypto.randomUUID?.() ?? String(Math.random()),
                date: i.createdAt.slice(0, 10),
                title: i.title,
                notes: i.content,
                mood: i.mood ? (
                  i.mood === "VERY_POSITIVE" ? 5 :
                  i.mood === "POSITIVE" ? 4 :
                  i.mood === "NEUTRAL" ? 3 :
                  i.mood === "NEGATIVE" ? 2 : 1
                ) : 3, // Default mood
                energy: i.confidence || 3, // Use confidence as energy or default
                adherence: true, // Default adherence
                r: undefined,
                tags: i.tags,
                topic: undefined, // Remove topic mapping
              };
              setEntries((prev) => [entry, ...prev]);
            }} />
          </div>
        )}

        {view === "list" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <IdeasListView ideas={allIdeas} />
          </div>
        )}
        {view === "mindmap" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <IdeasMindMapView ideas={allIdeas} />
          </div>
        )}

      </main>
    </div>
  );
}
