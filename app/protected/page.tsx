"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/home/protected/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Prices from "../../components/home/Prices";
import News from "../../components/home/News";
import Quote from "../../components/general/Quote";
import Footer from "../../components/general/Footer";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import Loading from "../../components/general/Loading";

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

export default function ProtectedHome() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const user = session?.user?.name;

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

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
      <div>
        <NavBar />
        <main className="flex flex-col justify-center items-center -translate-y-[64px]">
          <div className="min-h-screen flex flex-col justify-center items-center">
            {user && (
              <>
                <motion.div
                  className="flex flex-col justify-center items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">{user} &#128588;</h1>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">Welcome to...</h1>
                  <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
                    <Typewriter
                      onInit={(typewriter) => {
                        typewriter
                          .typeString("Seano's Trading Page")
                          .pauseFor(2500)
                          .deleteAll()
                          .typeString("World of Trading!")
                          .pauseFor(2500)
                          .deleteChars(8)
                          .typeString("Crypto!")
                          .pauseFor(2500)
                          .start();
                      }}
                      options={{ loop: true, delay: 75, autoStart: true }}
                    />
                  </div>
                </motion.div>
                <Quote rand={2} />
              </>
            )}
          </div>
          {priceLoading ? <Loading /> : <Prices assets={prices} />}
          {newsLoading ? <Loading /> : <News newsList={news} />}
          <motion.div className="flex flex-col justify-center items-center h-[40vh]">
            <motion.button
              onClick={() => router.push("/protected/ideas_home")}
              className="text-sm sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-slate-600 m-20 bg-slate-200 p-8 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              See My Trading Ideas &#129488;
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
