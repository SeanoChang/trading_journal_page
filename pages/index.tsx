import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "../components/home/Navbar";
import Router from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  // dark mode
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
      <>
        <div className="flex flex-col justify-center items-center text-stone-500 min-h-screen">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold">
              Sign in...
            </h1>
            <button onClick={() => signIn()}>Sign in</button>
          </div>
        </div>
      </>
    </div>
  );
}
