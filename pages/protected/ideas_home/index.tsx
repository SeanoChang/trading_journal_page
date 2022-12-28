import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../../../components/home/ideas_home/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../../components/home/ideas_home/Header";
import TradingPairs from "../../../components/home/ideas_home/TradingPairs";
import LearningResources from "../../../components/home/ideas_home/LearningResources";

/*
    Home page for trading ideas.
    List of all trading pairs that I have ideas for.
    Each trading pair will have a link to the page for all 
    the ideas for that trading pair.
*/
const TradingIdeasHome = (): JSX.Element => {
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

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
    console.log(session);
  }, [session]);

  return (
    <>
      <Head>
        <title>Seano's Trading Ideas</title>
        <meta name="description" content="Trading ideas for crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div>
        <NavBar dark={darkMode} setDark={handleDarkMode} />
        <main className="flex flex-col justify-center items-center text-stone-500 bg-stone-100 dark:text-stone-200 dark:bg-stone-800 min-h-screen">
          <Header />
          <TradingPairs />
          <LearningResources />
        </main>
        <footer className="flex flex-col justify-center items-center">
          <span>&#169; SeanoChang</span>
        </footer>
      </div>
    </>
  );
};

export default TradingIdeasHome;
