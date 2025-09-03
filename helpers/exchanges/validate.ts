import crypto from "crypto";

export type ExchangeValidationResult = {
  ok: boolean;
  error?: string;
  details?: Record<string, unknown>;
};

function hmacSha256Hex(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function hmacSha256Base64(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
}

function hmacSha512Hex(secret: string, data: string) {
  return crypto.createHmac("sha512", secret).update(data).digest("hex");
}

async function validateBinanceApiKey(apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  const baseUrl = process.env.BINANCE_API_BASE_URL || "https://api.binance.com";
  const timestamp = Date.now();
  const recvWindow = 5000;
  const qs = new URLSearchParams({ timestamp: String(timestamp), recvWindow: String(recvWindow) });
  const signature = hmacSha256Hex(secretKey, qs.toString());
  qs.set("signature", signature);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${baseUrl}/api/v3/account?${qs.toString()}`, {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, details: { accountType: (data as any)?.accountType, canTrade: (data as any)?.canTrade } };
    }

    let msg = "Binance API validation failed";
    try {
      const body = await res.json();
      if (body?.msg) msg = body.msg;
      // Common codes: -2015 invalid API-key/IP/permissions; -2014 API-key format invalid; -1022 signature invalid
      const code = body?.code;
      if (code === -2015) msg = "Invalid API key or permissions";
      else if (code === -2014) msg = "API key format invalid";
      else if (code === -1022) msg = "Signature invalid (check secret)";
    } catch {}
    return { ok: false, error: msg };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === "AbortError") {
      return { ok: false, error: "Validation timed out contacting Binance" };
    }
    return { ok: false, error: "Network error validating with Binance" };
  }
}

async function validateBingxApiKey(apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  // Validation modes: off | soft | strict (default: soft)
  const mode = (process.env.BINGX_VALIDATION_MODE || "soft").toLowerCase();
  if (mode === "off") return { ok: true, details: { note: "BingX validation disabled" } };

  const baseUrl = process.env.BINGX_API_BASE_URL || "https://open-api.bingx.com";
  // Commonly used authenticated endpoint to verify credentials. Adjust via env if needed.
  const path = process.env.BINGX_VALIDATION_PATH || "/openApi/spot/v1/account";

  const timestamp = Date.now();
  const recvWindow = 5000;
  const qs = new URLSearchParams({ timestamp: String(timestamp), recvWindow: String(recvWindow) });
  const signature = hmacSha256Hex(secretKey, qs.toString());
  qs.set("signature", signature);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${baseUrl}${path}?${qs.toString()}`, {
      method: "GET",
      headers: {
        [process.env.BINGX_API_KEY_HEADER || "X-BingX-ApiKey"]: apiKey,
        "Content-Type": "application/json",
      } as Record<string, string>,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, details: { canTrade: (data as any)?.canTrade, account: (data as any)?.accountType } };
    }

    let msg = "BingX API validation failed";
    try {
      const body = await res.json();
      if (body?.msg) msg = body.msg;
      const code = body?.code ?? body?.retCode;
      if (code === 100005) msg = "Signature invalid (check secret)";
      else if (code === 100007) msg = "Invalid API key or permissions";
    } catch {}

    // soft mode: don't block saving on ambiguous failures
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  } catch (err: any) {
    clearTimeout(timeout);
    const msg = err?.name === "AbortError" ? "Validation timed out contacting BingX" : "Network error validating with BingX";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  }
}

export async function validateExchangeCredentials(exchange: string, apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  switch (exchange.toLowerCase()) {
    case "binance":
      return validateBinanceApiKey(apiKey, secretKey);
    case "bingx":
      return validateBingxApiKey(apiKey, secretKey);
    case "bybit":
      return validateBybitApiKey(apiKey, secretKey);
    case "okx":
      return validateOkxApiKey(apiKey, secretKey);
    case "gateio":
    case "gate.io":
      return validateGateioApiKey(apiKey, secretKey);
    default:
      // For exchanges without validators yet, allow storing credentials without live validation.
      return { ok: true, details: { note: `Validation not yet implemented for ${exchange}` } };
  }
}

