"use client";
import { useMemo } from "react";
import type { JournalEntryWithTags } from "../../types/ideas";

export default function IdeasMindMapView({ entries }: { entries: JournalEntryWithTags[] }) {
  const grouped = useMemo(() => {
    const m = new Map<string, JournalEntryWithTags[]>();
    entries.forEach((entry) => { 
      // Group by tags, or 'Untagged' if no tags
      const groupKey = entry.tags.length > 0 ? entry.tags[0].name : 'Untagged';
      const arr = m.get(groupKey) ?? []; 
      arr.push(entry); 
      m.set(groupKey, arr); 
    });
    return Array.from(m.entries());
  }, [entries]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] flex gap-8">
        {grouped.map(([category, entryNodes]) => (
          <div key={category} className="min-w-[220px]">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white/60 dark:bg-slate-900/60">
              <p className="font-semibold text-sm">{category}</p>
              <p className="text-xs text-slate-500">{entryNodes.length} entries</p>
            </div>
            <div className="ml-6 border-l border-dashed border-slate-300 dark:border-slate-700 pl-4 mt-3 space-y-2">
              {entryNodes.map((entry) => (
                <div key={entry.id} className="rounded-md border border-slate-200 dark:border-slate-800 p-2">
                  <p className="text-xs font-medium">{entry.title || "Untitled"}</p>
                  <p className="text-[10px] text-default-500">
                    {entry.tags.map(tag => tag.name).join(", ") || "No tags"}
                  </p>
                  <p className="text-[10px] text-default-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  {entry.mood && (
                    <p className="text-[9px] text-default-400">Mood: {entry.mood.toLowerCase()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No journal entries yet</p>
            <p className="text-sm mt-1">Start writing to see your mind map</p>
          </div>
        )}
      </div>
    </div>
  );
}

