"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { FiTrendingUp, FiEdit3, FiRss } from "react-icons/fi";
import AnimatedText from "../general/AnimatedText";

const features = [
  {
    title: "Actionable market intel",
    desc: "Track liquidity, momentum and trend shifts at a glance. Make faster decisions with clean deltas, not clutter.",
    Icon: FiTrendingUp,
  },
  {
    title: "Institutional-style journaling",
    desc: "Capture setups with context using MDX and revisit them with clarity. Build a repeatable process that compounds.",
    Icon: FiEdit3,
  },
  {
    title: "Noise-filtered newsflow",
    desc: "Surface only market-moving headlines from vetted sources. Stay informed without drowning in feeds.",
    Icon: FiRss,
  },
];

export function Features() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <AnimatedText
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-tight"
            text="Built for serious market workflows"
          />
          <AnimatedText
            as="p"
            className="mt-2 text-slate-600 dark:text-slate-300"
            text="Clarity-first tools that turn noise into signal."
            delay={0.5}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ title, desc, Icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="h-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md hover:shadow-xl transition-shadow">
                <CardHeader className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <AnimatedText
                    as="span"
                    className="text-xl font-semibold"
                    text={title}
                  />
                </CardHeader>
                <CardBody className="text-slate-600 dark:text-slate-300">
                  <AnimatedText text={desc} />
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
