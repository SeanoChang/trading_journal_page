"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button, Select, SelectItem } from "@heroui/react";

type Greed = { value: number; classification: string; timestamp: string } | null;

type Ohlc = { closes: number[] };

function calcRSI(closes: number[], period = 14): number | null {
  if (!closes || closes.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.max(0, Math.min(100, Number((100 - 100 / (1 + rs)).toFixed(2))));
}

export default function MarketInsights({ favorites }: { favorites: string[] }) {
  const [symbol, setSymbol] = useState<string>(() => {
    const base = favorites?.[0]?.toUpperCase?.() || "BTC";
    return `${base}USDT`;
  });
  const [greed, setGreed] = useState<Greed>(null);
  const [closes, setCloses] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  // stagger variants
  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  } as const;
  const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } } as const;

  useEffect(() => {
    const base = favorites?.[0]?.toUpperCase?.() || "BTC";
    setSymbol(`${base}USDT`);
  }, [favorites]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [gRes, oRes] = await Promise.all([
          fetch("/api/greed").then((r) => r.ok ? r.json() : null),
          fetch(`/api/ohlc?symbol=${encodeURIComponent(symbol)}&interval=1d`).then((r) => r.ok ? r.json() : null),
        ]);
        if (!mounted) return;
        setGreed(gRes);
        setCloses((oRes as Ohlc | null)?.closes ?? null);
      } catch {
        if (!mounted) return;
        setGreed(null);
        setCloses(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, [symbol]);

  const rsi = useMemo(() => (closes ? calcRSI(closes, 14) : null), [closes]);

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div variants={itemVariants} className="md:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-default-500">Fear & Greed Index</p>
          <Button size="sm" variant="light" onPress={() => window.location.reload()}>Refresh</Button>
        </div>
        <GreedGauge value={greed?.value ?? null} label={greed?.classification ?? "—"} loading={loading} />
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-default-500">RSI (14) — {symbol}</p>
          <Select size="sm" selectedKeys={new Set([symbol])} onSelectionChange={(k) => {
            const v = Array.from(k as Set<string>)[0];
            if (v) setSymbol(v);
          }}>
            {Array.from(new Set(["BTCUSDT", "ETHUSDT", ...favorites.map((f) => `${f.toUpperCase()}USDT`)])).map((s) => (
              <SelectItem key={s}>{s}</SelectItem>
            ))}
          </Select>
        </div>
        <motion.div variants={containerVariants} className="flex items-center gap-6">
          <RSIBar value={rsi} />
          <MiniSpark data={closes ?? []} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function GreedGauge({ value, label, loading }: { value: number | null; label: string; loading: boolean }) {
  const v = value ?? 50;
  const pct = Math.max(0, Math.min(100, v));
  const color = v < 30 ? "text-rose-500" : v > 70 ? "text-emerald-500" : "text-amber-500";
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
      {loading && <div className="text-sm text-default-500">Loading…</div>}
      {!loading && (
        <div>
          <div className="h-2 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-default-500">{label}</span>
            <span className={`font-semibold ${color}`}>{value ?? "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RSIBar({ value }: { value: number | null }) {
  const v = value ?? 50;
  let tone = "text-default-600";
  if (value !== null) {
    if (v >= 70) tone = "text-rose-500"; // overbought
    else if (v <= 30) tone = "text-emerald-500"; // oversold
  }
  return (
    <div className="flex-1">
      <div className="h-2 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
        <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-2 text-sm flex items-center justify-between">
        <span className="text-default-500">RSI</span>
        <span className={`font-semibold ${tone}`}>{value ?? "—"}</span>
      </div>
    </div>
  );
}

function MiniSpark({ data }: { data: number[] }) {
  const w = 160, h = 40, pad = 4;
  if (!data?.length) return <div className="text-xs text-default-500">No data</div>;
  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const sx = (i: number) => pad + (i / Math.max(1, data.length - 1)) * (w - pad * 2);
  const sy = (y: number) => h - (pad + ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2));
  const d = data.map((y, i) => `${i === 0 ? "M" : "L"}${sx(i)},${sy(y)}`).join(" ");
  return (
    <svg width={w} height={h} className="block">
      <motion.path d={d} fill="none" stroke="currentColor" className="text-secondary" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, ease: "easeInOut" }} />
    </svg>
  );
}
