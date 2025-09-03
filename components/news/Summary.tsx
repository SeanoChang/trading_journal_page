"use client";
import { useMemo } from "react";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";

type News = { title: string; link: string; source: string };

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "is",
  "are",
  "be",
  "as",
  "at",
  "by",
  "with",
  "from",
  "that",
  "this",
  "it",
  "its",
  "will",
  "new",
  "update",
  "after",
  "over",
  "into",
  "amid",
  "about",
  "vs",
  "vs.",
  "as",
  "up",
  "down",
  "out",
  "how",
  "why",
  "what",
  "now",
  "today",
  "week",
  "month",
]);

const TICKERS = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "AVAX",
  "BNB",
  "USDT",
  "USDC",
  "ARB",
  "OP",
  "LINK",
  "MATIC",
  "TON",
  "DOT",
  "LTC",
];

function extractDomain(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function Summary({ news }: { news: News[] }) {
  const { keywords, sources, domains, mentions } = useMemo(() => {
    const kw = new Map<string, number>();
    const src = new Map<string, number>();
    const dom = new Map<string, number>();
    const men = new Map<string, number>();

    for (const n of news) {
      src.set(n.source, (src.get(n.source) ?? 0) + 1);
      const d = extractDomain(n.link);
      dom.set(d, (dom.get(d) ?? 0) + 1);

      const words = n.title
        .replace(/[^A-Za-z0-9\s]/g, " ")
        .split(/\s+/)
        .map((w) => w.trim());

      for (const w of words) {
        if (!w) continue;
        const upper = w.toUpperCase();
        if (TICKERS.includes(upper)) {
          men.set(upper, (men.get(upper) ?? 0) + 1);
        }
        const lower = w.toLowerCase();
        if (STOP_WORDS.has(lower)) continue;
        if (lower.length < 4) continue;
        kw.set(lower, (kw.get(lower) ?? 0) + 1);
      }
    }

    const toSortedArray = (m: Map<string, number>, take = 5) =>
      Array.from(m.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, take);

    return {
      keywords: toSortedArray(kw, 6),
      sources: toSortedArray(src, 4),
      domains: toSortedArray(dom, 4),
      mentions: toSortedArray(men, 6),
    };
  }, [news]);

  if (!news?.length) return null;

  return (
    <Card className="w-full max-w-6xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡️</span>
          <h2 className="text-lg md:text-xl font-semibold">What’s Up Now</h2>
        </div>
        <span className="text-xs text-default-500">
          Auto‑summarized from latest headlines
        </span>
      </CardHeader>
      <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-default-500 mb-2">
            Top keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map(([k, v]) => (
              <Chip key={k} size="sm" variant="flat" color="secondary">
                {k} • {v}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-default-500 mb-2">
            Ticker mentions
          </p>
          <div className="flex flex-wrap gap-2">
            {mentions.length === 0 && (
              <span className="text-default-500 text-sm">
                No clear ticker spikes
              </span>
            )}
            {mentions.map(([k, v]) => (
              <Chip key={k} size="sm" variant="flat" color="primary">
                {k} • {v}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-default-500 mb-2">
            Sources & domains
          </p>
          <div className="flex flex-wrap gap-2">
            {sources.map(([k, v]) => (
              <Chip key={k} size="sm" variant="flat" color="success">
                {k} • {v}
              </Chip>
            ))}
            {domains.map(([k, v]) => (
              <Chip key={k} size="sm" variant="flat">
                {k} • {v}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
