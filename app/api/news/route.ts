import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import isValidUrl from "../../../helpers/validUrl";

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
          title: title!,
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
    console.log(ex);
  }
  if (newsLists.length > 0) return newsLists;
  return null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pieces = parseInt(searchParams.get("pieces") || "2", 10);
  const newsLists = await getNews(pieces);
  if (newsLists !== null) return NextResponse.json(newsLists);
  return NextResponse.json(
    { error: "Something went wrong while fetch news resources" },
    { status: 500 }
  );
}

