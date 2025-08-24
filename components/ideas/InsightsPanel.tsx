"use client";
import Heatmap from "../../components/dashboard/Heatmap";

type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number;
  energy?: number;
  adherence?: boolean;
  r?: number;
  tags: string[];
};

function toStatsMap(entries: JournalEntry[]) {
  return entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.date] = (acc[e.date] ?? 0) + 1;
    return acc;
  }, {});
}

function computeMetrics(entries: JournalEntry[]) {
  const n = entries.length;
  const moods = entries.map((e) => e.mood);
  const avgMood = n ? Math.round((moods.reduce((s, v) => s + v, 0) / n) * 10) / 10 : 0;

  const adherenceArr: number[] = entries.map((e) => (e.adherence ? 1 : 0));
  const adherenceRate = n ? Math.round((adherenceArr.reduce((s, v) => s + v, 0) / n) * 100) : 0;

  const rs = entries.map((e) => (typeof e.r === "number" ? e.r : 0));
  const avgR = n ? Math.round((rs.reduce((s, v) => s + v, 0) / n) * 100) / 100 : 0;

  // Streak (consecutive days with entries up to today)
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) streak++;
    else break;
  }

  // Top tags
  const tagCount = new Map<string, number>();
  entries.forEach((e) => e.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1)));
  const topTags = Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return { avgMood, adherenceRate, avgR, streak, topTags };
}

function suggestions(m: { avgMood: number; adherenceRate: number; avgR: number; streak: number; topTags: [string, number][] }) {
  const out: string[] = [];
  if (m.adherenceRate < 60) out.push("Focus on pre-trade checklist; aim ≥70% plan adherence this week.");
  if (m.avgMood <= 2) out.push("Mood is low. Add a small break/ritual before sessions.");
  if (m.avgR < 0) out.push("Average R is negative; reduce size and trade A+ setups.");
  if (m.streak < 3) out.push("Build a 3-day journaling streak with micro-entries.");
  if (m.topTags.some(([t]) => t === "overtrading")) out.push("Set a max-trade count and honor it to curb overtrading.");
  if (out.length === 0) out.push("Great consistency. Gradually raise standards and refine your playbook.");
  return out;
}

export default function InsightsPanel({ entries }: { entries: JournalEntry[] }) {
  const stats = toStatsMap(entries);
  const m = computeMetrics(entries);
  const tips = suggestions(m);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur p-4">
        <div className="text-sm font-semibold mb-3">Consistency</div>
        <Heatmap stats={stats} title="Journals" weeks={12} />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur p-4">
        <div className="text-sm font-semibold mb-2">Key metrics</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Metric label="Avg mood" value={String(m.avgMood)} tone={m.avgMood >= 3 ? "pos" : "neg"} />
          <Metric label="Adherence" value={`${m.adherenceRate}%`} tone={m.adherenceRate >= 70 ? "pos" : m.adherenceRate >= 50 ? "muted" : "neg"} />
          <Metric label="Avg R" value={String(m.avgR)} tone={m.avgR >= 0 ? "pos" : "neg"} />
          <Metric label="Streak" value={`${m.streak}d`} tone={m.streak >= 3 ? "pos" : "muted"} />
        </div>
        {m.topTags.length > 0 && (
          <div className="mt-3 text-xs text-default-500">
            Focus areas: {m.topTags.map(([t, c]) => `${t}(${c})`).join(", ")}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur p-4">
        <div className="text-sm font-semibold mb-2">Coach</div>
        <ul className="list-disc list-inside text-sm text-default-600 space-y-1">
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "muted" }: { label: string; value: string; tone?: "pos" | "neg" | "muted" }) {
  const cls = tone === "pos" ? "text-emerald-600" : tone === "neg" ? "text-rose-600" : "text-default-600";
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <div className="text-xs text-default-500">{label}</div>
      <div className={`text-sm font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
