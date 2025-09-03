"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import IdeasListView from "../../../components/ideas/ListView";
import IdeasMindMapView from "../../../components/ideas/MindMapView";
import CalendarView from "../../../components/ideas/CalendarView";
import type { JournalEntryWithTags } from "../../../types/ideas";

export default function IdeasHomeClient({
  tradingPairs,
}: {
  tradingPairs: string[];
}) {
  const [view, setView] = useState<"calendar" | "list" | "mindmap">("calendar");

  // Journal entries from database
  const [journalEntries, setJournalEntries] = useState<JournalEntryWithTags[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch journal entries from database
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/journal");
        if (response.ok) {
          const entries = await response.json();
          // Handle both empty array and populated array gracefully
          setJournalEntries(Array.isArray(entries) ? entries : []);
        } else {
          // Handle specific error cases
          if (response.status === 401) {
            console.warn("User not authenticated");
          } else {
            console.error(
              `Failed to fetch journal entries: ${response.status}`,
            );
          }
          // Set empty array on error so UI shows "no entries" instead of loading
          setJournalEntries([]);
        }
      } catch (error) {
        console.error("Network error fetching journal entries:", error);
        // Set empty array on network error
        setJournalEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Create or update journal entry
  const createJournalEntry = async (entry: {
    title?: string;
    content?: string;
    date: Date;
    mood?: import("@prisma/client").Mood;
    confidence?: number;
    winRate?: number;
    tagNames?: string[];
    tradeIds?: string[];
  }) => {
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (response.ok) {
        const newEntry = await response.json();
        setJournalEntries((prev) => [newEntry, ...prev]);
      } else {
        console.error("Failed to create journal entry");
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-300">
          Loading journal entries...
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  } as const;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={container}
          className="mb-6 md:mb-8"
        >
          <motion.h1 variants={item} className="text-2xl md:text-3xl font-bold">
            Journal
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-default-600">
            Journal with ease, track performance and mindset, and get guidance.
          </motion.p>
        </motion.header>

        <div className="mb-4 flex items-center gap-2">
          <Button
            size="sm"
            variant={view === "calendar" ? "solid" : "light"}
            onPress={() => setView("calendar")}
          >
            Calendar
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "solid" : "light"}
            onPress={() => setView("list")}
          >
            Timeline
          </Button>
          <Button
            size="sm"
            variant={view === "mindmap" ? "solid" : "light"}
            onPress={() => setView("mindmap")}
          >
            Mind map
          </Button>
        </div>

        {view === "calendar" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <CalendarView entries={journalEntries} onAdd={createJournalEntry} />
          </div>
        )}

        {view === "list" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <IdeasListView entries={journalEntries} />
          </div>
        )}
        {view === "mindmap" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
            <IdeasMindMapView entries={journalEntries} />
          </div>
        )}
      </main>
    </div>
  );
}
