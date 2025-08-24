import type { CheerioAPI, Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import { absolutize, firstFromSrcset } from "../utils/urlHelpers";

// CoinDesk list item parser (div item with inner anchors and image)
export const parseCoinDeskItem = (
  $: CheerioAPI,
  item: Cheerio<AnyNode>,
  anchor: Cheerio<AnyNode>,
  baseLink: string
): { title?: string; image?: string; publishedAt?: number } => {
  // Title: attribute or text
  const titleAttr = anchor.attr('title');
  const titleText = titleAttr || anchor.text() || '';
  const title = titleText.replace(/\s+/g, ' ').trim();

  // Image: class-based selector
  const img = item.find('img.content-card-image--livewire').first();
  const direct = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || undefined;
  const fromSet = direct ? undefined : firstFromSrcset(img.attr('srcset') || img.attr('data-srcset'));
  const chosen = direct || fromSet;
  const image = chosen && !/^data:/i.test(chosen) && !/\.svg($|\?)/i.test(chosen) ? absolutize(chosen, baseLink) : undefined;

  // Time if present on card
  const timeStr = item.find('time[datetime]').attr('datetime') || undefined;
  const publishedAt = timeStr ? Date.parse(timeStr) : undefined;

  return { title, image, publishedAt };
};
