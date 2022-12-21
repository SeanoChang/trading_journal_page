import React from "react";
import NavBar from "../../components/home/Navbar";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { useState } from "react";

const ProtectedHome = (props: {
  darkMode: boolean;
  handleDarkMode: () => void;
}): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <title>Seano's Trading Ideas</title>
        <meta
          name="description"
          content="Website for crypto news, price, and trading ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={darkMode ? "dark" : ""}>
        <NavBar dark={darkMode} setDark={handleDarkMode} />
        <main className="flex flex-col justify-center items-center text-stone-500 bg-stone-100 dark:text-stone-200 dark:bg-stone-800 min-h-screen">
          <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold">
            Welcome to...
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-8xl font-bold">
            World of Trading
          </h2>
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
          <span>Copyright SeanoChang</span>
        </footer>
      </div>
    </>
  );
};

export default ProtectedHome;
