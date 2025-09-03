export interface Price {
  name: string;
  symbol: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  time_stamp: string;
}

export interface MarketData {
  prices: Price[];
  loading: boolean;
  error?: string;
}

export interface RSIData {
  rsi: number;
  timestamp: number;
}

export interface GreedFearIndex {
  value: number;
  classification: string;
  timestamp: number;
}