async function validateBybitApiKey(apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  const mode = (process.env.BYBIT_VALIDATION_MODE || "soft").toLowerCase();
  if (mode === "off") return { ok: true, details: { note: "Bybit validation disabled" } };

  const baseUrl = process.env.BYBIT_API_BASE_URL || "https://api.bybit.com";
  const path = process.env.BYBIT_VALIDATION_PATH || "/v5/account/wallet-balance";
  const query = new URLSearchParams({ accountType: process.env.BYBIT_ACCOUNT_TYPE || "UNIFIED" });
  const timestamp = Date.now().toString();
  const recvWindow = process.env.BYBIT_RECV_WINDOW || "5000";
  const preSign = timestamp + apiKey + recvWindow + query.toString();
  const signature = hmacSha256Hex(secretKey, preSign);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${baseUrl}${path}?${query.toString()}`, {
      method: "GET",
      headers: {
        "X-BAPI-API-KEY": apiKey,
        "X-BAPI-SIGN": signature,
        "X-BAPI-TIMESTAMP": timestamp,
        "X-BAPI-RECV-WINDOW": recvWindow,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const body = await res.json().catch(() => ({}));
    const retCode = (body as any)?.retCode ?? (body as any)?.code ?? (res.ok ? 0 : -1);
    if (res.ok && retCode === 0) {
      return { ok: true, details: { accountType: (body as any)?.result?.accountType } };
    }

    let msg = (body as any)?.retMsg || (body as any)?.msg || "Bybit API validation failed";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  } catch (err: any) {
    clearTimeout(timeout);
    const msg = err?.name === "AbortError" ? "Validation timed out contacting Bybit" : "Network error validating with Bybit";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  }
}

async function validateOkxApiKey(apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  const mode = (process.env.OKX_VALIDATION_MODE || "soft").toLowerCase();
  if (mode === "off") return { ok: true, details: { note: "OKX validation disabled" } };

  const baseUrl = process.env.OKX_API_BASE_URL || "https://www.okx.com";
  const path = process.env.OKX_VALIDATION_PATH || "/api/v5/account/balance";
  const qs = new URLSearchParams({ ccy: process.env.OKX_VALIDATION_CCY || "USDT" });
  const timestamp = new Date().toISOString();
  const method = "GET";
  const requestPath = `${path}?${qs.toString()}`;
  const passphrase = process.env.OKX_PASSPHRASE;

  if (!passphrase) {
    // Cannot perform real validation without passphrase; degrade based on mode
    const msg = "OKX passphrase not configured; skipping live validation";
    if (mode === "strict") return { ok: false, error: msg };
    return { ok: true, details: { warning: msg } };
  }

  const prehash = `${timestamp}${method}${requestPath}`; // no body for GET
  const signature = hmacSha256Base64(secretKey, prehash);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${baseUrl}${requestPath}`, {
      method,
      headers: {
        "OK-ACCESS-KEY": apiKey,
        "OK-ACCESS-SIGN": signature,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": passphrase,
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const body = await res.json().catch(() => ({}));
    const code = (body as any)?.code;
    if (res.ok && (code === "0" || code === 0 || code === undefined)) {
      return { ok: true, details: { ccy: (body as any)?.data?.[0]?.ccy } };
    }
    let msg = (body as any)?.msg || "OKX API validation failed";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  } catch (err: any) {
    clearTimeout(timeout);
    const msg = err?.name === "AbortError" ? "Validation timed out contacting OKX" : "Network error validating with OKX";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  }
}

async function validateGateioApiKey(apiKey: string, secretKey: string): Promise<ExchangeValidationResult> {
  const mode = (process.env.GATEIO_VALIDATION_MODE || "soft").toLowerCase();
  if (mode === "off") return { ok: true, details: { note: "Gate.io validation disabled" } };

  const baseUrl = process.env.GATEIO_API_BASE_URL || "https://api.gateio.ws";
  const path = process.env.GATEIO_VALIDATION_PATH || "/api/v4/spot/accounts";
  const method = "GET";
  const query = "";
  const body = "";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Signature format may vary by product; this follows v4 spec examples
  const stringToSign = `${timestamp}\n${method}\n${path}\n${query}\n${body}`;
  const sign = hmacSha512Hex(secretKey, stringToSign);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        KEY: apiKey,
        SIGN: sign,
        Timestamp: timestamp,
      } as Record<string, string>,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, details: { length: Array.isArray(data) ? data.length : undefined } };
    }

    let msg = "Gate.io API validation failed";
    try {
      const bodyJson = await res.json();
      if (bodyJson?.message) msg = bodyJson.message;
    } catch {}
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  } catch (err: any) {
    clearTimeout(timeout);
    const msg = err?.name === "AbortError" ? "Validation timed out contacting Gate.io" : "Network error validating with Gate.io";
    if (mode === "soft") return { ok: true, details: { warning: msg } };
    return { ok: false, error: msg };
  }
}
