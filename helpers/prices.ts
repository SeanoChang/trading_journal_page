import type { Price } from "../types/market";

export type { Price };

export async function fetchPrices(assets: string[]): Promise<Price[]> {
  const qs = encodeURIComponent(assets.join(","));
  const res = await fetch(`/api/prices?assets=${qs}`);
  if (!res.ok) throw new Error("Failed to fetch prices");
  const data = (await res.json()) as Price[] | { error: string };
  if (Array.isArray(data)) return data;
  throw new Error("Invalid prices payload");
}

