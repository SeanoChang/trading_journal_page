"use client";
import NavBar from "../components/home/Navbar";
import Footer from "../components/general/Footer";
import Button from "../components/general/Button";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Prices from "../components/home/Prices";
import News from "../components/home/News";
import Loading from "../components/general/Loading";
import Quote from "../components/general/Quote";
import Image from "next/image";
import TradingImage from "../public/blockchain_icon/blockchain_44.png";
import React, { useState, useEffect } from "react";

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

export default function HomeClient({ randQuote }: { randQuote: number }) {
  const [prices, setPrices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [priceLoading, setPriceLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const width = window.innerWidth;
    let assets = defaultAssets;
    let newsPieces = 3;
    if (width < 768) {
      assets = defaultAssets.slice(0, 8);
      newsPieces = 1;
    } else if (width < 1024) {
      assets = defaultAssets.slice(0, 15);
      newsPieces = 2;
    }
    const queryAssets = assets.join(",");

    setPriceLoading(true);
    fetch(`/api/prices?assets=${queryAssets}`)
      .then((response) => response.json())
      .then((data) => {
        setPrices(data);
        setPriceLoading(false);
      });

    setNewsLoading(true);
    fetch(`/api/news?pieces=${newsPieces}`)
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
        setNewsLoading(false);
      });
  }, []);

  const navLinks: string[] = ["Home", "Prices", "News", "Ideas"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
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
              <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold h-1/3 z-10">Trading</h1>
              <div className="h-[40px] w-[40px] md:h-[70px] md:w-[70px] lg:h-36 lg:w-36 ml-2">
                <Image src={TradingImage} alt="trading" />
              </div>
            </div>
            <Quote rand={randQuote} />
          </motion.div>
          {priceLoading ? <Loading /> : <Prices assets={prices} />}
          {newsLoading ? <Loading /> : <News newsList={news} />}
          <div className="flex flex-col justify-center items-center h-[50vh]" id="ideas">
            <Button onclick={signIn} text={"Sign in to see more..."} />
          </div>
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}

