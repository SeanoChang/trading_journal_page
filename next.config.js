/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    COIN_API_KEY: process.env.COIN_API_KEY,
    COINCAP_API_KEY: process.env.COINCAP_API_KEY,
    COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  }
}

module.exports = nextConfig
