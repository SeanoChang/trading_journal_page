import type { Node } from "../../types/ideas-graph";
import { getTimeColor } from "./temporal";
import { getAssetClassColor } from "./tickerParser";

export function getNodeColor(node: Node, isTimelineMode: boolean): string {
  if (node.type === "tag") {
    const levelColors = ["#22c55e", "#3b82f6", "#8b5cf6", "#ef4444"];
    return levelColors[node.level % levelColors.length];
  }

  if (node.type === "idea") {
    // Investment entries get special ticker-based coloring
    if ("tickers" in node && node.tickers && node.tickers.length > 0) {
      return getAssetClassColor(node.tickers[0]);
    }

    if (isTimelineMode) {
      return getTimeColor(node.age);
    }
    // Topic-based coloring
    const topicColors: Record<string, string> = {
      Breakout: "#22c55e",
      "Mean Reversion": "#3b82f6",
      Range: "#8b5cf6",
      Support: "#f59e0b",
      Event: "#ef4444",
      Journal: "#64748b",
      Continuation: "#14b8a6",
    };
    return topicColors[node.topic] || "#64748b";
  }
  return "#64748b";
}

export const LINK_STYLES = {
  topic: { color: "#94a3b8", width: 2, alpha: 0.6 },
  tag: { color: "#22c55e", width: 1.5, alpha: 0.5 },
  temporal: { color: "#3b82f6", width: 1, alpha: 0.3 },
  hierarchy: { color: "#8b5cf6", width: 2.5, alpha: 0.7 },
  strategy: { color: "#f59e0b", width: 1.5, alpha: 0.5 },
  ticker: { color: "#ffd700", width: 2, alpha: 0.8 },
} as const;
