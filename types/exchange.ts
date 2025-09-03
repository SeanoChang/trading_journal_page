export interface ExchangeApiKey {
  id: string;
  name: string;
  exchange: string;
  apiKey: string;
  secretKey: string;
  isActive: boolean;
}

export const exchanges = [
  { key: "binance", name: "Binance" },
  { key: "okx", name: "OKX" },
  { key: "bybit", name: "Bybit" },
  { key: "gateio", name: "Gate.io" },
  { key: "bingx", name: "BingX" },
];
