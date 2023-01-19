import React from "react";
import NavBar from "../../components/home/protected/Navbar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Prices from "../../components/home/Prices";
import News from "../../components/home/News";
import Quote from "../../components/general/Quote";
import Footer from "../../components/general/Footer";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

const ProtectedHome = (props: {
  darkMode: boolean;
  handleDarkMode: () => void;
  assets_info: Prices[];
  news_info: News[];
  user_name: string;
}): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  const user = session?.user?.name;

  const navLinks = ["Home", "Prices", "News", "Trading Ideas"];

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
      <Head>
        <title>Seano&rsquo;s Trading Page</title>
        <meta
          name="description"
          content="Website for crypto news, price, and trading ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
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
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                    {user} &#128588;
                  </h1>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                    Welcome to...
                  </h1>
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
                      options={{
                        loop: true,
                        delay: 75,
                        autoStart: true,
                      }}
                    />
                  </div>
                </motion.div>
                <Quote rand={2} />
              </>
            )}
          </div>
          <Prices assets={props.assets_info} />
          <News newsList={props.news_info} />
          <motion.div className="flex flex-col justify-center items-center h-[40vh]">
            <motion.button
              onClick={() => router.push("/protected/ideas_home")}
              className="text-md sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-slate-600 m-20 bg-slate-200 p-8 rounded-full"
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
};

// server side rendering
export const getStaticProps: GetStaticProps = async () => {
  const defaultAssets = [
    "btc",
    "eth",
    "xrp",
    "doge",
    "ape",
    "dot",
    "apt",
    "atom",
    "sol",
    "aave",
    "bnb",
    "etc",
    "ens",
    "dydx",
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
