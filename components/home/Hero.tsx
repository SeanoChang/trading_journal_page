"use client";
import { Button, Link, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn } from "next-auth/react";
import AnimatedText from "../general/AnimatedText";
import { MarketSnapshot } from "./MarketSnapshot";
import type { Price } from "../../types/market";

interface HeroProps {
  market: Price[] | null;
  loading: boolean;
}

export function Hero({ market, loading }: HeroProps) {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 py-16 md:py-24">
      <div className="max-w-2xl">
        <AnimatedText
          as="h1"
          className="text-4xl md:text-6xl font-extrabold leading-tight"
          text="Track markets. Journal ideas. Level up."
          delay={0.05}
          step={0.02}
        />
        <AnimatedText
          as="p"
          className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300"
          text="A clean hub for prices, curated news, and a focused trading journal — built to help you act with clarity."
          delay={0.8}
          step={0.01}
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button color="primary" size="md" onPress={() => signIn()}>
            <AnimatedText text="Get started" />
          </Button>
          <Button variant="bordered" as={Link} href="/news" size="md">
            <AnimatedText text="Browse news" />
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip color="success" variant="flat" size="sm">
            <AnimatedText text="Real-time prices" />
          </Chip>
          <Chip color="warning" variant="flat" size="sm">
            <AnimatedText text="MDX journals" />
          </Chip>
          <Chip color="secondary" variant="flat" size="sm">
            <AnimatedText text="OAuth sign-in" />
          </Chip>
        </div>
      </div>
      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
              <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 truncate">
                <AnimatedText text="Seano's Trading — Preview" step={0.01} />
              </span>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/screenshots/trading_journal.gif"
                alt="App preview"
                fill
                priority
                unoptimized
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-black/60" />
            </div>
          </div>
          <MarketSnapshot market={market} loading={loading} />
        </div>
      </motion.div>
    </section>
  );
}
