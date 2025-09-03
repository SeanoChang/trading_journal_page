"use client";
import { useEffect, useMemo, useState } from "react";
import IdeasGraph from "../../../components/ideas/IdeasGraph";

type Idea = {
  id: string;
  title: string;
  content: string;
  topic: string; // setup/topic
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

export default function ExploreClient({
  tradingPairs,
}: {
  tradingPairs: string[];
}) {
  // demo data (replace with real data source later)
  const ideas = useMemo<Idea[]>(
    () => [
      {
        id: "1",
        title: "Breakout on retest",
        content: "ETH 4H retest with volume spike",
        topic: "Breakout",
        tags: ["setup", "momentum"],
        trades: ["ETH/USDT", "ETH/BTC"],
        createdAt: new Date().toISOString(),
        winrate: 58,
        strategy: "Momentum Trading",
      },
      {
        id: "2",
        title: "Mean reversion RSI<30",
        content: "BTC 1H oversold bounce",
        topic: "Mean Reversion",
        tags: ["setup", "rsi"],
        trades: ["BTC/USDT"],
        createdAt: new Date().toISOString(),
        winrate: 62,
        strategy: "Contrarian",
      },
      {
        id: "3",
        title: "News catalyst fade",
        content: "SOL spike after listing -> fade",
        topic: "Event",
        tags: ["setup", "risk"],
        trades: ["SOL/USDT"],
        createdAt: new Date().toISOString(),
        winrate: 47,
        strategy: "Event Trading",
      },
      {
        id: "4",
        title: "Range EQH sweep",
        content: "Sweep highs then short to mid",
        topic: "Range",
        tags: ["liquidity", "setup"],
        trades: ["MATIC/USDT"],
        createdAt: new Date().toISOString(),
        winrate: 54,
        strategy: "Liquidity Hunt",
      },
      {
        id: "5",
        title: "Support bounce play",
        content: "Daily support level bounce with confluence",
        topic: "Support",
        tags: ["setup", "confluence"],
        trades: ["ADA/USDT", "DOT/USDT"],
        createdAt: new Date().toISOString(),
        winrate: 65,
        strategy: "Momentum Trading",
      },
      {
        id: "6",
        title: "Bear flag continuation",
        content: "Flag pattern after strong bearish move",
        topic: "Continuation",
        tags: ["pattern", "short"],
        trades: ["AVAX/USDT"],
        createdAt: new Date().toISOString(),
        winrate: 59,
        strategy: "Pattern Trading",
      },
    ],
    [],
  );

  // user ideas persisted locally to encourage jotting (legacy idea items)
  // Initialize empty for SSR parity; hydrate from localStorage after mount
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);

  // Load/save user ideas only on client after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ideasUser");
      const parsed = raw ? (JSON.parse(raw) as Idea[]) : [];
      if (Array.isArray(parsed)) setUserIdeas(parsed);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ideasUser", JSON.stringify(userIdeas));
    } catch {}
  }, [userIdeas]);

  const allIdeas = useMemo(() => [...userIdeas, ...ideas], [userIdeas, ideas]);

  // Journal entries (new model) persisted locally
  // Initialize empty for SSR parity; hydrate from localStorage after mount
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load/save journal entries only on client after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem("journalEntries");
      const parsed = raw ? (JSON.parse(raw) as JournalEntry[]) : [];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("journalEntries", JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const entriesAsIdeas = useMemo<Idea[]>(
    () =>
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
    [entries],
  );

  const allExploreIdeas = useMemo(
    () => [...entriesAsIdeas, ...allIdeas],
    [entriesAsIdeas, allIdeas],
  );

  return (
    <div className="min-h-screen w-full">
      <IdeasGraph ideas={allExploreIdeas} />
    </div>
  );
}
