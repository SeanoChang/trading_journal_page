import type { Idea } from "../../types/ideas-graph";

// Enhanced ticker regex to catch various ticker patterns
export const tickerRegex = /\$([A-Z]{1,5})\b/g;
export const cryptoRegex =
  /\b(BTC|ETH|ADA|SOL|DOT|LINK|MATIC|AVAX|ATOM|UNI|AAVE|MKR|COMP|YFI|SNX|1INCH|CRV|BAL|SUSHI|ZRX|LRC|GRT|BAND|REN|KNC)\b/gi;

export interface TickerInfo {
  symbol: string;
  type: "stock" | "crypto";
  frequency: number;
  sentiment?: "bullish" | "bearish" | "neutral";
}

export function extractTickers(text: string): string[] {
  if (!text) return [];

  const tickers = new Set<string>();

  // Extract stock tickers ($AAPL, $MSFT)
  const stockMatches = [...text.matchAll(tickerRegex)];
  stockMatches.forEach((match) => tickers.add(match[1]));

  // Extract crypto mentions
  const cryptoMatches = [...text.matchAll(cryptoRegex)];
  cryptoMatches.forEach((match) => tickers.add(match[1].toUpperCase()));

  return Array.from(tickers);
}

export function processJournalEntry(idea: Idea): Idea {
  const content = [
    idea.title,
    idea.content || "",
    (idea.tags || []).join(" "),
    (idea.trades || []).join(" "),
  ].join(" ");

  const tickers = extractTickers(content);

  return {
    ...idea,
    tickers,
    type: tickers.length > 0 ? "investment" : "regular",
  };
}

export function analyzeTickerSentiment(
  text: string,
  ticker: string,
): "bullish" | "bearish" | "neutral" {
  const lowerText = text.toLowerCase();
  const tickerMentions =
    text.match(new RegExp(`\\$${ticker}|\\b${ticker}\\b`, "gi")) || [];

  if (tickerMentions.length === 0) return "neutral";

  const bullishWords = [
    "buy",
    "long",
    "bull",
    "bullish",
    "up",
    "rise",
    "moon",
    "pump",
    "strong",
    "support",
    "breakout",
    "rally",
    "surge",
    "gain",
    "positive",
    "optimistic",
    "confidence",
    "uptrend",
    "higher",
  ];

  const bearishWords = [
    "sell",
    "short",
    "bear",
    "bearish",
    "down",
    "fall",
    "dump",
    "weak",
    "resistance",
    "breakdown",
    "crash",
    "drop",
    "loss",
    "negative",
    "pessimistic",
    "doubt",
    "downtrend",
    "lower",
  ];

  let bullishScore = 0;
  let bearishScore = 0;

  bullishWords.forEach((word) => {
    if (lowerText.includes(word)) bullishScore++;
  });

  bearishWords.forEach((word) => {
    if (lowerText.includes(word)) bearishScore++;
  });

  if (bullishScore > bearishScore) return "bullish";
  if (bearishScore > bullishScore) return "bearish";
  return "neutral";
}

export function getTickerStats(ideas: Idea[]): Map<string, TickerInfo> {
  const tickerStats = new Map<string, TickerInfo>();

  ideas.forEach((idea) => {
    const processedIdea = processJournalEntry(idea);
    const content = [idea.title, idea.content || ""].join(" ");

    (processedIdea.tickers || []).forEach((ticker) => {
      const existing = tickerStats.get(ticker);
      const sentiment = analyzeTickerSentiment(content, ticker);
      const isCrypto = cryptoRegex.test(ticker);

      if (existing) {
        existing.frequency++;
      } else {
        tickerStats.set(ticker, {
          symbol: ticker,
          type: isCrypto ? "crypto" : "stock",
          frequency: 1,
          sentiment,
        });
      }
    });
  });

  return tickerStats;
}

export function getAssetClassColor(ticker: string): string {
  // Tech stocks
  if (
    ["AAPL", "GOOGL", "MSFT", "META", "AMZN", "TSLA", "NVDA", "AMD"].includes(
      ticker,
    )
  ) {
    return "#3b82f6"; // Blue
  }

  // Finance
  if (["JPM", "BAC", "WFC", "GS", "MS", "C"].includes(ticker)) {
    return "#10b981"; // Green
  }

  // Crypto
  if (cryptoRegex.test(ticker)) {
    return "#f59e0b"; // Amber
  }

  // Default
  return "#6b7280"; // Gray
}
