import React from "react";

type News = {
  title: string;
  link: string;
  source: string;
  time: string;
};

const News = (props: { newsList: News[] }) => {
  const newsComponents = props.newsList.map((news: News) => {
    return (
      <div key={news.title} className="p-4 w-[30em]">
        <a href={news.link}>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">{news.title}</h1>
        </a>
        <span className="flex flex-row justify-around">
          <h2 className="text-lg sm:text-xl lg:text-2xl">{news.source}</h2>
          <h3 className="text-base sm:text-lg lg:text-xl">{news.time}</h3>
        </span>
      </div>
    );
  });

  if (props.newsList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl">News</h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">No news to show</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl">News</h1>
      <div className="flex flex-col justify-center items-center">
        {newsComponents}
      </div>
    </div>
  );
};

export default News;
