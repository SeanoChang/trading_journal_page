import { STOP_WORDS } from "../constants/textAnalysis";

export const extractKeywords = (
  text: string,
  maxKeywords: number = 10,
): string[] => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !STOP_WORDS.includes(word) && !/^\d+$/.test(word),
    );

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

export const analyzeSentiment = (
  text: string,
): "positive" | "negative" | "neutral" => {
  const positiveWords = [
    "gain",
    "profit",
    "bull",
    "rise",
    "up",
    "surge",
    "rally",
    "growth",
  ];
  const negativeWords = [
    "loss",
    "drop",
    "bear",
    "fall",
    "down",
    "crash",
    "decline",
    "dump",
  ];

  const lowercaseText = text.toLowerCase();
  const positiveCount = positiveWords.reduce(
    (count, word) => count + (lowercaseText.split(word).length - 1),
    0,
  );
  const negativeCount = negativeWords.reduce(
    (count, word) => count + (lowercaseText.split(word).length - 1),
    0,
  );

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};
