import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type News = {
  title: string;
  link: string;
  source: string;
  time: string;
};

const NewsItem = (props: { news: News }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [2, 0.3]);
  const translateY = useTransform(scrollYProgress, [0.8, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0.8, 1], [1, 0.8]);

  return (
    <motion.div
      className="p-4 w-[25em] flex flex-col justify-center bg-slate-300 rounded-md drop-shadow-md m-4 text-slate-700"
      ref={ref}
      style={{
        opacity,
        translateY,
        scale,
      }}
    >
      <a href={props.news.link} className="basis-3/4">
        <h1 className="text-sm sm:text-base xl:text-xl">{props.news.title}</h1>
      </a>
      <span className="flex flex-row justify-center basis-1/4 pt-1 md:pt-2">
        <div className="basis-1/2 text-left">{props.news.source}</div>
        <div className="basis-1/2 text-right">{props.news.time}</div>
      </span>
    </motion.div>
  );
};

const News = (props: { newsList: News[] }) => {
  const newsComponents = props.newsList.map((news: News, idx: number) => {
    return <NewsItem news={news} key={idx} />;
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
      <div className="text-3xl sm:text-4xl xl:text-6xl py-2 sm:py-4 lg:py-6">
        News
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {newsComponents}
      </div>
    </div>
  );
};

export default News;
