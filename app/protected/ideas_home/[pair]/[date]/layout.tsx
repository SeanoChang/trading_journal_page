import fs from "fs";
import path from "path";
import type { ReactNode } from "react";

export async function generateStaticParams() {
  const base = path.join(process.cwd(), "data", "journals_mdx");
  let params: { pair: string; date: string }[] = [];
  try {
    const pairs = fs.readdirSync(base);
    for (const pair of pairs) {
      const posts = fs.readdirSync(path.join(base, pair));
      for (const post of posts) {
        const date = post.replace(/\.mdx$/, "");
        params.push({ pair, date });
      }
    }
  } catch {}
  return params;
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

