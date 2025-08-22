"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RxExit } from "react-icons/rx";
import News from "../../components/home/News";
import Loading from "../../components/general/Loading";

const newsPieces = 10;

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    setNewsLoading(true);
    fetch(`/api/news?pieces=${newsPieces}`)
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
        setNewsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="h-[5em] flex flex-row justify-start items-center w-full">
        <Link href="/">
          <RxExit className="hover:cursor-pointer mx-8 text-xl" />
        </Link>
      </div>
      {newsLoading ? <Loading /> : <News newsList={news} />}
    </div>
  );
}
