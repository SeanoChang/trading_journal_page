import { useMemo } from "react";

interface MiniSparkProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function MiniSpark({ 
  data, 
  width = 80, 
  height = 20, 
  color = "currentColor" 
}: MiniSparkProps) {
  const pathData = useMemo(() => {
    if (data.length < 2) return "";

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    if (range === 0) {
      // If all values are the same, draw a horizontal line
      return `M 0,${height / 2} L ${width},${height / 2}`;
    }

    const stepX = width / (data.length - 1);
    
    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [data, width, height]);

  if (data.length < 2) {
    return (
      <div 
        className="flex items-center justify-center text-xs text-slate-400"
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="drop-shadow-sm"
      />
    </svg>
  );
}