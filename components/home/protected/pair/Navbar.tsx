import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BsMoon, BsSun } from "react-icons/bs";
import useDarkMode from "../../useDarkMode";
import { RiArrowLeftCircleLine } from "react-icons/ri";

const NavBar = (props: { symbol: string }) => {
  // darkmode state
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
        <div className="h-full lg:w-1/5 flex flex-col justify-center items-center">
          <span className="text-slate-100 p-2 text-xl">
            <a
              href={`/protected/ideas_home`}
              className="flex flex-row items-center"
            >
              <RiArrowLeftCircleLine className="inline " />{" "}
              <span className="pl-1">back</span>
            </a>
          </span>
        </div>
        <div className="flex flex-row items-center justify-around h-full w-[90%] lg:w-3/5">
          <div className="h-full w-1/5 flex flex-row justify-center items-center">
            <span className="text-center text-base lg:text-2xl">
              {props.symbol.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center h-full w-[10%] lg:w-1/5">
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
