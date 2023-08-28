import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import isValidUrl from "../../helpers/validUrl";
import * as cheerio from "cheerio";

type NewsSource = {
  name: string;
  url: string;
  paths: string[];
  remove: string[];
  selector: string;
};

type News = {
  title: string;
  link: string;
  source: string;
};

const newsSources: NewsSource[] = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com",
    paths: ["/tag/bitcoin/", "/tag/ethereum/", "/tag/altcoins/"],
    remove: [""],
    selector:
      "div.article-card > div > div.articleTextSection > h6 > a.card-title",
  },
  {
    name: "CyrptoSlate",
    url: "https://cryptoslate.com",
    paths: ["/top-news/"],
    remove: [""],
    selector: "div.posts > div > article > a",
  },
  {
    name: "NewsBTC",
    url: "https://www.newsbtc.com",
    paths: ["/news/"],
    remove: ["jeg_siderbar"],
    selector: "article.jeg_post :header > a",
  },
];

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
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

const getSpecificPath = async (
  source: NewsSource,
  path: string,
  pieces: number
) => {
  let url = `${source.url}${path}`;
  let newsLists: News[] = [];
  let piecesOfNews = source.name === "CryptoSlate" ? pieces * 2 : pieces;
  try {
    let response = await axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
    const $ = cheerio.load(response.data);
    if (source.remove.length > 0) {
      source.remove.forEach((remove) => {
        $(remove).remove();
      });
    }
    // add title and link to news list
    $(`${source.selector}`).each((i, el) => {
      if (i < piecesOfNews) {
        let title = $(el).attr("title");
        if (title === undefined) {
          title = $(el).text();
        }
        title = title!.replace(/^\s+|\s+$/g, "");
        let link = $(el).attr("href");
        if (!isValidUrl(link!)) {
          link = `${source.url}${link}`;
        }

        newsLists.push({
          title: title,
          link: link!,
          source: source.name,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return newsLists;
};

const getNews = async (pieces: number) => {
  let newsLists: News[] = [];
  try {
    await Promise.all(
      newsSources.map(async (source) => {
        for (const path of source.paths) {
          let news = await getSpecificPath(source, path, pieces);
          newsLists = [...newsLists, ...news];
        }
      })
    );
  } catch (ex) {
    // error
    console.log(ex);
  }
  if (newsLists.length > 0) {
    return newsLists;
  }
  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // get query params -> number of new to fetch
  let pieces: number = 2;
  if (req.query.pieces !== undefined) {
    pieces = parseInt(req.query.pieces as string);
  }

  // Rest of the API logic
  let newsLists: News[] | null = await getNews(pieces);

  if (newsLists !== null) {
    res.status(200).json(newsLists);
  } else {
    res
      .status(500)
      .json({ error: "Something went wrong while fetch news resources" });
  }
}
