import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiOutlineNewspaper } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import NewsImage from "../../public/blockchain_icon/blockchain_46.png";
import MoreNewsImage from "../../public/blockchain_icon/blockchain_36.png";

type News = {
  title: string;
  link: string;
  source: string;
};

const NewsItem = (props: { news: News }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0.5]);
  const translateY = useTransform(scrollYProgress, [0.95, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0.95, 1], [1, 0.9]);

  return (
    <motion.div
      className="p-2 w-5/6 sm:w-[25em] mx-auto flex flex-col justify-center hover:bg-slate-200 dark:hover:bg-slate-500 rounded-md hover:shadow-md m-4 transition duration-150"
      ref={ref}
      style={{
        opacity,
        translateY,
        scale,
      }}
    >
      <span className="flex flex-row justify-start basis-1/4 m-1">
        <HiOutlineNewspaper className="text-2xl mx-2" />
        <div className="text-left">{props.news.source}</div>
      </span>
      <a href={props.news.link} className="basis-3/4 hover:underline mx-4 my-1">
        <h1 className="font-serif text-sm sm:text-base xl:text-xl">
          {props.news.title}
        </h1>
      </a>
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
    <div
      className="flex flex-col justify-center items-center w-full py-20"
      id="news"
    >
      <div className="flex flex-row items-center justify-center">
        <div className="h-[30px] w-[30px] md:h-[35px] md:w-[35px] xl:h-[40px] xl:w-[40px]">
          <Image src={NewsImage} alt="prices" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl p-8">Latest News</h1>
        <div className="h-[30px] w-[30px] md:h-[35px] md:w-[35px] xl:h-[40px] xl:w-[40px]">
          <Image src={NewsImage} alt="prices" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {newsComponents}
      </div>
      {props.newsList.length < 50 ? (
        <div className="h-20 text-base md:text-xl hover:text-[#f1f13c] flex flex-row justify-center items-center">
          <Link href="/news">Click me to see more!</Link>
          <div className="h-[25px] w-[25px] md:h-[30px] md:w-[30px] xl:h-[35px] xl:w-[35px] m-1">
            <Image src={MoreNewsImage} alt="more" />
          </div>
        </div>
      ) : (
        <div className="h-20 text-xl">
          No more, just google crypto news &#128528;
        </div>
      )}
    </div>
  );
};

export default News;
