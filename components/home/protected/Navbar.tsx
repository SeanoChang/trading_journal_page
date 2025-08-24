import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BsMoon, BsSun } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { RxExit } from "react-icons/rx";
import useDarkMode from "../useDarkMode";

const inPageLinks: string[] = ["Home", "Rules", "Ideas", "Resources"];

const NavBar = () => {
  // darkmode state
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // list of links to other sections of the page
  const links = inPageLinks.map((link: string, key: number) => {
    return (
      <a
        className="text-xs md:text-base lg:text-2xl hover:cursor-pointer hover:underline hover:underline-offset-4"
        key={key.toString()}
      >
        {link}
      </a>
    );
  });

  // setting the scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 20,
    restDelta: 0.005,
  });

  return (
    <div className="sticky z-20 top-0">
      <div
        className={`flex flex-row items-center w-full h-16 transition duration-100 bg-slate-50 dark:bg-[#161624] text-slate-600 dark:text-slate-200`}
      >
        <div className="h-full w-1/5 flex flex-col justify-center items-center">
          <RxExit
            className="text-xl lg:text-2xl hover:cursor-pointer"
            onClick={() => signOut()}
            href="/"
            title="Sign out"
          />
        </div>
        <div className="flex flex-row items-center justify-around h-full w-3/5">
          {links}
        </div>
        <div className="flex flex-row justify-center items-center h-full w-1/5">
          <button
            className="text-base lg:text-3xl hover:cursor-pointer"
            onClick={setDarkMode}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {darkMode ? <BsSun /> : <BsMoon />}
          </button>
        </div>
      </div>
      <motion.div
        className="h-1 bg-[#e07e2d] dark:bg-[#f1f13c]"
        style={{ scaleX }}
      />
    </div>
  );
};

export default NavBar;
