"use client";
import { motion } from "framer-motion";

export default function EquitySpark({
  points,
}: {
  points: { x: number; y: number }[];
}) {
  const w = 280,
    h = 80,
    pad = 6;
  if (points.length === 0)
    return (
      <div className="h-20 text-default-400 text-xs">
        Log trades to see equity.
      </div>
    );
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const sx = (x: number) =>
    pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
  const sy = (y: number) =>
    h - (pad + ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2));
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="block">
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        className="text-secondary"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  );
}

