import News from "../components/home/News";
import fetch from "node-fetch";
import { RxExit } from "react-icons/rx";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loading from "../components/general/Loading";

const newsPieces = 10;

const NewsPage = (): JSX.Element => {
  // get data from the api
  const [news, setNews] = useState<News[]>([]);
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
};

export default NewsPage;
