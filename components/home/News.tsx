"use client";
import React from "react";
import { HiOutlineNewspaper } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { Chip } from "@heroui/react";

type News = {
  title: string;
  link: string;
  source: string;
  image?: string;
  publishedAt?: number;
  author?: string;
};

const domainFrom = (url: string) => {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const formatRelative = (ts?: number) => {
  if (!ts) return undefined;
  const now = Date.now();
  const diff = Math.max(0, now - ts);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const d = new Date(ts);
  return d.toLocaleDateString();
};

const NewsItem = ({ news }: { news: News }) => {
  const domain = domainFrom(news.link);
  const img = news.image;
  const rel = formatRelative(news.publishedAt);
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-white/40 dark:bg-slate-900/30">
        {img ? (
          <Image
            src={img}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="pointer-events-none absolute left-3 right-3 bottom-3 flex items-center gap-2 text-[11px] text-white/80">
          <HiOutlineNewspaper />
          <span className="px-1.5 py-0.5 rounded bg-white/20 backdrop-blur">
            {news.source}
          </span>
          {news.author && <span className="truncate">• {news.author}</span>}
          {rel && <span className="ml-auto">{rel}</span>}
        </div>
      </div>
      <h3 className="mt-2 font-semibold text-base sm:text-lg leading-snug line-clamp-2">
        {news.title}
      </h3>
      <div className="mt-1 text-[12px] text-default-500">
        <span>{domain}</span>
      </div>
    </a>
  );
};

const News = (props: { newsList: News[]; showMoreLink?: boolean }) => {
  const newsComponents = props.newsList.map((news: News, idx: number) => (
    <NewsItem news={news} key={idx} />
  ));

  if (props.newsList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl">News</h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">No news to show</h2>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center w-full py-16"
      id="news"
    >
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {newsComponents}
      </div>
      {props.showMoreLink !== false && props.newsList.length < 50 ? (
        <div className="h-20 text-base md:text-xl hover:text-[#f1f13c] flex flex-row justify-center items-center">
          <Link href="/news">Click me to see more!</Link>
          <span className="ml-2">➜</span>
        </div>
      ) : (
        props.showMoreLink !== false && (
          <div className="h-20 text-xl">
            No more, just google crypto news &#128528;
          </div>
        )
      )}
    </div>
  );
};

export default News;
