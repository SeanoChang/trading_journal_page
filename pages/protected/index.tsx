import React from "react";
import NavBar from "../../components/home/Navbar";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Prices from "../../components/home/Prices";
import News from "../../components/home/News";
// import News from "../../components/home/News";
// import TradingIdeas from "../../components/home/TradingIdeas";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";

const ProtectedHome = (props: {
  darkMode: boolean;
  handleDarkMode: () => void;
  assets_info: Prices[];
  news_info: News[];
}): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });
  const [darkMode, setDarkMode] = useState(false);

  const navLinks = ["Home", "Prices", "News", "Trading Ideas"];

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <title>Seano's Trading Page</title>
        <meta
          name="description"
          content="Website for crypto news, price, and trading ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={darkMode ? "dark" : ""}>
        <NavBar dark={darkMode} setDark={handleDarkMode} links={navLinks} />
        <main className="flex flex-col justify-center items-center text-stone-700 bg-stone-100 dark:text-stone-200 dark:bg-stone-800 min-h-screen">
          <motion.div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-5 md:text-7xl lg:text-8xl font-bold">
              {session?.user?.name} &#128588;
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold">
              Welcome to...
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold">
              World of Trading
            </h2>
          </motion.div>
          <Prices assets={props.assets_info} />
          <News newsList={props.news_info} />
          <motion.div className="flex flex-col justify-center items-center h-[40vh]">
            <motion.button
              onClick={() => router.push("/protected/ideas_home")}
              className="text-5xl text-slate-600 m-20 bg-slate-200 p-8 rounded-full"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              See My Trading Ideas &#129488;
            </motion.button>
          </motion.div>
          <motion.div className="min-h-screen flex flex-col justify-center ">
            <button
              onClick={() =>
                signOut({
                  callbackUrl: `${window.location.origin}/`,
                })
              }
            >
              Sign out
            </button>
          </motion.div>
        </main>
        <footer className="flex flex-col justify-center items-center">
          <span>&#169; SeanoChang</span>
        </footer>
      </div>
    </>
  );
};

// server side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const defaultAssets = [
    "btc",
    "eth",
    "xrp",
    "ada",
    "doge",
    "ape",
    "dot",
    "apt",
    "atom",
    "sol",
    "aave",
    "avax",
    "bnb",
    "etc",
    "chz",
    "ens",
    "dydx",
    "eos",
    "shib",
    "lunc",
    "sushi",
    "near",
  ];
  try {
    let queryAssets = defaultAssets.join(",");
    const res = await fetch(
      `http://localhost:3000/api/prices?assets=${queryAssets}`
    );
    const assets_info = await res.json();
    const res2 = await fetch("http://localhost:3000/api/news");
    const news_info = await res2.json();
    return {
      props: {
        assets_info,
        news_info,
      },
    };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

export default ProtectedHome;
