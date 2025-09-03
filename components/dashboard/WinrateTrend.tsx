"use client";
import { motion } from "framer-motion";

export default function WinrateTrend({
  points,
}: {
  points: { x: number; y: number; date?: string }[];
}) {
  const w = 560,
    h = 120,
    pad = 8;
  if (!points.length)
    return (
      <div className="h-28 text-default-400 text-xs">
        No executed trades in timeframe.
      </div>
    );
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = 0,
    maxY = 100; // winrate %
  const sx = (x: number) =>
    pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
  const sy = (y: number) =>
    h - (pad + ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2));
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="block">
      <rect x={0} y={0} width={w} height={h} className="fill-transparent" />
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <line
        x1={pad}
        x2={w - pad}
        y1={sy(50)}
        y2={sy(50)}
        className="stroke-current text-default-300"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

