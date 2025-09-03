"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, Chip, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/components/dashboard/animations";
import { fetchPrices, type Price } from "@/helpers/prices";
import WinrateDonut from "@/components/dashboard/WinrateDonut";
import Heatmap from "@/components/dashboard/Heatmap";
import MarketInsights from "@/components/dashboard/MarketInsights";
import Metric from "@/components/dashboard/Metric";
import EquitySpark from "@/components/dashboard/EquitySpark";
import WinrateTrend from "@/components/dashboard/WinrateTrend";
import { computeR } from "@/utils/trades";
import type { Trade } from "@/types/trade";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const user = session?.user?.name ?? "Trader";

  // Local state (no persistence yet)
  const [trades, setTrades] = useState<Trade[]>([]);

  const [stats, setStats] = useState<Record<string, number>>({});
  const [timeframe, setTimeframe] = useState<
    "7D" | "30D" | "90D" | "YTD" | "ALL"
  >("30D");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["btc", "eth", "sol"];
    try {
      const raw = localStorage.getItem("favorites");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length
        ? parsed
        : ["btc", "eth", "sol"];
    } catch {
      return ["btc", "eth", "sol"];
    }
  });
  const [favMarket, setFavMarket] = useState<Price[] | null>(null);
  const [favLoading, setFavLoading] = useState(false);
  const todayKey = new Date().toISOString().slice(0, 10);

  // Animation variants imported from components/dashboard/animations

  // Removed plan/review modal state

  const metrics = useMemo(() => {
    const executed = trades.filter((t) => t.status === "executed");
    if (executed.length === 0)
      return { winRate: 0, avgR: 0, bestR: 0, worstR: 0 };
    const rs = executed.map((t) => computeR(t) ?? 0);
    const wins = rs.filter((r) => r > 0).length;
    const winRate = Math.round((wins / executed.length) * 100);
    const avgR = Number(
      (rs.reduce((s, r) => s + r, 0) / executed.length).toFixed(2),
    );
    const bestR = Math.max(...rs);
    const worstR = Math.min(...rs);
    return { winRate, avgR, bestR, worstR };
  }, [trades]);

  const equity = useMemo(() => {
    let cum = 0;
    const pts = trades
      .filter((t) => t.status === "executed")
      .slice(-20)
      .map((t, i) => {
        const r = computeR(t) ?? 0;
        cum += r;
        return { x: i, y: cum };
      });
    return pts;
  }, [trades]);

  // Additional performance metrics
  const profitFactor = useMemo(() => {
    const rs = trades
      .filter((t) => t.status === "executed")
      .map((t) => computeR(t) ?? 0);
    const grossWin = rs.filter((r) => r > 0).reduce((s, r) => s + r, 0);
    const grossLoss = Math.abs(
      rs.filter((r) => r < 0).reduce((s, r) => s + r, 0),
    );
    if (grossLoss === 0) return grossWin > 0 ? Infinity : 0;
    return Number((grossWin / grossLoss).toFixed(2));
  }, [trades]);

  const maxDrawdownR = useMemo(() => {
    // compute from full equity series in R units
    const ex = trades.filter((t) => t.status === "executed");
    let cum = 0;
    const eq = ex.map((t) => {
      cum += computeR(t) ?? 0;
      return cum;
    });
    if (eq.length === 0) return 0;
    let peak = eq[0];
    let maxDd = 0;
    for (const v of eq) {
      peak = Math.max(peak, v);
      maxDd = Math.max(maxDd, peak - v);
    }
    return Number(maxDd.toFixed(2));
  }, [trades]);

  const recentWR = useMemo(() => {
    const recent = trades.filter((t) => t.status === "executed").slice(-5);
    if (recent.length === 0) return 0;
    const wins = recent
      .map((t) => computeR(t) ?? 0)
      .filter((r) => r > 0).length;
    return Math.round((wins / recent.length) * 100);
  }, [trades]);

  // Timeframe helpers
  const now = useMemo(() => new Date(), []);
  const startDate = useMemo(() => {
    const d = new Date(now);
    if (timeframe === "ALL") return null;
    if (timeframe === "YTD") return new Date(d.getFullYear(), 0, 1);
    const map: Record<string, number> = {
      "7D": 7,
      "30D": 30,
      "90D": 90,
      YTD: 365,
      ALL: 100000,
    };
    d.setDate(d.getDate() - map[timeframe]);
    return d;
  }, [now, timeframe]);

  const executedTF = useMemo(() => {
    const all = trades.filter((t) => t.status === "executed");
    if (!startDate) return all;
    return all.filter((t) => new Date(t.date) >= startDate);
  }, [trades, startDate]);

  const tfMetrics = useMemo(() => {
    if (executedTF.length === 0) return { winRate: 0, avgR: 0 };
    const rs = executedTF.map((t) => computeR(t) ?? 0);
    const wins = rs.filter((r) => r > 0).length;
    const winRate = Math.round((wins / executedTF.length) * 100);
    const avgR = Number(
      (rs.reduce((s, r) => s + r, 0) / executedTF.length).toFixed(2),
    );
    return { winRate, avgR };
  }, [executedTF]);

  // Winrate trendline per day in timeframe
  const winrateTrend = useMemo(() => {
    const m = new Map<string, { wins: number; total: number }>();
    executedTF.forEach((t) => {
      const key = t.date;
      const r = computeR(t) ?? 0;
      const v = m.get(key) ?? { wins: 0, total: 0 };
      v.total += 1;
      if (r > 0) v.wins += 1;
      m.set(key, v);
    });
    const entries = Array.from(m.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    return entries.map(([date, { wins, total }], i) => ({
      x: i,
      y: total ? Math.round((wins / total) * 100) : 0,
      date,
    }));
  }, [executedTF]);

  // Streaks and quality
  const streaks = useMemo(() => {
    const ex = trades
      .filter((t) => t.status === "executed")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let best = 0,
      curr = 0;
    for (const t of ex) {
      const r = computeR(t) ?? 0;
      if (r > 0) {
        curr += 1;
        best = Math.max(best, curr);
      } else {
        curr = 0;
      }
    }
    return { current: curr, best };
  }, [trades]);

  const adherence = useMemo(() => {
    const ex = trades.filter((t) => t.status === "executed");
    if (ex.length === 0) return { rate: 0, avgRPlan: 0, avgRNoPlan: 0 };
    const plan = ex.filter((t) => t.exec?.stuckToPlan);
    const noPlan = ex.filter((t) => !t.exec?.stuckToPlan);
    const rate = Math.round((plan.length / ex.length) * 100);
    const avgRPlan = plan.length
      ? Number(
          (
            plan.reduce((s, t) => s + (computeR(t) ?? 0), 0) / plan.length
          ).toFixed(2),
        )
      : 0;
    const avgRNoPlan = noPlan.length
      ? Number(
          (
            noPlan.reduce((s, t) => s + (computeR(t) ?? 0), 0) / noPlan.length
          ).toFixed(2),
        )
      : 0;
    return { rate, avgRPlan, avgRNoPlan };
  }, [trades]);

  const completionRate = useMemo(() => {
    const executedCount = trades.filter((t) => t.status === "executed").length;
    const backlog = trades.filter((t) => t.status === "planned").length;
    const denom = executedCount + backlog;
    return denom === 0 ? 0 : Math.round((executedCount / denom) * 100);
  }, [trades]);

  // Favorites prices loader + persistence
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!favorites.length) {
        setFavMarket([]);
        return;
      }
      setFavLoading(true);
      try {
        const data = await fetchPrices(favorites);
        if (mounted) setFavMarket(data);
      } catch {
        if (mounted) setFavMarket([]);
      } finally {
        if (mounted) setFavLoading(false);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [favorites]);

  // Removed planning/review helpers

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-default-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <header className="mb-8 md:mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Trading Dashboard
            </h1>
            <p className="text-sm text-default-500">
              Welcome back, {user}. Visualize progress and keep consistent.
            </p>
          </div>
          {/* Removed Plan/Review buttons */}
        </header>

        {/* Overview strip */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-default-500">Timeframe</div>
            <div className="flex gap-1">
              {(["7D", "30D", "90D", "YTD", "ALL"] as const).map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={timeframe === tf ? "solid" : "light"}
                  onPress={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-center">
            <motion.div
              variants={itemVariants}
              className="md:col-span-1 flex items-center justify-center"
            >
              <WinrateDonut value={tfMetrics.winRate} />
            </motion.div>
            <motion.div variants={itemVariants} className="md:col-span-3">
              <div className="text-xs text-default-500 mb-1">
                Equity (last 20 executed)
              </div>
              <EquitySpark points={equity} />
              <motion.div
                variants={containerVariants}
                className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
              >
                <Metric
                  label="TF Winrate"
                  value={`${tfMetrics.winRate}%`}
                  tone={
                    tfMetrics.winRate >= 50
                      ? "pos"
                      : tfMetrics.winRate >= 35
                        ? "muted"
                        : "neg"
                  }
                />
                <Metric
                  label="TF Avg R"
                  value={`${tfMetrics.avgR}`}
                  tone={tfMetrics.avgR >= 0 ? "pos" : "neg"}
                />
                <Metric
                  label="Overall Avg R"
                  value={`${metrics.avgR}`}
                  tone={metrics.avgR >= 0 ? "pos" : "neg"}
                />
                <Metric
                  label="Best/Worst R"
                  value={`${metrics.bestR} / ${metrics.worstR}`}
                  tone="muted"
                />
                <Metric
                  label="Profit Factor"
                  value={`${profitFactor === Infinity ? "∞" : profitFactor}`}
                  tone={
                    profitFactor >= 1.5 || profitFactor === Infinity
                      ? "pos"
                      : profitFactor >= 1
                        ? "muted"
                        : "neg"
                  }
                />
                <Metric
                  label="Max Drawdown (R)"
                  value={`${maxDrawdownR}`}
                  tone={
                    maxDrawdownR <= 2
                      ? "pos"
                      : maxDrawdownR <= 5
                        ? "muted"
                        : "neg"
                  }
                />
                <Metric
                  label="Recent 5 WR"
                  value={`${recentWR}%`}
                  tone={
                    recentWR >= 50 ? "pos" : recentWR >= 35 ? "muted" : "neg"
                  }
                />
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Heatmap stats={stats} title="Consistency (journals)" />
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setStats((s) => ({
                      ...s,
                      [todayKey]: (s[todayKey] ?? 0) + 1,
                    }))
                  }
                >
                  Log Journal
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() =>
                    setStats((s) => ({
                      ...s,
                      [todayKey]: Math.max(0, (s[todayKey] ?? 0) - 1),
                    }))
                  }
                >
                  Undo
                </Button>
              </div>
            </motion.div>
          </div>
          <Divider className="my-6" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start"
          >
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="text-xs text-default-500 mb-1">
                Winrate trend ({timeframe})
              </div>
              <WinrateTrend points={winrateTrend} />
            </motion.div>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4 text-sm"
            >
              <Metric
                label="Current streak"
                value={`${streaks.current}`}
                tone={streaks.current >= 3 ? "pos" : "muted"}
              />
              <Metric
                label="Best streak"
                value={`${streaks.best}`}
                tone={streaks.best >= 3 ? "pos" : "muted"}
              />
              <Metric
                label="Plan adherence"
                value={`${adherence.rate}%`}
                tone={
                  adherence.rate >= 70
                    ? "pos"
                    : adherence.rate >= 50
                      ? "muted"
                      : "neg"
                }
              />
              <Metric
                label="Completion rate"
                value={`${completionRate}%`}
                tone={
                  completionRate >= 60
                    ? "pos"
                    : completionRate >= 40
                      ? "muted"
                      : "neg"
                }
              />
              <Metric
                label="Avg R (plan)"
                value={`${adherence.avgRPlan}`}
                tone={adherence.avgRPlan >= 0 ? "pos" : "neg"}
              />
              <Metric
                label="Avg R (no-plan)"
                value={`${adherence.avgRNoPlan}`}
                tone={adherence.avgRNoPlan >= 0 ? "pos" : "neg"}
              />
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Left: Market Insights */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market Insights</h2>
                <Chip variant="flat">Live</Chip>
              </div>
              <div className="mt-4">
                <MarketInsights favorites={favorites} />
              </div>
            </section>
          </motion.div>

          {/* Right column: Favorites + Planned list */}
          <motion.div variants={itemVariants} className="space-y-6">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Favorite Coins</h2>
                <Chip variant="flat">{favorites.length}</Chip>
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  size="sm"
                  label="Add symbol"
                  placeholder="e.g. BTC"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.currentTarget as HTMLInputElement).value
                        .trim()
                        .toLowerCase();
                      if (val && !favorites.includes(val))
                        setFavorites((f) => [...f, val]);
                      (e.currentTarget as HTMLInputElement).value = "";
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setFavorites(["btc", "eth", "sol"])}
                >
                  Reset
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {favLoading && (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5"
                      >
                        <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                      </div>
                    ))}
                  </div>
                )}
                {!favLoading && (favMarket ?? []).length === 0 && (
                  <div className="text-sm text-default-500">No data.</div>
                )}
                {!favLoading &&
                  (favMarket ?? []).map((a) => {
                    const change = parseFloat(String(a.percent_change_24h));
                    const up = change >= 0;
                    return (
                      <motion.div
                        layout
                        key={a.symbol}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5"
                      >
                        <div className="text-sm font-medium">
                          {String(a.symbol).toUpperCase()}
                        </div>
                        <div className="text-sm font-mono tabular-nums">
                          {a.price}
                        </div>
                        <div
                          className={`text-sm font-semibold ${up ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {up ? "+" : ""}
                          {a.percent_change_24h}%
                        </div>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() =>
                            setFavorites((f) =>
                              f.filter(
                                (s) => s !== String(a.symbol).toLowerCase(),
                              ),
                            )
                          }
                        >
                          Remove
                        </Button>
                      </motion.div>
                    );
                  })}
              </div>
            </section>
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Planned Trades</h2>
                <Chip variant="flat">
                  {trades.filter((t) => t.status === "planned").length}
                </Chip>
              </div>
              <div className="mt-4 space-y-3">
                {trades
                  .filter((t) => t.status === "planned")
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2"
                    >
                      <div className="text-sm">
                        <div className="font-medium">
                          {t.pair} • {t.direction.toUpperCase()} • {t.date}
                        </div>
                        <div className="text-default-500">
                          E {t.plannedEntry} / S {t.plannedStop} • TPs{" "}
                          {t.plannedTPs
                            .map((p) => `${p.sizePct}%@${p.price}`)
                            .join(", ") || "—"}
                        </div>
                      </div>
                      {/* Review action removed */}
                    </div>
                  ))}
                {trades.filter((t) => t.status === "planned").length === 0 && (
                  <div className="text-sm text-default-500">
                    No planned trades yet.
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </motion.div>

        {/* Executed trades table */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Executed Trades</h2>
            <Chip variant="flat">
              Last{" "}
              {Math.min(
                trades.filter((t) => t.status === "executed").length,
                10,
              )}{" "}
              shown
            </Chip>
          </div>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-default-500">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Pair</th>
                    <th className="py-2 pr-4">Dir</th>
                    <th className="py-2 pr-4">Planned</th>
                    <th className="py-2 pr-4">Realized R</th>
                    <th className="py-2 pr-4">Plan?</th>
                    <th className="py-2 pr-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {trades
                    .filter((t) => t.status === "executed")
                    .slice(0, 10)
                    .map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-slate-200 dark:border-slate-800"
                      >
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="py-2 pr-4">{t.pair}</td>
                        <td className="py-2 pr-4 capitalize">{t.direction}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          E {t.plannedEntry} / S {t.plannedStop}
                        </td>
                        <td
                          className={`py-2 pr-4 font-mono ${(computeR(t) ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {computeR(t) ?? 0}
                        </td>
                        <td className="py-2 pr-4">
                          {t.exec?.stuckToPlan ? "Yes" : "No"}
                        </td>
                        <td
                          className="py-2 pr-4 max-w-[420px] truncate"
                          title={t.exec?.notes}
                        >
                          {t.exec?.notes}
                        </td>
                      </tr>
                    ))}
                  {trades.filter((t) => t.status === "executed").length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-default-500"
                      >
                        No executed trades yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
