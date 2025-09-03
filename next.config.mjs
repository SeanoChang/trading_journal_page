import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";
const remarkEmbedder = fauxRemarkEmbedder.default;
const oembedTransformer = fauxOembedTransformer.default;

import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    rehypePlugins: [rehypeExternalLinks],
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkEmbedder, { transformers: [oembedTransformer] }],
    ],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
});
const nextConfig = {
  reactStrictMode: true,
  env: {
    COIN_API_KEY: process.env.COIN_API_KEY,
    COINCAP_API_KEY: process.env.COINCAP_API_KEY,
    COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx", "md"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptoslate.com",
      },
      {
        protocol: "https",
        hostname: "*.cryptoslate.com",
      },
      {
        protocol: "https",
        hostname: "www.coindesk.com",
      },
      {
        protocol: "https",
        hostname: "coindesk.com",
      },
      {
        protocol: "https",
        hostname: "*.coindesk.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cointelegraph.com",
      },
      {
        protocol: "https",
        hostname: "*.cointelegraph.com",
      },
      {
        protocol: "https",
        hostname: "decrypt.co",
      },
      {
        protocol: "https",
        hostname: "*.decrypt.co",
      },
    ],
  },
};

export default withMDX(nextConfig);
