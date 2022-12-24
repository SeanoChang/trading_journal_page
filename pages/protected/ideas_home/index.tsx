import React, { useState } from "react";
import Head from "next/head";
import NavBar from "../../../components/home/ideas_home/Navbar";
import { useSession } from "next-auth/react";
import Router from "next/router";

/*
    Home page for trading ideas.
    List of all trading pairs that I have ideas for.
    Each trading pair will have a link to the page for all 
    the ideas for that trading pair.
*/
const TradingIdeasHome = (): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!session) {
    // if user is not logged in redirect to login page
    Router.push("/");
  }

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
          <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold">
            Trading Ideas
          </h1>
        </main>
        <footer className="flex flex-col justify-center items-center">
          <span>Copyright SeanoChang</span>
        </footer>
      </div>
    </>
  );
};

export default TradingIdeasHome;
