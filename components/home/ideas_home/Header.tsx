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
      <p className="text-base md:text-xl lg:text-2xl p-2 m-8">
        List of all trading pairs that I have traded or I will be trading. Hope
        you find some useful ideas GLHF!
      </p>
    </motion.div>
  );
};

export default Header;
