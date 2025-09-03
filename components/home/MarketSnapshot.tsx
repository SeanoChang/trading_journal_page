"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Divider,
  Skeleton,
  Button,
} from "@heroui/react";
import AnimatedText from "../general/AnimatedText";
import type { Price } from "../../types/market";

interface MarketSnapshotProps {
  market: Price[] | null;
  loading: boolean;
}

export function MarketSnapshot({ market, loading }: MarketSnapshotProps) {
  const rows = market ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="absolute -bottom-6 -left-6 w-[min(360px,80vw)]"
    >
      <Card
        shadow="lg"
        className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur"
      >
        <CardHeader className="flex gap-2">
          <div className="flex flex-col">
            <AnimatedText
              as="p"
              className="text-small text-default-500"
              text="Live snapshot"
            />
            <AnimatedText
              as="p"
              className="text-lg font-semibold"
              text="Market at a glance"
              delay={0.2}
            />
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="text-sm">
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-6 rounded-md" />
              <Skeleton className="h-6 rounded-md" />
              <Skeleton className="h-6 rounded-md" />
            </div>
          )}
          {!loading && rows.length === 0 && (
            <div className="text-default-400">Failed to load prices.</div>
          )}
          {!loading && rows.length > 0 && (
            <div className="flex flex-col">
              {rows.map((a) => {
                const change = parseFloat(String(a.percent_change_24h));
                const up = change >= 0;
                return (
                  <motion.div
                    key={a.symbol}
                    className="flex items-center justify-between py-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AnimatedText
                      className="font-medium"
                      text={String(a.symbol)}
                      step={0.008}
                    />
                    <AnimatedText
                      className="font-mono tabular-nums"
                      text={String(a.price)}
                      step={0.008}
                    />
                    <AnimatedText
                      className={`${up ? "text-emerald-500" : "text-rose-500"} font-medium`}
                      text={`${up ? "+" : ""}${a.percent_change_24h}%`}
                      step={0.008}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardBody>
        <Divider />
        <CardFooter>
          <Button as={Link} href="/protected" color="secondary" fullWidth>
            Open Dashboard
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
