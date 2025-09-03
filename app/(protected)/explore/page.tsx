import fs from "fs";
import path from "path";
import ExploreClient from "./Client";

export default async function ExplorePage() {
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  let tradingPairs: string[] = [];
  try {
    tradingPairs = fs.readdirSync(postsDirectory);
  } catch (_) {
    tradingPairs = [];
  }
  return <ExploreClient tradingPairs={tradingPairs} />;
}
