import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import isValidUrl from "../../helpers/validUrl";
import * as cheerio from "cheerio";

type Selector = {
  baseSelector: string;
  titleSelector: string;
  timeSelector: string;
};

type NewsSource = {
  name: string;
  url: string;
  paths: string[];
  remove: string[];
  selector: Selector;
  listSize: number;
};

type News = {
  title: string;
  link: string;
  source: string;
  time: string;
};

const newsSources: NewsSource[] = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com",
    paths: ["/tag/bitcoin/", "/tag/ethereum/", "/tag/altcoins/"],
    remove: [""],
    selector: {
      baseSelector: "div.article-card > div > div.articleTextSection",
      titleSelector: "h6 > a.card-title",
      timeSelector:
        "div.articleMetaSection > div.timing-data > div > div:nth-child(2)",
    },
    listSize: 5,
  },
  {
    name: "CyrptoSlate",
    url: "https://cryptoslate.com",
    paths: ["/top-news/"],
    remove: [""],
    selector: {
      baseSelector: "div.posts > div > article",
      titleSelector: "a",
      timeSelector:
        "a > div.content > div > div > div.bottom > span:nth-child(1)",
    },
    listSize: 10,
  },
  {
    name: "Cryptopolitan",
    url: "https://cryptopolitan.com",
    paths: ["/news/", "/news/page/2/"],
    remove: [""],
    selector: {
      baseSelector: "div > article > div",
      titleSelector: "div > h3 > a",
      timeSelector: "div > span:nth-child(2)",
    },
    listSize: 5,
  },
  {
    name: "NewsBTC",
    url: "https://www.newsbtc.com",
    paths: ["/news/"],
    remove: ["jeg_siderbar"],
    selector: {
      baseSelector: "article.jeg_post",
      titleSelector: ":header > a",
      timeSelector: "div.jeg_meta_date > a",
    },
    listSize: 10,
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

const getSpecificPath = async (source: NewsSource, path: string) => {
  let url = `${source.url}${path}`;
  let newsLists: News[] = [];
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
    $(`${source.selector.baseSelector}`).each((i, el) => {
      if (i < source.listSize) {
        let title = $(el)
          .find(`${source.selector.titleSelector}`)
          .attr("title");
        if (title === undefined) {
          title = $(el).find(`${source.selector.titleSelector}`).text();
        }
        title = title!.replace(/^\s+|\s+$/g, "");
        let link = $(el).find(`${source.selector.titleSelector}`).attr("href");
        if (!isValidUrl(link!)) {
          link = `${source.url}${link}`;
        }
        let time = $(el).find(`${source.selector.timeSelector}`).text();
        time = time.replace(/^\s+|\s+$/g, "");

        newsLists.push({
          title: title,
          link: link!,
          source: source.name,
          time: time,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return newsLists;
};

const getNews = async () => {
  let newsLists: News[] = [];
  try {
    await Promise.all(
      newsSources.map(async (source) => {
        for (const path of source.paths) {
          let news = await getSpecificPath(source, path);
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

  // Rest of the API logic
  let newsLists: News[] | null = await getNews();

  if (newsLists !== null) {
    res.status(200).json(newsLists);
  } else {
    res
      .status(500)
      .json({ error: "Something went wrong while fetch news resources" });
  }
}
