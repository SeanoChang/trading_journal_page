"use client";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  text: string;
  className?: string;
  delay?: number; // base delay before first char
  step?: number; // per-char delay
  as?: React.ElementType;
};

export default function AnimatedText({
  text,
  className,
  delay = 0,
  step = 0.015,
  as: Tag = "span",
}: Props) {
  const chars = React.useMemo(
    () => text.split("").map((c) => (c === " " ? "\u00A0" : c)),
    [text],
  );
  return (
    <Tag className={className}>
      {chars.map((c, i) => (
        <motion.span
          key={`${c}-${i}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * step,
            duration: 0.25,
            ease: "easeOut",
          }}
          style={{ display: "inline-block" }}
        >
          {c}
        </motion.span>
      ))}
    </Tag>
  );
}
