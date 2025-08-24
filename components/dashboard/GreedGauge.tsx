interface GreedGaugeProps {
  value: number;
  classification: string;
}

export function GreedGauge({ value, classification }: GreedGaugeProps) {
  const getColor = (val: number) => {
    if (val <= 20) return "text-red-500";
    if (val <= 40) return "text-orange-500";
    if (val <= 60) return "text-yellow-500";
    if (val <= 80) return "text-lime-500";
    return "text-green-500";
  };

  const getBackgroundColor = (val: number) => {
    if (val <= 20) return "bg-red-100 dark:bg-red-900/20";
    if (val <= 40) return "bg-orange-100 dark:bg-orange-900/20";
    if (val <= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (val <= 80) return "bg-lime-100 dark:bg-lime-900/20";
    return "bg-green-100 dark:bg-green-900/20";
  };

  return (
    <div className={`rounded-lg p-4 ${getBackgroundColor(value)}`}>
      <div className="text-center">
        <div className={`text-3xl font-bold ${getColor(value)}`}>
          {value}
        </div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
          {classification}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Fear & Greed Index
        </div>
      </div>
      <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            value <= 20 ? "bg-red-500" :
            value <= 40 ? "bg-orange-500" :
            value <= 60 ? "bg-yellow-500" :
            value <= 80 ? "bg-lime-500" :
            "bg-green-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}