"use client";
export default function WinrateDonut({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="block">
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={stroke} />
          <circle
            r={r}
            fill="none"
            stroke="currentColor"
            className={pct >= 50 ? "text-emerald-500" : pct >= 35 ? "text-yellow-500" : "text-rose-500"}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
          <text textAnchor="middle" dominantBaseline="middle" className="fill-current text-xl font-semibold">
            {pct}%
          </text>
        </g>
      </svg>
      <div className="mt-2 text-xs text-default-500">Win rate</div>
    </div>
  );
}

