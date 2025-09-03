"use client";
import { useEffect, useState } from "react";
import News from "../../components/home/News";
import Loading from "../../components/general/Loading";
import Summary from "../../components/news/Summary";
import SummarySkeleton from "../../components/news/SummarySkeleton";
import Filters from "../../components/news/Filters";

const newsPieces = 10;

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "bitcoin" | "ethereum" | "alts">(
    "all",
  );

  useEffect(() => {
    setNewsLoading(true);
    fetch(`/api/news?pieces=${newsPieces}`)
      .then((response) => response.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setNewsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#0b0b16] dark:to-[#18182b] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-6xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="mb-4">
          <Filters value={filter} onChange={setFilter} />
        </div>

        {newsLoading ? (
          <>
            <div className="mb-6">
              <SummarySkeleton />
            </div>
            <Loading />
          </>
        ) : (
          <>
            <div className="mb-6">
              <Summary news={applyFilter(news, filter)} />
            </div>
            <News newsList={applyFilter(news, filter)} showMoreLink={false} />
          </>
        )}
      </main>
    </div>
  );
}

function applyFilter(
  list: any[],
  filter: "all" | "bitcoin" | "ethereum" | "alts",
) {
  if (filter === "all") {
    return [...list].sort(
      (a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0),
    );
  }
  const isBTC = (t: string) => /(\bbitcoin\b|\bbtc\b)/i.test(t);
  const isETH = (t: string) => /(\bethereum\b|\beth\b)/i.test(t);
  const filtered = list.filter((n) => {
    const text = `${n.title ?? ""} ${n.link ?? ""}`;
    if (filter === "bitcoin") return isBTC(text);
    if (filter === "ethereum") return isETH(text);
    // alts = not btc and not eth
    return !isBTC(text) && !isETH(text);
  });
  return filtered.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}
