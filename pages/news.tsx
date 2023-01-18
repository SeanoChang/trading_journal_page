import News from "../components/home/News";
import fetch from "node-fetch";
import { GetStaticProps } from "next";
import { RxExit } from "react-icons/rx";
import { signOut } from "next-auth/react";

const NewsPage = (props: { news_info: News[] }): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="h-[5em] flex flex-row justify-start items-center w-full">
        <a href="/">
          <RxExit className="hover:cursor-pointer mx-8 text-xl" />
        </a>
      </div>
      <News newsList={props.news_info} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // query the news from the internal api
  const piecesOfNews = 10;
  try {
    const res = await fetch(
      `http://localhost:3000/api/news?pieces=${piecesOfNews}`
    );
    const news_info = await res.json();
    return {
      props: {
        news_info,
      },
    };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

export default NewsPage;
