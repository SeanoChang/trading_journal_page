import React, { useState, useEffect } from "react";

import { debounce } from "../../ultilities/debounce.js";
import { BiSun, BiMoon } from "react-icons/bi";

const NavBar = (props: {
  dark: boolean;
  setDark: () => void;
  links: string[];
}): JSX.Element => {
  // list of links to other sections of the page
  const links: JSX.Element[] = props.links.map((link: string, key: number) => {
    return (
      <a
        className="text-xs md:text-base lg:text-2xl hover:cursor-pointer hover:underline hover:underline-offset-4"
        key={key.toString()}
      >
        {link}
      </a>
    );
  });

  /* useState hooks to hide and show the navbar */
  // previous scroll position of y-axis
  const [prevScrollY, setPrevScrollY] = useState(0);

  // add shadow to navbar when the user scrolls up but not at the top of the page
  const [shadow, setShadow] = useState(false);

  // handle scroll event
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY !== 0) {
      setShadow(true);
    } else {
      setShadow(false);
    }

    // update previous scroll position
    setPrevScrollY(currentScrollY);
  };

  // add event listener to window
  useEffect(() => {
    window.addEventListener("scroll", debounce(handleScroll, 100));
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return (
    <div
      className={`flex flex-row items-center w-full h-16 z-20 sticky top-0 transition duration-150 bg-stone-200 dark:bg-stone-800 shadow-inherit ${
        !shadow ? "" : "shadow-lg"
      }`}
    >
      <div className="h-full lg:w-1/5"></div>
      <div className="flex flex-row items-center justify-around h-full w-[90%] lg:w-3/5">
        {links}
      </div>
      <div className="flex flex-row justify-center items-center h-full w-[10%] lg:w-1/5">
        <div
          className="text-base lg:text-3xl hover:cursor-pointer"
          onClick={props.setDark}
        >
          {props.dark ? <BiMoon /> : <BiSun />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
