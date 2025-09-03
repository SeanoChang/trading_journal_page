import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */

const withMDX = createMDX({
  // Omit custom `extension` to avoid non-serializable RegExp; `mdx` is already in `pageExtensions` below.
  options: {
    // Use string specifiers so options are JSON-serializable.
    rehypePlugins: [["rehype-external-links", {}]],
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      ["@remark-embedder/core", { transformers: ["@remark-embedder/transformer-oembed"] }],
    ],
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
