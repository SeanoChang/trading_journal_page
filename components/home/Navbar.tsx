import React, { useEffect } from "react";
import BTC from "../../public/blockchain_icon/blockchain_04.png";
import ETH from "../../public/blockchain_icon/blockchain_14.png";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { BiHomeAlt, BiNews, BiDollar } from "react-icons/bi";
import { HiOutlineLightBulb } from "react-icons/hi";
import useDarkMode from "../home/useDarkMode";

const linkIcons: JSX.Element[] = [
  <BiHomeAlt className="text-2xl md:text-3xl lg:text-4xl" />,
  <BiDollar className="text-2xl md:text-3xl lg:text-4xl" />,
  <BiNews className="text-2xl md:text-3xl lg:text-4xl" />,
  <HiOutlineLightBulb className="text-2xl md:text-3xl lg:text-4xl" />,
];

const NavBar = (props: { links: string[] }): JSX.Element => {
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
  const links: JSX.Element[] = props.links.map((link: string, key: number) => {
    return (
      <a
        className="text-xs md:text-base lg:text-2xl hover:cursor-pointer hover:underline hover:underline-offset-4"
        href={`#${link.toLowerCase()}`}
        title={link}
        key={key.toString()}
      >
        {linkIcons[key]}
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
    <div className="sticky top-0 z-20">
      <div
        className={`flex flex-row items-center w-full h-16 transition duration-100 bg-slate-50 dark:bg-[#161624] text-slate-600 dark:text-slate-200`}
      >
        <div className="h-full w-1/5 flex flex-row justify-center items-center">
          <span className="text-center text-base lg:text-3xl">Home</span>
        </div>
        <div className="flex flex-row items-center justify-around h-full w-3/5">
          {links}
        </div>
        <div className="flex flex-row justify-center items-center h-full w-1/5">
          <div
            className="text-base lg:text-3xl hover:cursor-pointer"
            onClick={setDarkMode}
          >
            {darkMode ? (
              <Image src={ETH} alt="Light" width={35} height={35} />
            ) : (
              <Image src={BTC} alt="Dark" width={35} height={35} />
            )}
          </div>
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
