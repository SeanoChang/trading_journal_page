"use client";
import { useMemo } from "react";

type Idea = { id: string; title: string; topic: string; tags: string[] };

export default function IdeasMindMapView({ ideas }: { ideas: Idea[] }) {
  const grouped = useMemo(() => {
    const m = new Map<string, Idea[]>();
    ideas.forEach((i) => { const arr = m.get(i.topic) ?? []; arr.push(i); m.set(i.topic, arr); });
    return Array.from(m.entries());
  }, [ideas]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] flex gap-8">
        {grouped.map(([topic, nodes]) => (
          <div key={topic} className="min-w-[220px]">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white/60 dark:bg-slate-900/60">
              <p className="font-semibold text-sm">{topic}</p>
            </div>
            <div className="ml-6 border-l border-dashed border-slate-300 dark:border-slate-700 pl-4 mt-3 space-y-2">
              {nodes.map((n) => (
                <div key={n.id} className="rounded-md border border-slate-200 dark:border-slate-800 p-2">
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="text-[10px] text-default-500">{n.tags.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

