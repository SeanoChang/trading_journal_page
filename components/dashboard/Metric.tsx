"use client";
import { motion } from "framer-motion";

export default function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "neg" | "muted";
}) {
  const color =
    tone === "pos"
      ? "text-emerald-500"
      : tone === "neg"
        ? "text-rose-500"
        : "text-default-600";
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
    >
      <p className="text-xs text-default-500">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </motion.div>
  );
}

