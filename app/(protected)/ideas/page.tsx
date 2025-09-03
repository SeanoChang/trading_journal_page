import fs from "fs";
import path from "path";
import IdeasHomeClient from "./Client";

export default async function TradingIdeasHome() {
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  let tradingPairs: string[] = [];
  try {
    tradingPairs = fs.readdirSync(postsDirectory);
  } catch (_) {
    tradingPairs = [];
  }
  return <IdeasHomeClient tradingPairs={tradingPairs} />;
}
