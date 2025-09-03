import axios from "axios";
import { load, type CheerioAPI, type Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import { absolutize, firstFromSrcset } from "../utils/urlHelpers";
import type { News } from "../types/news";

export const fetchArticleDetails = async (
  articleUrl: string,
): Promise<{ image?: string; publishedAt?: number }> => {
  try {
    const res = await axios.get(articleUrl, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
      timeout: 8000,
    });
    const $ = load(res.data);
    const og =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[property="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content");
    let image = og ? absolutize(og, articleUrl) : undefined;

    // common fallbacks
    const img = $("article img, figure img, img.nolazy, img[loading], img")
      .first()
      .attr("src");
    if (!image && img) image = absolutize(img, articleUrl);

    const timeStr =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="article:published_time"]').attr("content") ||
      $('meta[property="og:updated_time"]').attr("content") ||
      $('meta[name="date"]').attr("content") ||
      $("time[datetime]").attr("datetime") ||
      $('meta[itemprop="datePublished"]').attr("content") ||
      undefined;
    const publishedAt = timeStr ? Date.parse(timeStr) : undefined;

    return { image, publishedAt };
  } catch (e) {
    // ignore per-article failures
  }
  return {};
};

export const pickListingImage = (
  $: CheerioAPI,
  el: AnyNode,
  base: string,
): string | undefined => {
  const attrPick = (img: Cheerio<AnyNode>) => {
    const attrs = img.attr() || {};
    const src =
      attrs.src ||
      attrs["data-src"] ||
      attrs["data-original"] ||
      attrs["data-lazy-src"] ||
      firstFromSrcset(attrs.srcset || attrs["data-srcset"]) ||
      undefined;
    return src ? absolutize(src, base) : undefined;
  };

  const node = $(el);
  // Search upwards for a likely listing container and look for images inside
  const containers = [
    node.closest("article"),
    node.closest(".article-card"),
    node.closest(".jeg_post"),
    node.closest(".posts > div > article"),
    node.parent(),
    node.parent().parent(),
  ].filter((c) => c && c.length);

  for (const c of containers) {
    // Try picture > source/srcset first
    const pictureImg = c.find("picture source").first();
    if (pictureImg.length) {
      const srcset = pictureImg.attr("srcset");
      const fromSet = firstFromSrcset(srcset || pictureImg.attr("data-srcset"));
      const abs = absolutize(fromSet, base);
      if (abs) return abs;
    }
    // Then any <img>
    const imgEl = c.find("img").first();
    if (imgEl.length) {
      const picked = attrPick(imgEl);
      if (picked) return picked;
    }
  }
  // Try siblings before the link
  const prevImg = node.prevAll("img").first();
  if (prevImg.length) {
    const picked = attrPick(prevImg);
    if (picked) return picked;
  }
  return undefined;
};

// Generic anchor parser using provided cover/content selectors inside the anchor
export const parseAnchorWithCoverAndContent = (
  $: CheerioAPI,
  anchor: Cheerio<AnyNode>,
  baseLink: string,
  coverSelector?: string,
  contentSelector?: string,
): {
  title?: string;
  image?: string;
  publishedAt?: number;
  author?: string;
} => {
  let image: string | undefined;
  if (coverSelector) {
    const cover = anchor.find(coverSelector).first();
    // Prefer direct <img>, else <picture> <source srcset>
    const imgEl = cover.find("img").first();
    const direct =
      imgEl.attr("src") ||
      imgEl.attr("data-src") ||
      imgEl.attr("data-lazy-src") ||
      undefined;
    const fromSet = direct
      ? undefined
      : firstFromSrcset(imgEl.attr("srcset") || imgEl.attr("data-srcset"));
    const chosen = direct || fromSet;
    // Filter out svgs and data URIs
    if (chosen && !/^data:/i.test(chosen) && !/\.svg($|\?)/i.test(chosen)) {
      image = absolutize(chosen, baseLink);
    }
  }

  let title: string | undefined;
  let publishedAt: number | undefined;
  let author: string | undefined;
  if (contentSelector) {
    const content = anchor.find(contentSelector).first();
    const titleText =
      content.find("h2, h3, .title").first().text() ||
      content.text() ||
      anchor.text() ||
      "";
    title = titleText.replace(/\s+/g, " ").trim();
    const timeStr =
      content.find("time[datetime]").attr("datetime") || undefined;
    publishedAt = timeStr ? Date.parse(timeStr) : undefined;
    const authorText =
      content
        .find('a[rel="author"], .author, .byline, [itemprop="author"]')
        .first()
        .text() || undefined;
    author = authorText ? authorText.replace(/\s+/g, " ").trim() : undefined;
  } else {
    title = (anchor.text() || "").replace(/\s+/g, " ").trim();
  }

  return { title, image, publishedAt, author };
};
