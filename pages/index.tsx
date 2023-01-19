import Head from "next/head";
import NavBar from "../components/home/Navbar";
import Footer from "../components/general/Footer";
import Button from "../components/general/Button";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Prices from "../components/home/Prices";
import News from "../components/home/News";
import fetch from "node-fetch";
import { GetStaticProps } from "next";
import ErrorPage from "next/error";
import Quote from "../components/general/Quote";
import Image from "next/image";
import TradingImage from "../public/blockchain_icon/blockchain_44.png";

export default function Home(props: {
  assets_info: Prices[];
  news_info: News[];
  rand_quote: number;
}) {
  if (!props.assets_info) {
    return <ErrorPage statusCode={404} />;
  }

  // nav links for the navbar
  const navLinks: string[] = ["Home", "Prices", "News", "Ideas"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
        <Head>
          <title>Seano&rsquo;s Trading Page</title>
          <meta
            name="description"
            content="Website for crypto news and prices"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <NavBar links={navLinks} />
        <main className="-translate-y-[64px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            id="home"
            className="flex flex-col justify-center items-center min-h-screen"
          >
            <div className="flex flex-row justify-content items-center">
              <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold h-1/3 z-10">
                Trading
              </h1>
              <div className="h-[40px] w-[40px] md:h-[70px] md:w-[70px] lg:h-36 lg:w-36 ml-2">
                <Image src={TradingImage} alt="trading" />
              </div>
            </div>
            <Quote rand={props.rand_quote} />
          </motion.div>
          <Prices assets={props.assets_info} />
          <News newsList={props.news_info} />
          <div
            className="flex flex-col justify-center items-center h-[50vh]"
            id="ideas"
          >
            <Button onclick={signIn} text={"Sign in to see more..."} />
          </div>
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}

// static props for the home page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // get the size of the media query to decide the size of the lists

  const defaultAssets = [
    "btc",
    "eth",
    "xrp",
    "ada",
    "doge",
    "ape",
    "dot",
    "atom",
    "sol",
    "aave",
    "bnb",
    "etc",
    "chz",
    "ens",
    "sushi",
    "near",
  ];
  const piecesOfNews = 2; // number of news from each source, a total of 8 sources
  try {
    let queryAssets = defaultAssets.join(",");
    const res1 = await fetch(
      `http://localhost:3000/api/prices?assets=${queryAssets}`
    );
    const assets_info = await res1.json();
    const res2 = await fetch(
      `http://localhost:3000/api/news?pieces=${piecesOfNews}`
    );
    const news_info = await res2.json();

    // size of the quote is 100
    return {
      props: {
        assets_info,
        news_info,
        rand_quote: Math.floor(Math.random() * 100),
      },
    };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};
