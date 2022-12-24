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

const ProtectedHome = (props: {
  darkMode: boolean;
  handleDarkMode: () => void;
  assets_info: Prices[];
  news_info: News[];
}): JSX.Element => {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const navLinks = ["Home", "Prices", "News", "Trading Ideas"];

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (status === "unauthenticated") {
    // if user is not logged in redirect to login page
    console.log(status);
    router.push("/");
  }

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
          <h1 className="text-5 md:text-7xl lg:text-8xl font-bold">
            {session?.user?.name} &#128588;
          </h1>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold">
            Welcome to...
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold">
            World of Trading
          </h2>
          <Prices assets={props.assets_info} />
          <News newsList={props.news_info} />
          <button
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}/`,
              })
            }
          >
            Sign out
          </button>
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
  console.log(req, res);
  try {
    const res = await fetch(
      "http://localhost:3000/api/prices?assets=btc,eth,xrp,ada,doge,ape,dot,apt"
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
