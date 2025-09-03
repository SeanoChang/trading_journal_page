import { useEffect, useState, useMemo } from "react";
import { fetchPrices, type Price } from "../helpers/prices";

export interface UseMarketDataOptions {
  symbols?: string[];
  refreshInterval?: number;
}

export interface MarketDataHook {
  market: Price[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMarketData = ({
  symbols = ["btc", "eth", "sol"],
  refreshInterval = 60_000,
}: UseMarketDataOptions = {}): MarketDataHook => {
  const [market, setMarket] = useState<Price[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      const data = await fetchPrices(symbols);
      setMarket(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch market data");
      setMarket([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const load = async () => {
      if (!mounted) return;
      setLoading(true);
      await refresh();
    };

    load();

    if (refreshInterval > 0) {
      intervalId = setInterval(load, refreshInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval, symbols.join(",")]);

  const rows = useMemo(() => market ?? [], [market]);

  return {
    market: rows,
    loading,
    error,
    refresh,
  };
};
