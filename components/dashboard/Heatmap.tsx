"use client";

type DayStat = { date: string; count: number };

function format(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rangeDays(n: number) {
  const out: Date[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d);
  }
  return out;
}

export default function Heatmap({ stats, weeks = 12, title = "Consistency" }: { stats: Record<string, number>; weeks?: number; title?: string }) {
  const days = rangeDays(weeks * 7);
  const levels = (cnt: number) => (cnt >= 5 ? 4 : cnt >= 3 ? 3 : cnt >= 2 ? 2 : cnt >= 1 ? 1 : 0);
  const levelClass = (lvl: number) =>
    ["bg-slate-200 dark:bg-slate-800", "bg-emerald-200 dark:bg-emerald-900/60", "bg-emerald-300 dark:bg-emerald-800", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-500 dark:bg-emerald-600"][lvl];

  return (
    <div>
      <div className="mb-2 text-sm text-default-500">{title}</div>
      <div className="grid grid-flow-col auto-cols-[12px] gap-1">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="grid grid-rows-7 gap-1">
            {Array.from({ length: 7 }).map((_, r) => {
              const idx = w * 7 + r;
              const d = days[idx];
              const key = format(d);
              const cnt = stats[key] ?? 0;
              const lvl = levels(cnt);
              return <div key={key} className={`h-3 w-3 rounded ${levelClass(lvl)}`} title={`${key}: ${cnt}`} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

