const Loading = () => {
  const cards = Array.from({ length: 6 });

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="mb-6">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((_, i) => (
            <div key={i} className="group">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-1 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
