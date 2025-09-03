import crypto from "crypto";

export type Balance = {
  asset: string;
  free: number;
  locked: number;
};

export type ExchangeUserData = {
  exchange: string;
  balances?: Balance[];
  meta?: Record<string, unknown>;
  raw?: Record<string, unknown>;
};

export type ReadOptions = {
  // Optional: limit size of returned arrays
  maxBalances?: number;
};

function hmacSha256Hex(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

async function readBinance(apiKey: string, secretKey: string, opts: ReadOptions = {}): Promise<ExchangeUserData> {
  const baseUrl = process.env.BINANCE_API_BASE_URL || "https://api.binance.com";
  const timestamp = Date.now();
  const recvWindow = 5000;
  const qs = new URLSearchParams({ timestamp: String(timestamp), recvWindow: String(recvWindow) });
  const signature = hmacSha256Hex(secretKey, qs.toString());
  qs.set("signature", signature);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${baseUrl}/api/v3/account?${qs.toString()}`, {
    method: "GET",
    headers: { "X-MBX-APIKEY": apiKey, "Content-Type": "application/json" },
    signal: controller.signal,
    cache: "no-store",
  }).catch((e) => {
    clearTimeout(timeout);
    throw e;
  });
  clearTimeout(timeout);

  if (!res.ok) {
    let msg = `Binance read failed (${res.status})`;
    try {
      const b = await res.json();
      if (b?.msg) msg = b.msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  const balances: Balance[] = Array.isArray(data?.balances)
    ? data.balances
        .map((b: any) => ({ asset: b.asset, free: Number(b.free), locked: Number(b.locked) }))
        // keep non-zero balances first
        .sort((a: Balance, b: Balance) => (b.free + b.locked) - (a.free + a.locked))
        .slice(0, opts.maxBalances ?? 200)
    : [];

  return {
    exchange: "binance",
    balances,
    meta: {
      canTrade: data?.canTrade,
      updateTime: data?.updateTime,
      accountType: data?.accountType,
    },
    raw: {},
  };
}

export async function fetchExchangeUserData(
  exchange: string,
  apiKey: string,
  secretKey: string,
  opts: ReadOptions = {},
): Promise<ExchangeUserData> {
  switch (exchange.toLowerCase()) {
    case "binance":
      return readBinance(apiKey, secretKey, opts);
    default:
      throw new Error(`Reading user data not implemented for ${exchange}`);
  }
}

