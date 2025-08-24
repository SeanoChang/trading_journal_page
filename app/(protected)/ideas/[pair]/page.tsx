import fs from "fs";
import path from "path";
import PairHomeClient from "./Client";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  try {
    const filenames = fs.readdirSync(postsDirectory);
    return filenames.map((pair) => ({ pair }));
  } catch {
    return [] as { pair: string }[];
  }
}

export default async function PairHome({ params }: { params: Promise<{ pair: string }> }) {
  const resolvedParams = await params;
  const pairDirectory = path.join(process.cwd(), "data", "journals_mdx", resolvedParams.pair);
  let posts: string[] = [];
  try {
    posts = fs.readdirSync(pairDirectory);
  } catch {}
  return <PairHomeClient pair={resolvedParams.pair} posts={posts} />;
}

