import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { load, type Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import isValidUrl from "../../../helpers/validUrl";
import { newsSources, type NewsSource } from "../../../data/newsSources";
import type { News } from "../../../types/news";
import { 
  fetchArticleDetails, 
  pickListingImage, 
  parseAnchorWithCoverAndContent 
} from "../../../scrapers/baseScraper";
import { parseCoinDeskItem } from "../../../scrapers/coinDeskScraper";

const getSpecificPath = async (
  source: NewsSource,
  path: string,
  pieces: number
) => {
  let url = `${source.url}${path}`;
  let newsLists: News[] = [];
  let piecesOfNews = source.name === "CryptoSlate" ? pieces * 2 : pieces;
  try {
    const response = await axios.get(url, { headers: { "Accept-Encoding": "gzip,deflate,compress" } });
    const $ = load(response.data);
    const items = $(source.selector).toArray().slice(0, piecesOfNews);
    for (const item of items) {
      const $item: Cheerio<AnyNode> = $(item);
      // Resolve anchor depending on selector type
      let $a: Cheerio<AnyNode>;
      if ($item.is("a")) {
        $a = $item;
      } else if (source.linkSelector) {
        $a = $item.find(source.linkSelector).first();
      } else {
        $a = $item.find('a[href]').first();
      }
      const rawHref = ($a && $a.attr('href')) || undefined;
      if (!rawHref) continue;
      const link = isValidUrl(rawHref) ? rawHref : `${source.url}${rawHref}`;
      // Prefer configured cover/content parsing when available
      let title: string | undefined;
      let image: string | undefined;
      let publishedAt: number | undefined;
      let author: string | undefined;
      if (source.coverSelector || source.contentSelector) {
        const res = parseAnchorWithCoverAndContent($, $a, link, source.coverSelector, source.contentSelector);
        title = res.title;
        image = res.image;
        publishedAt = res.publishedAt;
        author = res.author;
      } else if (source.name === 'CoinDesk') {
        const res = parseCoinDeskItem($, $item, $a, link);
        title = res.title;
        image = res.image;
        publishedAt = res.publishedAt;
      } else {
        // Generic: Title prefer anchor text, fallback to item text
        title = ($a.text() || $item.text() || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        image = pickListingImage($, item, link);
        const timeStrGeneric = $item.find('time[datetime]').attr('datetime') || undefined;
        publishedAt = timeStrGeneric ? Date.parse(timeStrGeneric) : undefined;
      }
      // Only use generic listing image when we don't have cover/content guidance
      if (!image && !(source.coverSelector || source.contentSelector)) {
        image = pickListingImage($, item, link);
      }
      // As a last resort, fetch article details
      if ((!image || !publishedAt) && link) {
        const details = await fetchArticleDetails(link);
        if (!image && details.image) image = details.image;
        if (!publishedAt && details.publishedAt) publishedAt = details.publishedAt;
      }

      if (!title) continue;
      newsLists.push({ title, link, source: source.name, image, publishedAt, author });
    }
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
        const lists = await Promise.all(
          source.paths.map((p) => getSpecificPath(source, p, pieces))
        );
        for (const l of lists) newsLists.push(...l);
      })
    );
  } catch (ex) {
    console.log(ex);
  }
  newsLists.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  return newsLists;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pieces = parseInt(searchParams.get("pieces") || "2", 10);
  const newsLists = await getNews(pieces);
  return NextResponse.json(newsLists);
}
