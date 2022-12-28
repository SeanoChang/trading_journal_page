import Head from "next/head";
import NavBar from "../components/home/Navbar";
import Router from "next/router"; // for redirecting to protected page
import Button from "../components/general/Button";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Prices from "../components/home/Prices";
import News from "../components/home/News";
import fetch from "node-fetch";
import { GetStaticProps } from "next";
import ErrorPage from "next/error";

export default function Home(props: {
  assets_info: Prices[];
  news_info: News[];
}) {
  if (!props.assets_info) {
    return <ErrorPage statusCode={404} />;
  }
  const { data: session, status } = useSession();

  // dark mode and handle dark mode
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // nav links for the navbar
  const navLinks: string[] = ["Home", "Prices", "News", "Ideas"];

  // if the user is logged in, redirect to the protected page
  if (status === "authenticated") {
    Router.push("/protected");
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Head>
        <title>Seano's Trading Page</title>
        <meta name="description" content="Website for crypto news and prices" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <NavBar dark={darkMode} setDark={handleDarkMode} links={navLinks} />
      <main className="flex flex-col justify-center items-center min-h-screen">
        <motion.div
          id="home"
          className="flex flex-col justify-center items-center min-h-screen"
        >
          <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold h-1/3 z-10 text-stone-100">
            {" "}
            Trading &#128200;{" "}
          </h1>
        </motion.div>
        <Prices assets={props.assets_info} />
        <News newsList={props.news_info} />
        <div className="flex flex-col justify-center items-center text-stone-500 h-screen">
          <Button onclick={signIn} text={"Sign in to see more..."} />
        </div>
      </main>
      <footer className="flex flex-col justify-center items-center">
        <span>&#169; SeanoChang</span>
      </footer>
    </div>
  );
}

// static props for the home page
export const getStaticProps: GetStaticProps = async () => {
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
