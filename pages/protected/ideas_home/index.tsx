import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../../../components/home/protected/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../../components/home/protected/Header";
import TradingPairs from "../../../components/home/protected/TradingPairs";
import LearningResources from "../../../components/home/protected/LearningResources";
import Rules from "../../../components/home/protected/Rules";
import Footer from "../../../components/general/Footer";
import { GetStaticProps } from "next";
import fs from "fs";
import path from "path";

/*
    Home page for trading ideas.
    List of all trading pairs that I have ideas for.
    Each trading pair will have a link to the page for all 
    the ideas for that trading pair.
*/
const TradingIdeasHome = (props: { tradingPairs: string[] }): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
      <Head>
        <title>Seano&rsquo;s Trading Ideas</title>
        <meta name="description" content="Trading ideas for crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="Q2eq-3vOWJK4BGDPiQWbFgFna4xbWmXlKZnGuPTBCbo"
        />
      </Head>
      <div>
        <NavBar />
        <main className="flex flex-col justify-center items-center min-h-screen">
          <Header />
          <Rules />
          <TradingPairs tradingPairs={props.tradingPairs} />
          <LearningResources />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // get all the trading pairs from the local file system and pass them to the component
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  const tradingPairs = fs.readdirSync(postsDirectory);

  return {
    props: {
      tradingPairs,
    },
  };
};

export default TradingIdeasHome;
