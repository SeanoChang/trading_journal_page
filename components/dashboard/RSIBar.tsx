interface RSIBarProps {
  rsi: number;
  label?: string;
}

export function RSIBar({ rsi, label = "RSI" }: RSIBarProps) {
  const getColor = (value: number) => {
    if (value <= 30) return "text-green-500";
    if (value >= 70) return "text-red-500";
    return "text-blue-500";
  };

  const getBarColor = (value: number) => {
    if (value <= 30) return "bg-green-500";
    if (value >= 70) return "bg-red-500";
    return "bg-blue-500";
  };

  const getCondition = (value: number) => {
    if (value <= 30) return "Oversold";
    if (value >= 70) return "Overbought";
    return "Neutral";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className={`text-sm font-bold ${getColor(rsi)}`}>
          {rsi.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getBarColor(rsi)}`}
          style={{ width: `${rsi}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {getCondition(rsi)}
      </div>
    </div>
  );
}