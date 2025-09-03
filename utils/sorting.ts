import type { Price } from "../types/market";

export const findPivot = (prices: Price[], lb: number, ub: number): number => {
  let pivot = parseFloat(prices[ub].market_cap.toString());
  let i = lb - 1;

  for (let j = lb; j < ub; j++) {
    if (parseFloat(prices[j].market_cap.toString()) > pivot) {
      i++;
      [prices[i], prices[j]] = [prices[j], prices[i]];
    }
  }

  [prices[i + 1], prices[ub]] = [prices[ub], prices[i + 1]];
  return i + 1;
};

export const qSortPrices = (
  prices: Price[],
  lb: number,
  ub: number,
): Price[] => {
  if (lb === ub) return prices;
  if (lb > ub) return [];

  const pivot = findPivot(prices, lb, ub);
  qSortPrices(prices, lb, pivot - 1);
  qSortPrices(prices, pivot + 1, ub);

  return prices;
};
