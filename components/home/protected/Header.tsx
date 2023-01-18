import React from "react";
import { motion } from "framer-motion";

const Header = (): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1 }}
      className="h-[60vh] flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold">
        Trading Ideas
      </h1>
      <p className="font-serif text-base md:text-xl lg:text-2xl p-2 m-1 mt-8">
        Not a good trader yet, but I&rsquo;m getting there.
      </p>
      <p className="font-serif text-base md:text-xl lg:text-2xl p-2 m-1 mb-8">
        Just recording my thoughts and ideas here as a way to keep track of my
        journey.
      </p>
    </motion.div>
  );
};

export default Header;
