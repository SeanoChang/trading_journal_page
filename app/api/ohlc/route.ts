import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";
  const interval = searchParams.get("interval") || "1d";
  try {
    const { data } = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=200`
    );
    // data: [ openTime, open, high, low, close, volume, closeTime, ... ]
    const closes = (data as any[]).map((row) => Number(row[4])).filter((n) => Number.isFinite(n));
    return NextResponse.json({ closes });
  } catch (e) {
    return NextResponse.json({ closes: [] }, { status: 200 });
  }
}

