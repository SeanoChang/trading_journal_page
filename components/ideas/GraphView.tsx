"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";

type Idea = { id: string; title: string; topic: string; tags: string[]; winrate?: number };

export default function IdeasGraphView({ ideas }: { ideas: Idea[] }) {
  const byTopic = useMemo(() => {
    const m = new Map<string, Idea[]>();
    ideas.forEach((i) => { const arr = m.get(i.topic) ?? []; arr.push(i); m.set(i.topic, arr); });
    return Array.from(m.entries());
  }, [ideas]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {byTopic.map(([topic, nodes], idx) => (
          <motion.div key={topic} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.03 }} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{topic}</h3>
              <span className="text-xs text-default-500">Winrate: {Math.round((nodes.reduce((s, n) => s + (n.winrate ?? 50), 0) / nodes.length))}%</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {nodes.map((n) => (
                <div key={n.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 hover:border-primary transition-colors">
                  <p className="text-sm font-medium truncate" title={n.title}>{n.title}</p>
                  <p className="text-xs text-default-500 truncate">{n.tags.join(", ") || "—"}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

