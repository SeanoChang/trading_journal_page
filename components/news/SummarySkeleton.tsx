export default function SummarySkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
