import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export async function getPrices(assets: string) {
  // Rest of the API logic
  let response = null;
  let prices = null;
  try {
    response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${assets}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );
  } catch (ex) {
    response = null;
    // error
    console.log(ex);
  }
  if (response) {
    // success
    const json = Object.values(response.data.data);
    prices = json.map((asset: any) => {
      return {
        name: asset.name,
        symbol: asset.symbol,
        price:
          asset.quote.USD.price > 1
            ? asset.quote.USD.price.toFixed(2)
            : asset.quote.USD.price.toFixed(6),
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // handle the assets query from the client
  let assets: string = "btc,eth";
  if (typeof req.query.assets === "string") {
    assets = req.query.assets;
  }
  // Run the middleware
  await runMiddleware(req, res, cors);

  const prices = await getPrices(assets);
  if (prices) {
    res.status(200).json(prices);
  } else {
    res.status(500).json({ error: "Error getting prices" });
  }
}
