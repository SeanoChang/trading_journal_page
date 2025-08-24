import Image from "next/image";
import { formatRelativeTime } from "../../utils/formatting";
import { domainFrom } from "../../utils/urlHelpers";
import type { News } from "../../types/news";

interface NewsItemProps {
  article: News;
}

export function NewsItem({ article }: NewsItemProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        {article.image && (
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="64px"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{article.source}</span>
            <span>•</span>
            <span>{domainFrom(article.link)}</span>
            {article.publishedAt && (
              <>
                <span>•</span>
                <span>{formatRelativeTime(article.publishedAt)}</span>
              </>
            )}
          </div>
          {article.author && (
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              by {article.author}
            </div>
          )}
        </div>
      </article>
    </a>
  );
}