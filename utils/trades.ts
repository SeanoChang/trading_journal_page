import type { Trade } from "@/types/trade";

export function computeR(t: Trade): number | undefined {
  if (t.exec?.realizedR !== undefined)
    return Number(t.exec.realizedR.toFixed?.(2) ?? t.exec.realizedR);
  if (!t.exec?.avgExit || !t.plannedEntry || !t.plannedStop) return undefined;
  const risk = Math.abs(t.plannedEntry - t.plannedStop);
  if (risk === 0) return undefined;
  const move =
    t.direction === "long"
      ? t.exec.avgExit - t.plannedEntry
      : t.plannedEntry - t.exec.avgExit;
  return Number((move / risk).toFixed(2));
}
