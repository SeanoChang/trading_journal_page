import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

async function getPrices(assets: string) {
  let response = null as any;
  try {
    response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${assets}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY as string,
        },
      },
    );
  } catch (ex) {
    response = null;
    console.log(ex);
  }
  if (response) {
    const json = Object.values(response.data.data as Record<string, any>);
    const prices = json.map((asset: any) => {
      return {
        name: asset.name,
        symbol: asset.symbol,
        price:
          asset.quote.USD.price < 100
            ? asset.quote.USD.price < 10
              ? asset.quote.USD.price < 1
                ? asset.quote.USD.price < 0.1
                  ? asset.quote.USD.price.toFixed(6)
                  : asset.quote.USD.price.toFixed(5)
                : asset.quote.USD.price.toFixed(4)
              : asset.quote.USD.price.toFixed(3)
            : asset.quote.USD.price.toFixed(2),
        percent_change_1h: asset.quote.USD.percent_change_1h.toFixed(2),
        percent_change_24h: asset.quote.USD.percent_change_24h.toFixed(2),
        percent_change_7d: asset.quote.USD.percent_change_7d.toFixed(2),
        market_cap: asset.quote.USD.market_cap.toFixed(2),
        volume_24h: asset.quote.USD.volume_24h.toFixed(2),
        time: asset.quote.USD.last_updated,
      };
    });
    return prices;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assets = searchParams.get("assets") || "btc,eth";
  const prices = await getPrices(assets);
  if (prices) return NextResponse.json(prices);
  return NextResponse.json({ error: "Error getting prices" }, { status: 500 });
}
